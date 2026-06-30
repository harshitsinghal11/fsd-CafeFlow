import useSWR from "swr";
import type { Order } from "@/src/types";
import { fetchAdminOrdersAction } from "@/src/actions/orderActions";

const fetcher = async () => {
  try {
    const { orders } = await fetchAdminOrdersAction();
    return orders as Order[];
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      window.location.href = "/login";
    }
    throw error;
  }
};

export function useOrders(refreshInterval = 5000) {
  const { data, error, isLoading, mutate } = useSWR("admin_orders", fetcher, {
    refreshInterval,
  });

  return {
    orders: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
