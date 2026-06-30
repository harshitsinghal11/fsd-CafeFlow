"use server";

import { createSupabaseAdminClient } from "@/src/lib/supabaseAdmin";
import { calculateWeeklyStats } from "@/src/lib/analytics";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionToken } from "@/src/lib/adminSession";

async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  return token ? await verifyAdminSessionToken(token) : false;
}

export async function fetchAnalyticsAction() {
  const isAdmin = await requireAdminSession();
  if (!isAdmin) throw new Error("Unauthorized");

  const supabaseAdmin = createSupabaseAdminClient();
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("total_amount, created_at")
    .eq("status", "completed");

  if (error) throw new Error(error.message);

  const stats = calculateWeeklyStats(data ?? []);
  return { stats };
}
