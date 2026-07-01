"use server";

import { createSupabasePublicServerClient } from "@/src/lib/supabasePublicServer";
import type { Order } from "@/src/types";

export async function lookupOrderAction(phone: string): Promise<Order[]> {
  // Clean phone input
  const cleanPhone = phone.replace(/\D/g, "");

  if (!/^[0-9]{10}$/.test(cleanPhone)) {
    throw new Error("Phone number must be exactly 10 digits.");
  }

  const supabase = createSupabasePublicServerClient();
  
  // Call the RPC function
  const { data, error } = await supabase.rpc("get_orders_by_phone", {
    phone_input: cleanPhone,
  });

  if (error) {
    const message = error.message.toLowerCase();
    const rpcNotAvailable = message.includes("get_orders_by_phone") || message.includes("schema cache");

    if (!rpcNotAvailable) {
      throw new Error(error.message);
    }

    // Fallback to direct query if RPC is missing
    const fallback = await supabase
      .from("orders")
      .select("*")
      .eq("customer_phone", cleanPhone)
      .order("created_at", { ascending: false })
      .limit(50);

    if (fallback.error) {
      throw new Error(fallback.error.message);
    }

    return (fallback.data ?? []) as Order[];
  }

  return (data ?? []) as Order[];
}
