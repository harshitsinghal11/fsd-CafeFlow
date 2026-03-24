import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { OrderStatus } from "@/src/types/models";
import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/src/utils/adminSession";
import { createSupabaseAdminClient } from "@/src/utils/supabaseAdmin";

const ALLOWED_STATUSES: OrderStatus[] = [
  "pending",
  "preparing",
  "completed",
  "cancelled",
];

async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  const isValid = token ? await verifyAdminSessionToken(token) : false;
  return isValid;
}

export async function GET() {
  const isAdmin = await requireAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseAdmin = createSupabaseAdminClient();
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data ?? [] }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const isAdmin = await requireAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as { id?: string; status?: OrderStatus };
    const id = payload.id;
    const status = payload.status;

    if (!id || !status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid payload. Expected id and valid status." },
        { status: 400 }
      );
    }

    const supabaseAdmin = createSupabaseAdminClient();
    const { error } = await supabaseAdmin.from("orders").update({ status }).eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
