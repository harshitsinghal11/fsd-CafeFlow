import type { Order, OrderStatus } from "@/src/types/models";

export type HistoryFilter = "all" | "completed" | "cancelled";

export function isActiveStatus(status: OrderStatus): boolean {
  return status === "pending" || status === "preparing";
}

export function getActiveOrders(orders: Order[]): Order[] {
  return orders
    .filter((order) => isActiveStatus(order.status))
    .sort((a, b) => {
      if (a.status === b.status) return 0;
      return a.status === "pending" ? -1 : 1;
    });
}

export function getHistoryOrders(orders: Order[], filter: HistoryFilter): Order[] {
  return orders.filter((order) => {
    if (order.status !== "completed" && order.status !== "cancelled") return false;
    if (filter === "all") return true;
    return order.status === filter;
  });
}
