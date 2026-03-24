import { NextResponse } from "next/server";
import { createSupabasePublicServerClient } from "@/src/utils/supabasePublicServer";
import type { OrderItem } from "@/src/types/models";

interface PlaceOrderPayload {
  customer_name?: string;
  customer_phone?: string;
  items?: OrderItem[];
  total_amount?: number;
}

function isValidPhone(phone: string): boolean {
  return /^[0-9]{10}$/.test(phone);
}

function isValidItems(items: unknown): items is OrderItem[] {
  return Array.isArray(items) && items.length > 0;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as PlaceOrderPayload;
    const customerName = payload.customer_name?.trim() ?? "";
    const customerPhone = payload.customer_phone?.replace(/\D/g, "") ?? "";
    const items = payload.items;
    const totalAmount = Math.round(payload.total_amount ?? 0);

    if (!customerName) {
      return NextResponse.json(
        { error: "Customer name is required." },
        { status: 400 }
      );
    }

    if (!isValidPhone(customerPhone)) {
      return NextResponse.json(
        { error: "Phone number must be exactly 10 digits." },
        { status: 400 }
      );
    }

    if (!isValidItems(items)) {
      return NextResponse.json(
        { error: "At least one item is required." },
        { status: 400 }
      );
    }

    if (totalAmount < 0) {
      return NextResponse.json({ error: "Invalid total amount." }, { status: 400 });
    }

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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order_no: data.order_no }, { status: 200 });
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
