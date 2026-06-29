import useSWR from "swr";
import type { Order } from "@/src/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  const payload = await res.json();
  if (!res.ok) throw new Error(payload.error ?? "Failed to fetch orders");
  return payload.orders as Order[];
};

export function useOrders(refreshInterval = 5000) {
  const { data, error, isLoading, mutate } = useSWR("/api/admin/orders", fetcher, {
    refreshInterval,
  });

  return {
    orders: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
