"use client"; // Required for accessing Cart Store

import Link from "next/link";
import { PackageOpen, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/src/store/cartStore";
import { useEffect } from "react";

export default function Navbar() {
  useEffect(() => {
    void useCartStore.persist?.rehydrate?.();
  }, []);

  const isHydrated = useCartStore.persist?.hasHydrated?.() ?? false;
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    // Container: Transparent, Fixed at top
    <nav className="w-full flex justify-center items-center py-6 bg-transparent absolute top-0 z-50 px-4">

      {/* 1. CENTER: Brand Logo & Name */}
      <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity z-10">

        {/* Right: Brand Name */}
        <span className="text-2xl font-bold tracking-wide text-[#653100]">
          CafeFlow
        </span>
      </Link>

      <Link
        href="/main/my-orders"
        className="absolute right-20 md:right-28 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all text-[#653100] border border-[#653100]/10"
        title="My Orders"
      >
        <PackageOpen size={24}/>
      </Link>
      
      {/* 2. RIGHT: Cart Button (Positioned Absolute) */}
      <Link
        href="/main/checkout"
        className="absolute right-6 md:right-10 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all text-[#653100] border border-[#653100]/10"
      >
        <div className="relative">
          <ShoppingBag size={24} />

          {/* Badge: Show only if items exist */}
          {isHydrated && totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#DA944B] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border border-white">
              {totalItems}
            </span>
          )}
        </div>
      </Link>

    </nav>
  );
}
