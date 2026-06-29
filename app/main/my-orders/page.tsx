"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, Package, Phone, RefreshCw } from "lucide-react";
import type { OrderStatus } from "@/src/types";
import { useCustomerOrders } from "@/src/hooks/data/useCustomerOrders";

export default function MyOrdersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const { orders, isLoading, error } = useCustomerOrders(searchPhone);

  useEffect(() => {
    const savedPhone = localStorage.getItem("user_phone");
    if (savedPhone) {
      setSearchInput(savedPhone);
      setSearchPhone(savedPhone);
      setHasSearched(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.length === 10) {
      localStorage.setItem("user_phone", searchInput);
      setSearchPhone(searchInput);
      setHasSearched(true);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "preparing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#f8f8f8]">
      <div className="max-w-md mx-auto">
        <div className="mb-8 mt-5 text-center">
          <h1 className="text-3xl font-extrabold text-[#653100] mb-2">My Orders</h1>
          <p className="text-gray-500">Enter your number to track your coffee.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="tel"
                placeholder="Enter Phone (e.g. 9876543210)"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#f8f8f8] border-none font-bold text-[#3a2008] focus:ring-2 focus:ring-[#DA944B]"
                value={searchInput}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setSearchInput(value);
                }}
                maxLength={10}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || searchInput.length < 10}
              className="w-full bg-[#653100] text-white font-bold py-3 rounded-xl shadow-lg hover:bg-[#DA944B] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <RefreshCw className="animate-spin" /> : "Find Orders"}
            </button>
          </form>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
            {error.message}
          </div>
        )}

        {hasSearched && !isLoading && orders.length === 0 && !error && (
          <div className="text-center py-10 opacity-50">
            <Package size={48} className="mx-auto mb-2 text-gray-300" />
            <p>No orders found for this number.</p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Token No
                  </span>
                  <p className="text-2xl font-black text-[#653100]">#{order.order_no}</p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)} capitalize flex items-center gap-1`}
                >
                  {order.status === "completed" ? (
                    <CheckCircle size={12} />
                  ) : (
                    <Clock size={12} />
                  )}
                  {order.status}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 mb-3 space-y-1">
                {order.items.map((item, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">
                      {item.quantity}x {item.name}{" "}
                      <span className="text-xs text-gray-400">({item.size})</span>
                    </span>
                    <span className="font-bold text-gray-800">
                      Rs. {item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  Ordered on {new Date(order.created_at).toLocaleDateString()}
                </span>
                <span className="text-lg font-black text-[#DA944B]">
                  Rs. {order.total_amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

