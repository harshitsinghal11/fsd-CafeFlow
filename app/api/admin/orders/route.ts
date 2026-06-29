import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { OrderStatus } from "@/src/types";
import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/src/lib/adminSession";
import { createSupabaseAdminClient } from "@/src/lib/supabaseAdmin";

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



