import { describe, expect, it } from "vitest";
import { getActiveOrders, getHistoryOrders, isActiveStatus } from "./orderFilters";
import type { Order } from "../types/models";

function makeOrder(id: string, status: Order["status"]): Order {
  return {
    id,
    created_at: "2026-03-24T10:00:00.000Z",
    order_no: Number(id),
    customer_name: "Test User",
    customer_phone: "9999999999",
    items: [
      { id: "i1", name: "Cold Coffee", size: "S", price: 100, quantity: 1 },
    ],
    total_amount: 100,
    status,
  };
}

describe("orderFilters", () => {
  it("marks pending and preparing as active", () => {
    expect(isActiveStatus("pending")).toBe(true);
    expect(isActiveStatus("preparing")).toBe(true);
    expect(isActiveStatus("completed")).toBe(false);
  });

  it("returns active orders with pending first", () => {
    const orders = [
      makeOrder("1", "preparing"),
      makeOrder("2", "pending"),
      makeOrder("3", "completed"),
    ];
    const active = getActiveOrders(orders);
    expect(active.map((order) => order.status)).toEqual(["pending", "preparing"]);
  });

  it("returns filtered history", () => {
    const orders = [
      makeOrder("1", "pending"),
      makeOrder("2", "preparing"),
      makeOrder("3", "completed"),
      makeOrder("4", "cancelled"),
    ];

    expect(getHistoryOrders(orders, "all").length).toBe(2);
    expect(getHistoryOrders(orders, "completed").map((order) => order.status)).toEqual([
      "completed",
    ]);
    expect(getHistoryOrders(orders, "cancelled").map((order) => order.status)).toEqual([
      "cancelled",
    ]);
  });
});
