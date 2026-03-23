import { CheckCircle, Ban } from "lucide-react";
import type { Order } from "@/src/types/models";

interface Props {
  orders: Order[];
}

export default function OrderHistoryTable({ orders }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="p-4 font-bold text-gray-500 text-sm">Token</th>
            <th className="p-4 font-bold text-gray-500 text-sm">Customer</th>
            <th className="p-4 font-bold text-gray-500 text-sm">Items</th>
            <th className="p-4 font-bold text-gray-500 text-sm">Amount</th>
            <th className="p-4 font-bold text-gray-500 text-sm">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.slice(0, 15).map((order) => (
            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="p-4 font-bold text-gray-800">#{order.order_no}</td>
              <td className="p-4 text-sm">
                <div className="font-bold text-[#653100]">{order.customer_name}</div>
                <div className="text-xs text-gray-400">{order.customer_phone}</div>
              </td>
              <td className="p-4 text-sm text-gray-600">
                {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
              </td>
              <td className="p-4 font-bold text-gray-800">₹{order.total_amount}</td>
              <td className="p-4">
                {order.status === "completed" ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                    <CheckCircle size={12} /> Completed
                  </span>
                ) : order.status === "cancelled" ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                    <Ban size={12} /> Cancelled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200 capitalize">
                    {order.status}
                  </span>
                )}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-gray-400">No history available yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
