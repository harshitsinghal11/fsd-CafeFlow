import { createSupabasePublicServerClient } from "@/src/lib/supabasePublicServer";
import MenuItemCard from "@/src/components/feature/menu/MenuItemCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function MocktailsPage() {
  const supabase = createSupabasePublicServerClient();
  const { data: items } = await supabase
    .from("menu_items")
    .select("*")
    .eq("category", "Mocktail"); 

  return (
    <main className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mt-5 mx-auto mb-10 flex items-center gap-4">
        <Link href="/" className="p-3 rounded-full bg-white shadow-sm hover:shadow-md transition-all">
          <ArrowLeft size={20} className="text-[#653100]"/>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-[#653100]">Mocktails</h1>
          <p className="text-gray-500">Refreshing sips for a sunny day.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items?.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
