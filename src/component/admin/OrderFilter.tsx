import { Filter, CheckCircle, Ban, Layers } from "lucide-react";
import type { HistoryFilter } from "@/src/utils/orderFilters";

interface Props {
  currentFilter: HistoryFilter;
  setFilter: (filter: HistoryFilter) => void;
}

export default function OrderFilter({ currentFilter, setFilter }: Props) {
  
  // Helper to stylize the active button
  const getButtonClass = (filterName: HistoryFilter, activeColor: string) => {
    const isActive = currentFilter === filterName;
    return `flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all border ${
      isActive 
        ? `${activeColor} text-white shadow-md` 
        : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
    }`;
  };

  return (
    <div className="flex items-center gap-3 mb-6 animate-in slide-in-from-left-5 duration-300">
      <span className="text-gray-400 text-sm font-bold flex items-center gap-1">
        <Filter size={14} /> Filter:
      </span>

      {/* 1. ALL Button */}
      <button 
        onClick={() => setFilter('all')}
        className={getButtonClass('all', 'bg-blue-600 border-blue-600')}
      >
        <Layers size={14} /> All
      </button>

      {/* 2. COMPLETED Button */}
      <button 
        onClick={() => setFilter('completed')}
        className={getButtonClass('completed', 'bg-green-600 border-green-600')}
      >
        <CheckCircle size={14} /> Completed
      </button>

      {/* 3. CANCELLED Button */}
      <button 
        onClick={() => setFilter('cancelled')}
        className={getButtonClass('cancelled', 'bg-red-500 border-red-500')}
      >
        <Ban size={14} /> Cancelled
      </button>
    </div>  
  );
}
