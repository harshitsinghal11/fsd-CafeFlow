"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/src/store/cartStore";
import CartTimer from "@/src/component/cartTimer";
import { Trash2, ArrowLeft, CheckCircle, Coffee } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  // --- ZUSTAND STATE ---
  const { items, removeItem, getTotalPrice, clearCart } = useCartStore();

  // --- LOCAL STATE ---
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // Optional for tracking
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<number | null>(null); // Stores the Order No (e.g., 105)
  const [isMounted, setIsMounted] = useState(false);

  // Fix Hydration Mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- SUBMIT ORDER LOGIC ---
 const handlePlaceOrder = async (e: React.FormEvent) => {
  e.preventDefault();

  // 1. Validate Cart
  if (items.length === 0) return;

  // 2. Validate Name
  if (!name.trim()) {
    alert("Please enter your name!");
    return;
  }

  // 3. Validate Phone (Strict 10 Digits)
  // Ensure we strip spaces just in case
  const cleanPhone = phone.replace(/\D/g, ''); 
  if (cleanPhone.length !== 10) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  setLoading(true);

  try {
    // 4. Prepare Data
    // We sanitize items to ensure they fit neatly into JSONB
    const orderItems = items.map(item => ({
      id: item.id,
      name: item.name,
      size: item.size,
      price: item.price,
      quantity: item.quantity
    }));

    // 5. Place order through protected API route
    const response = await fetch("/api/orders/place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: name,
        customer_phone: cleanPhone,
        items: orderItems,
        total_amount: Math.round(getTotalPrice()),
      }),
    });

    const payload = (await response.json()) as { order_no?: number; error?: string };
    if (!response.ok || !payload.order_no) {
      throw new Error(payload.error ?? "Unable to place order.");
    }

    // 6. Success!
    setOrderSuccess(payload.order_no); // This comes from your 'order_no' column

    // 7. Clear the cart & timer
    clearCart();

    // 8. Save to Local History (For "My Orders" feature later)
    const history = JSON.parse(localStorage.getItem("my_orders") || "[]");
    // We save an object with ID and Date
    history.push({ id: payload.order_no, date: new Date().toISOString() });
    localStorage.setItem("my_orders", JSON.stringify(history));

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Order Failed:", errorMessage);
    alert("Order failed! " + errorMessage);
  } finally {
    setLoading(false);
  }
};

  // --- RENDER: LOADING / EMPTY STATE ---
  if (!isMounted) return null;

  // --- RENDER: SUCCESS SCREEN ---
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f8f8f8] text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 animate-in zoom-in duration-300">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-3xl font-extrabold text-[#653100] mb-2">Order Received!</h1>
        <p className="text-gray-500 mb-8">Sit tight, we are brewing your coffee.</p>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-dashed border-gray-300 w-full max-w-xs relative">
          <div className="absolute -left-3 top-1/2 w-6 h-6 bg-[#f8f8f8] rounded-full"></div>
          <div className="absolute -right-3 top-1/2 w-6 h-6 bg-[#f8f8f8] rounded-full"></div>

          <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-2">Your Token Number</p>
          <p className="text-6xl font-black text-[#DA944B]">#{orderSuccess}</p>
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-10 text-[#653100] font-bold hover:underline"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // --- RENDER: MAIN CHECKOUT FORM ---
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 bg-[#f8f8f8]">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

        {/* LEFT: CART SUMMARY */}
        <div className="order-2 md:order-1">
          <h2 className="text-2xl font-bold text-[#653100] flex items-center gap-2">
            <Coffee size={24} /> Your Items
          </h2>
          {items.length > 0 && <CartTimer />}
          {items.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl shadow-sm border mt-4 border-gray-100">
              <p className="text-gray-400 mb-4">Your cart is empty.</p>
              <Link href="/" className="text-[#DA944B] font-bold hover:underline">Browse Menu</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-[#3a2008]">{item.name}</h3>
                    <p className="text-xs text-gray-400 font-medium">Size: {item.size === 'Std' ? 'Regular' : item.size}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-600">x{item.quantity}</span>
                    <span className="font-bold text-[#653100]">₹{item.price * item.quantity}</span>
                    <button
                      onClick={() => removeItem(item.id, item.size)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Total Calculation */}
              <div className="bg-[#653100] text-[#ffffff] p-6 rounded-2xl shadow-lg mt-6 flex justify-between items-center">
                <span className="opacity-80 font-medium">Total to Pay</span>
                <span className="text-2xl font-black">₹{getTotalPrice()}</span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: CHECKOUT FORM */}
        <div className="order-1 md:order-2">
          <div className="bg-white p-6 md:p-8 rounded-[30px] shadow-xl border border-gray-100 sticky top-24">
            <div className="flex items-center gap-3 mb-8">
              <Link href="/" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <h1 className="text-xl font-bold text-gray-800">Checkout Details</h1>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-5">

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required // HTML5 validation
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#f8f8f8] border border-gray-200 rounded-xl px-4 py-3 font-bold text-[#3a2008] focus:outline-none focus:ring-2 focus:ring-[#DA944B]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Phone Input (Strict 10 Digits) */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required // HTML5 validation
                  pattern="[0-9]{10}" // Regex: must be exactly 10 digits
                  maxLength={10} // Prevents typing more than 10
                  placeholder="e.g. 9876543210"
                  title="Please enter a valid 10-digit mobile number"
                  className="w-full bg-[#f8f8f8] border border-gray-200 rounded-xl px-4 py-3 font-medium text-[#3a2008] focus:outline-none focus:ring-2 focus:ring-[#DA944B]"
                  value={phone}
                  onChange={(e) => {
                    // Logic: Allow only numbers and max 10 chars
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) setPhone(val);
                  }}
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Required for order tracking (10 digits only).
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full bg-[#DA944B] hover:bg-[#c27d35] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex justify-center items-center gap-2 mt-4"
              >
                {loading ? (
                  <span className="animate-pulse">Placing Order...</span>
                ) : (
                  <>Confirm Order <CheckCircle size={20} /></>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
