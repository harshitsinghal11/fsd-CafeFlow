"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart2, ChefHat, Clock, House, LogOut } from "lucide-react";
import { adminLogout } from "@/src/actions";
import type { Order, OrderStatus } from "@/src/types/models";

// Import Components
import ActiveOrderCard from "@/src/component/admin/ActiveOrderCard";
import OrderHistoryTable from "@/src/component/admin/OrderHistoryTable";
import OrderFilter from "@/src/component/admin/OrderFilter"; // <--- 1. Import Filter
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Add State for Filtering ('all', 'completed', 'cancelled')
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setOrders(data as Order[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchOrders();
    }, 0);

    const channel = supabase
      .channel('realtime orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        void fetchOrders();
      })
      .subscribe();

    return () => {
      window.clearTimeout(timeoutId);
      supabase.removeChannel(channel);
    };
  }, []);

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    setOrders(current => current.map(o => o.id === id ? { ...o, status: newStatus } : o));
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    if (error) { alert("Error updating order"); void fetchOrders(); }
  };

  // --- FILTERING LOGIC ---
  const activeOrders = orders
    .filter((o) => o.status === "pending" || o.status === "preparing")
    .sort((a, b) => {
      if (a.status === b.status) return 0;
      return a.status === "pending" ? -1 : 1;
    });

  // 3. Apply Filter to History
  const historyOrders = orders.filter(o => {
    // Exclude active orders from history
    if (o.status !== "completed" && o.status !== "cancelled") return false;

    // Then apply the user's selection
    if (filter === 'all') return true;
    return o.status === filter; // 'completed' or 'cancelled'
  });

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#653100]">Admin Panel</h1>
          <div className="flex gap-3">
            <Link href="/">
              <button className="p-3 bg-blue-100 text-blue-600 rounded-full shadow-sm hover:bg-blue-200 transition-all" title="View Sales Report">
                <House size={20} />
              </button>
            </Link>
            <Link href="/admin/analytics">
              <button className="p-3 bg-green-100 text-blue-600 rounded-full shadow-sm hover:bg-green-200 transition-all" title="View Sales Report">
                <BarChart2 size={20} />
              </button>
            </Link>

            <button onClick={() => adminLogout()} className="p-3 bg-red-100 text-red-600 rounded-full shadow-sm hover:bg-red-200 transition-all">
              <LogOut size={20} />
            </button>

          </div>
        </div>

        {/* ACTIVE ORDERS */}
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

        {/* HISTORY SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
            <Clock className="text-blue-600" /> Order History
          </h2>

          {/* 4. RENDER FILTER COMPONENT */}
          <OrderFilter currentFilter={filter} setFilter={setFilter} />
        </div>

        <OrderHistoryTable orders={historyOrders} />

      </div>
    </div>
  );
}
