export type OrderStatus = "pending" | "preparing" | "completed" | "cancelled";

export interface OrderItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  created_at: string;
  order_no: number;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
}

export interface MenuItem {
  id: string;
  created_at?: string;
  name: string;
  category: string;
  price_s: number;
  price_l: number | null;
  is_available?: boolean | null;
}
