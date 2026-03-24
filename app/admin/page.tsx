"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart2, ChefHat, Clock, House, LogOut } from "lucide-react";
import { adminLogout } from "@/src/actions";
import type { Order, OrderStatus } from "@/src/types/models";
import {
  getActiveOrders,
  getHistoryOrders,
  type HistoryFilter,
} from "@/src/utils/orderFilters";
import ActiveOrderCard from "@/src/component/admin/ActiveOrderCard";
import OrderHistoryTable from "@/src/component/admin/OrderHistoryTable";
import OrderFilter from "@/src/component/admin/OrderFilter";
import Link from "next/link";

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<HistoryFilter>("all");

  const fetchOrders = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);

    try {
      const response = await fetch("/api/admin/orders", { cache: "no-store" });
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const payload = (await response.json()) as { orders?: Order[]; error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to fetch orders.");
      }

      setOrders(payload.orders ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch orders.";
      alert(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoadId = window.setTimeout(() => {
      void fetchOrders(true);
    }, 0);

    const pollId = window.setInterval(() => {
      void fetchOrders();
    }, 5000);

    return () => {
      window.clearTimeout(initialLoadId);
      window.clearInterval(pollId);
    };
  }, [fetchOrders]);

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );

    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      alert(payload.error ?? "Error updating order");
      void fetchOrders();
    }
  };

  const activeOrders = getActiveOrders(orders);
  const historyOrders = getHistoryOrders(orders, filter);

  if (loading) {
    return (
      <div className="p-10 text-center font-bold text-gray-500">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#653100]">Admin Panel</h1>
          <div className="flex gap-3">
            <Link href="/">
              <button
                className="p-3 bg-blue-100 text-blue-600 rounded-full shadow-sm hover:bg-blue-200 transition-all"
                title="Go Home"
              >
                <House size={20} />
              </button>
            </Link>
            <Link href="/admin/analytics">
              <button
                className="p-3 bg-green-100 text-blue-600 rounded-full shadow-sm hover:bg-green-200 transition-all"
                title="View Sales Report"
              >
                <BarChart2 size={20} />
              </button>
            </Link>

            <button
              onClick={() => adminLogout()}
              className="p-3 bg-red-100 text-red-600 rounded-full shadow-sm hover:bg-red-200 transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <ChefHat className="text-[#DA944B]" /> Active Orders ({activeOrders.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activeOrders.map((order) => (
            <ActiveOrderCard key={order.id} order={order} onUpdateStatus={updateStatus} />
          ))}
          {activeOrders.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <ChefHat size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400 font-medium">No active orders.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
            <Clock className="text-blue-600" /> Order History
          </h2>
          <OrderFilter currentFilter={filter} setFilter={setFilter} />
        </div>

        <OrderHistoryTable orders={historyOrders} />
      </div>
    </div>
  );
}
