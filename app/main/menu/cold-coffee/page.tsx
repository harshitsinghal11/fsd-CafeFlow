import { createSupabasePublicServerClient } from "@/src/lib/supabasePublicServer";
import MenuItemCard from "@/src/components/feature/menu/MenuItemCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ColdCoffeePage() {
  const supabase = createSupabasePublicServerClient();
  // We use the anon key here because menu_items is readable by public (anon)
  const { data: items } = await supabase
    .from("menu_items")
    .select("*")
    .eq("category", "Cold Coffee") // Filter by exact category name in DB
    .order("price_s", { ascending: true });

  return (
    <main className="min-h-screen pt-24 pb-12 px-6">
      
      {/* Header with Back Button */}
      <div className="max-w-6xl mx-auto mb-10 mt-5 flex items-center gap-4">
        <Link href="/" className="p-3 rounded-full bg-white shadow-sm hover:shadow-md transition-all">
          <ArrowLeft size={20} className="text-[#653100]"/>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-[#653100]">Cold Coffees</h1>
          <p className="text-gray-500">Beat the heat with our chilled brews.</p>
        </div>
      </div>

      {/* The Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items?.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
        
        {(!items || items.length === 0) && (
           <p className="text-gray-400 col-span-full text-center">No coffees found.</p>
        )}
      </div>
    </main>
  );
}
