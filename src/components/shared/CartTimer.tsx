"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/src/store/cartStore";
import { Timer } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartTimer() {
  const router = useRouter();
  const { expiryTime, checkExpiry } = useCartStore();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    // Run this check every second
    const interval = setInterval(() => {
      // 1. Check if expired completely
      if (checkExpiry()) {
        alert("Session Expired! Cart cleared.");
        router.push("/"); // Send back to home
        return;
      }

      // 2. Calculate remaining string
      if (expiryTime) {
        const diff = expiryTime - Date.now();
        if (diff > 0) {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          
          setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
          
          // Make it red if less than 2 minutes
          setIsUrgent(diff < 2 * 60 * 1000);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime, checkExpiry, router]);

  if (!expiryTime) return null;

  return (
    <div className={`flex items-center gap-2 text-sm font-bold px-3 py-4 rounded-full transition-colors ${isUrgent ? 'text-red-600 border-red-200 animate-pulse' : 'text-[#653100]'}`}>
      <Timer size={14} />
      <span>{timeLeft}</span>
    </div>
  );
}
