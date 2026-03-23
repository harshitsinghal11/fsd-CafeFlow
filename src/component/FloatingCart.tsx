"use client";

import { useEffect } from "react";
import { useCartStore } from "@/src/store/cartStore";

export default function FloatingCart() {
  useEffect(() => {
    void useCartStore.persist?.rehydrate?.();
  }, []);

  const isHydrated = useCartStore.persist?.hasHydrated?.() ?? false;
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  // If loading or cart is empty, hide it
  if (!isHydrated || items.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 px-4 max-w-lg mx-auto z-50">
        <div className="bg-[#653100]/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl">

          {/* Left: Cart Info */}
          <div className="flex justify-between">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#DA944B]">
              {getTotalItems()} ITEMS ADDED
            </span>
            <span className="text-xl font-black text-white tracking-tight leading-none">
              ₹{getTotalPrice()}
            </span>
          </div>

        </div>
    </div>
  );
}
