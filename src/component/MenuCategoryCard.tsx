import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface MenuCategoryCardProps {
  title: string;
  imageSrc: string;
  href: string;
}

export default function MenuCategoryCard({ title, imageSrc, href }: MenuCategoryCardProps) {
  return (
    <Link href={href} className="w-full max-w-sm mx-auto group block">
      <div className="relative h-48 mt-8"> 
        
        {/* The Card Background */}
        <div className="absolute inset-0 bg-[#e5e5e5] rounded-[35px] shadow-sm group-hover:shadow-xl group-hover:bg-[#ebebeb] transition-all duration-300 ease-out"></div>

        {/* Content Wrapper */}
        <div className="relative h-full flex items-center px-4">
          
          {/* Left: The Image (Popping Out) */}
          <div className="relative w-40 h-48 -mt-8 -ml-4 shrink-0 transition-transform duration-500 ease-out group-hover:scale-110">
            <Image 
              src={imageSrc} 
              alt={title} 
              fill
              className="object-contain drop-shadow-xl"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </div>

          {/* Right: Text & Action */}
          <div className="flex flex-col items-start gap-2 z-10 pl-2">
            
            {/* Title */}
            <h3 className="text-2xl font-extrabold text-[#1a1a1a] tracking-tight leading-none group-hover:text-[#653100] transition-colors">
              {title}
            </h3>
            
            {/* Subtitle/Decoration Line */}
            <div className="w-8 h-1 bg-[#DA944B] rounded-full mb-1 group-hover:w-16 transition-all duration-300"></div>

            {/* Button */}
            <div className="mt-1 bg-[#d4d4d4] group-hover:bg-[#DA944B] group-hover:text-white text-black text-xs font-bold py-2.5 px-5 rounded-full flex items-center gap-2 transition-all duration-300 shadow-sm group-hover:shadow-md">
              Order Now 
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}
