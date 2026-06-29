import Footer from "@/src/components/layout/Footer";
import MenuCategoryCard from "@/src/components/feature/menu/MenuCategoryCard";
import Navbar from "@/src/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20">

        {/* 2. Hero Section (Centered Text) */}
        <section className="flex flex-col items-center justify-center pt-32 pb-16 px-4 text-center">

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#653100] mb-4 tracking-tight">
            Brewed Right. Served Honest.
          </h1>

          {/* Sub-headline */}
          <p className="text-gray-600 text-lg md:text-xl font-medium max-w-2xl">
            Because good coffee doesnâ€™t need shortcuts.
          </p>

        </section>

        {/* 3. Catalog Section */}
        <section className="max-w-7xl mx-auto px-6">

          {/* Section Title */}
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            What We Serve?
          </h2>

          {/* The Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">

            {/* Cold Coffee Card */}
            <MenuCategoryCard
              title="Cold Coffee"
              imageSrc="/cold-coffee.png"
              href="/main/menu/cold-coffee"
            />

            {/* Thick Shakes Card */}
            <MenuCategoryCard
              title="Thick Shakes"
              imageSrc="/thick-shake.png"
              href="/main/menu/thick-shakes"
            />

            {/* Mocktails Card */}
            <MenuCategoryCard
              title="Mocktails"
              imageSrc="/mocktail.png"
              href="/main/menu/mocktails"
            />

          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}
