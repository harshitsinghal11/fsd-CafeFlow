import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/src/utils/adminSession";
import { createSupabaseAdminClient } from "@/src/utils/supabaseAdmin";
import { calculateWeeklyStats } from "@/src/utils/analytics";

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
      .select("total_amount, created_at")
      .eq("status", "completed");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const stats = calculateWeeklyStats(data ?? []);
    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
