import { NextResponse } from "next/server";
import type { Order } from "@/src/types/models";
import { createSupabasePublicServerClient } from "@/src/utils/supabasePublicServer";

function normalizePhone(input: string): string {
  return input.replace(/\D/g, "");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = normalizePhone(searchParams.get("phone") ?? "");

    if (!/^[0-9]{10}$/.test(phone)) {
      return NextResponse.json(
        { error: "Phone number must be exactly 10 digits." },
        { status: 400 }
      );
    }

    const supabase = createSupabasePublicServerClient();
    const { data, error } = await supabase.rpc("get_orders_by_phone", {
      phone_input: phone,
    });

    if (error) {
      const message = error.message.toLowerCase();
      const rpcNotAvailable =
        message.includes("get_orders_by_phone") || message.includes("schema cache");

      if (!rpcNotAvailable) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const fallback = await supabase
        .from("orders")
        .select("*")
        .eq("customer_phone", phone)
        .order("created_at", { ascending: false })
        .limit(50);

      if (fallback.error) {
        return NextResponse.json({ error: fallback.error.message }, { status: 500 });
      }

      return NextResponse.json(
        { orders: (fallback.data ?? []) as Order[] },
        { status: 200 }
      );
    }

    return NextResponse.json({ orders: (data ?? []) as Order[] }, { status: 200 });
  } catch (error) {
    const rawMessage =
      error instanceof Error ? error.message : "Unknown server error.";
    const message =
      rawMessage.includes("ENOTFOUND") || rawMessage.includes("getaddrinfo")
        ? "Supabase host is not reachable. Verify NEXT_PUBLIC_SUPABASE_URL and your internet/DNS."
        : rawMessage;

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
