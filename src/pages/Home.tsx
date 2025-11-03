import React from "react";
import Hero from "../components/Hero";
import CategoryList from "../components/CategoryList";
import HeroZX9 from "../components/HeroZX9";
import ZX7Section from "../components/ZX7Section";
import YX1Section from "../components/YX1Section";
import Aside from "../components/Aside";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-white">
      {/* ===== Hero Section ===== */}
      <header className="w-full max-w-[1440px] mx-auto">
        <Hero />
      </header>

      {/* ===== Category List ===== */}
      <section className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[165px]">
        <CategoryList />
      </section>

      {/* ===== Product Sections ===== */}

<main className="flex flex-col gap-12 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[165px]">
  <HeroZX9 />
  <ZX7Section />
  <YX1Section />
</main>


      {/* ===== Aside Section ===== */}
      <aside className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[165px]">
        <Aside />
      </aside>

      {/* ===== Footer ===== */}
      <footer className="mt-[160px] w-full max-w-[1440px] mx-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Home;
