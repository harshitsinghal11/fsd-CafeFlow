import useSWR from "swr";
import type { Order } from "@/src/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const payload = await res.json();
  if (!res.ok) throw new Error(payload.error ?? "Unable to fetch orders right now.");
  return payload.orders as Order[];
};

export function useCustomerOrders(phone: string) {
  const isValid = phone.length === 10;
  const { data, error, isLoading, mutate } = useSWR(
    isValid ? `/api/orders/lookup?phone=${encodeURIComponent(phone)}` : null,
    fetcher
  );

  return {
    orders: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
