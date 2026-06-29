import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#26160C] text-white pt-15 pb-10">

      {/* --- MAIN FOOTER CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-12">
          
          {/* 1. BRAND SECTION (Span 4) */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-2 text-[#DA944B]">
               <span className="text-2xl font-bold tracking-wide text-white">CafeFlow</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              Brewing moments of joy, one cup at a time. Experience the authentic taste of freshly ground beans right here in the heart of Faridabad.
            </p>
            <div className="flex gap-4 pt-2">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#DA944B] hover:text-white transition-all duration-300 group">
                  <Icon size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1"></div>

          {/* 2. MENU LINKS (Span 2) */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-bold text-white mb-6">Our Menu</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li><Link href="/main/menu/cold-coffee" className="hover:text-[#DA944B] hover:translate-x-1 inline-block transition-all">Cold Coffee</Link></li>
              <li><Link href="/main/menu/thick-shakes" className="hover:text-[#DA944B] hover:translate-x-1 inline-block transition-all">Thick Shakes</Link></li>
              <li><Link href="/main/menu/mocktails" className="hover:text-[#DA944B] hover:translate-x-1 inline-block transition-all">Mocktails</Link></li>
            </ul>
          </div>

          {/* 4. CONTACT INFO (Span 3) */}
          <div className="md:col-span-3">
             <h4 className="text-lg font-bold text-white mb-6">Visit Us</h4>
             <ul className="space-y-5 text-gray-400 text-sm">
                <li className="flex items-start gap-3 group">
                  <div className="p-2 bg-white/5 rounded-full group-hover:bg-[#DA944B] group-hover:text-white transition-colors">
                    <MapPin size={16} />
                  </div>
                  <span className="leading-tight">Sec-58<br/>Faridabad, Haryana</span>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="p-2 bg-white/5 rounded-full group-hover:bg-[#DA944B] group-hover:text-white transition-colors">
                    <Phone size={16} />
                  </div>
                  <span>+91 98XXX XXXXX</span>
                </li>
                <li className="flex items-center gap-3 group">
                   <div className="p-2 bg-white/5 rounded-full group-hover:bg-[#DA944B] group-hover:text-white transition-colors">
                    <Mail size={16} />
                   </div>
                   <span>hello@cafeflow.com</span>
                </li>
             </ul>
          </div>

        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
          <p>© {new Date().getFullYear()} CafeFlow. Crafted with ❤️ for Coffee Lovers.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
}