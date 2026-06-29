"use server";

import { createSupabasePublicServerClient } from "@/src/lib/supabasePublicServer";
import { createSupabaseAdminClient } from "@/src/lib/supabaseAdmin";
import type { OrderItem, OrderStatus } from "@/src/types";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionToken } from "@/src/lib/adminSession";

interface PlaceOrderPayload {
  customer_name?: string;
  customer_phone?: string;
  items?: OrderItem[];
  total_amount?: number;
}

const ALLOWED_STATUSES: OrderStatus[] = [
  "pending",
  "preparing",
  "completed",
  "cancelled",
];

async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  return token ? await verifyAdminSessionToken(token) : false;
}

export async function placeOrderAction(payload: PlaceOrderPayload) {
  const customerName = payload.customer_name?.trim() ?? "";
  const customerPhone = payload.customer_phone?.replace(/\D/g, "") ?? "";
  const items = payload.items;
  const totalAmount = Math.round(payload.total_amount ?? 0);

  if (!customerName) throw new Error("Customer name is required.");
  if (!/^[0-9]{10}$/.test(customerPhone)) throw new Error("Phone number must be exactly 10 digits.");
  if (!Array.isArray(items) || items.length === 0) throw new Error("At least one item is required.");
  if (totalAmount < 0) throw new Error("Invalid total amount.");

  try {
    const supabase = createSupabasePublicServerClient();
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: customerName,
          customer_phone: customerPhone,
          items,
          total_amount: totalAmount,
          status: "pending",
        },
      ])
      .select("order_no")
      .single();

    if (error) throw new Error(error.message);
    return { order_no: data.order_no };
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : "Unknown server error.";
    const message = rawMessage.includes("ENOTFOUND") || rawMessage.includes("getaddrinfo")
      ? "Supabase host is not reachable. Verify NEXT_PUBLIC_SUPABASE_URL and your internet/DNS."
      : rawMessage;
    throw new Error(message);
  }
}

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  const isAdmin = await requireAdminSession();
  if (!isAdmin) throw new Error("Unauthorized");

  if (!id || !status || !ALLOWED_STATUSES.includes(status)) {
    throw new Error("Invalid payload. Expected id and valid status.");
  }

  const supabaseAdmin = createSupabaseAdminClient();
  const { error } = await supabaseAdmin.from("orders").update({ status }).eq("id", id);

  if (error) throw new Error(error.message);
  return { success: true };
}
