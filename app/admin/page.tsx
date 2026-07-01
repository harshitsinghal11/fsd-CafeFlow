"use client";

import { useState } from "react";
import { BarChart2, ChefHat, Clock, House, LogOut } from "lucide-react";
import { adminLogout } from "@/src/actions/authActions";
import { updateOrderStatusAction } from "@/src/actions/orderActions";
import type { OrderStatus } from "@/src/types";
import {
  getActiveOrders,
  getHistoryOrders,
  type HistoryFilter,
} from "@/src/lib/orderFilters";
import ActiveOrderCard from "@/src/components/feature/admin/ActiveOrderCard";
import OrderHistoryTable from "@/src/components/feature/admin/OrderHistoryTable";
import OrderFilter from "@/src/components/feature/admin/OrderFilter";
import DashboardSkeleton from "@/src/components/feature/admin/DashboardSkeleton";
import Link from "next/link";
import { useOrders } from "@/src/hooks/data/useOrders";
import { toast } from "sonner"; // Also add toast for update error

export default function AdminPage() {
  const { orders, isLoading, mutate } = useOrders(5000);
  const [filter, setFilter] = useState<HistoryFilter>("all");

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    // Optimistic update
    mutate(
      orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      ),
      false
    );

    try {
      await updateOrderStatusAction(id, newStatus);
      mutate();
      toast.success(`Order #${id} updated to ${newStatus}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error updating order");
      mutate(); // Revert on error
    }
  };

  const activeOrders = getActiveOrders(orders);
  const historyOrders = getHistoryOrders(orders, filter);

  if (isLoading && orders.length === 0) {
    return <DashboardSkeleton />;
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

            <form action={adminLogout}>
              <button
                type="submit"
                className="p-3 bg-red-100 text-red-600 rounded-full shadow-sm hover:bg-red-200 transition-all"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </form>
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

