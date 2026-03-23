"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Calendar, BarChart3 } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Weekday =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

interface DayStats {
  count: number;
  revenue: number;
}

interface AnalyticsStats {
  daily: Record<Weekday, DayStats>;
  weekTotal: number;
  weekCount: number;
}

interface CompletedOrderRow {
  total_amount: number;
  created_at: string;
}

const allDays: Weekday[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const displayOrder: Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function getInitialDailyStats(): Record<Weekday, DayStats> {
  return {
    Sunday: { count: 0, revenue: 0 },
    Monday: { count: 0, revenue: 0 },
    Tuesday: { count: 0, revenue: 0 },
    Wednesday: { count: 0, revenue: 0 },
    Thursday: { count: 0, revenue: 0 },
    Friday: { count: 0, revenue: 0 },
    Saturday: { count: 0, revenue: 0 },
  };
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AnalyticsStats>({
    daily: getInitialDailyStats(),
    weekTotal: 0,
    weekCount: 0,
  });

  const calculateStats = async () => {
    const { data } = await supabase
      .from("orders")
      .select("total_amount, created_at")
      .eq("status", "completed");

    const completedOrders = (data ?? []) as CompletedOrderRow[];
    const dailyStats = getInitialDailyStats();
    let totalRevenue = 0;
    let totalOrders = 0;

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    completedOrders.forEach((order) => {
      const orderDate = new Date(order.created_at);

      if (orderDate >= startOfWeek) {
        const dayName = allDays[orderDate.getDay()];

        dailyStats[dayName].revenue += order.total_amount;
        dailyStats[dayName].count += 1;
        totalRevenue += order.total_amount;
        totalOrders += 1;
      }
    });

    setStats({
      daily: dailyStats,
      weekTotal: totalRevenue,
      weekCount: totalOrders,
    });
    setLoading(false);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void calculateStats();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 font-bold">
        Calculating Sales...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="p-3 bg-white rounded-full shadow-sm hover:shadow-md text-gray-600 transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-extrabold text-[#653100]">Sales Reports</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-linear-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <span className="font-bold uppercase tracking-wider text-xs">
                This Week&apos;s Revenue
              </span>
            </div>
            <p className="text-4xl font-black">Rs. {stats.weekTotal.toLocaleString()}</p>
          </div>

          <div className="bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <BarChart3 size={20} />
              <span className="font-bold uppercase tracking-wider text-xs">
                Total Orders Sold
              </span>
            </div>
            <p className="text-4xl font-black">{stats.weekCount}</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Calendar className="text-[#DA944B]" /> Weekly Breakdown
        </h2>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
          {displayOrder.map((day) => {
            const dayData = stats.daily[day];
            const isToday =
              new Date().toLocaleDateString("en-US", { weekday: "long" }) === day;

            return (
              <div
                key={day}
                className={`flex items-center justify-between p-5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${isToday ? "bg-blue-50/50" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2 h-10 rounded-full ${dayData.count > 0 ? "bg-[#DA944B]" : "bg-gray-200"}`}
                  ></div>
                  <div>
                    <p
                      className={`font-bold text-lg ${isToday ? "text-blue-600" : "text-gray-700"}`}
                    >
                      {day}{" "}
                      {isToday && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full ml-2">
                          Today
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {dayData.count} orders completed
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-black text-xl text-gray-800">Rs. {dayData.revenue}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
