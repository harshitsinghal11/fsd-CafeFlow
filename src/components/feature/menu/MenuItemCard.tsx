"use client";
import { useCartStore } from "@/src/store/cartStore"; // <--- Import Store
import type { MenuItem } from "@/src/types";

interface MenuItemProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemProps) {
  const largePrice = item.price_l ?? 0;
  const hasLarge = largePrice > 0;
  
  // 1. Get the 'addItem' function from our store
  const addItem = useCartStore((state) => state.addItem);

  // 2. Helper to handle the click
  const handleAdd = (size: string, price: number) => {
    addItem({
      id: item.id,
      name: item.name,
      price: price,
      size: size,
    });
    
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
      
      <div className="p-5 flex flex-col grow">
        {/* ... Title Code (Keep as is) ... */}
        <div className="mb-4">
          <h3 className="font-extrabold text-lg text-[#3a2008] leading-tight line-clamp-2">
            {item.name}
          </h3>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
            {item.category}
          </p>
        </div>

        <div className="mt-auto pt-4">
          {hasLarge ? ( 
            
            // DUAL BUTTONS
            <div className="grid grid-cols-2 gap-3">
              <button 
                className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#f8f8f8] border border-gray-200 hover:border-[#DA944B] hover:bg-[#fff8f0] active:scale-95 transition-all group/btn"
                onClick={() => handleAdd("S", item.price_s)} // <--- CONNECTED
              >
                <span className="text-[10px] font-bold text-gray-500 group-hover/btn:text-[#DA944B] uppercase">Regular</span>
                <span className="text-sm font-black text-[#3a2008]">â‚¹{item.price_s}</span>
              </button>

              <button 
                className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#653100] text-white shadow-lg hover:bg-[#DA944B] active:scale-95 transition-all"
                onClick={() => handleAdd("L", largePrice)} // <--- CONNECTED
              >
                <span className="text-[10px] font-bold opacity-80 uppercase">Large</span>
                <span className="text-sm font-black">â‚¹{largePrice}</span>
              </button>
            </div>
          ) : (
            // SINGLE BUTTON
            <button 
              className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-[#3a2008] text-white shadow-md hover:bg-[#DA944B] active:scale-95 transition-all"
              onClick={() => handleAdd("Std", item.price_s)} // <--- CONNECTED
            >
              <span className="font-bold text-sm">Add to Order</span>
              <div className="bg-white/20 px-2 py-1 rounded text-sm font-black">
                â‚¹{item.price_s}
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

