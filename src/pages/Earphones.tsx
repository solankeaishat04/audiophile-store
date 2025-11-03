import React from "react";
import Navbar from "../components/Navbar";
import CategoryList from "../components/CategoryList";
import Aside from "../components/Aside";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Earphones: React.FC = () => {
  return (
    <section className="bg-[#FAFAFA] max-w-[1440px] mx-auto flex flex-col min-h-screen">
      {/* ===== Header Section ===== */}
      <div className="w-full bg-[#0E0E0E] text-white h-[336px] flex flex-col relative z-10">
        <div className="relative z-50">
          <Navbar />
        </div>
        <h2 className="text-center text-[32px] sm:text-[40px] font-bold pt-32 sm:pt-36">
          EARPHONES
        </h2>
      </div>

      {/* ===== Product 1 ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-[120px] gap-12 lg:gap-[125px] items-center px-6 sm:px-12 lg:px-[165px]">
        {/* Image */}
        <div className="flex justify-center lg:justify-start">
          <img
            src="/image/yx1.png"
            alt="XX99 Mark II"
            className="object-contain w-[280px] sm:w-[350px] h-auto"
          />
        </div>

        {/* Text */}
        <div className="text-center lg:text-left">
          <span className="text-sm tracking-[6px] text-[#D87D4A] mb-3 uppercase block">
            NEW PRODUCT
          </span>
          <h3 className="font-manrope font-bold text-[28px] sm:text-[32px] text-black tracking-[2px] uppercase mb-6">
            YX1 WIRELESS
EARPHONES
          </h3>
          <p className="text-[15px] leading-[25px] text-black/70 mb-8 max-w-[349px] mx-auto lg:mx-0">
           Tailor your listening experience with bespoke dynamic drivers from the new YX1 Wireless Earphones. Enjoy incredible high-fidelity sound even in noisy environments with its active noise cancellation feature.
          </p>
          <Link to={`/product/yx1-earphones`}>
  <button className="bg-[#D87D4A] text-white px-4 py-2 rounded hover:bg-[#FBAF85] transition">
    See Product
  </button>
</Link>

        </div>
      </div>

      

      {/* ===== Category Section ===== */}
      <section className="w-full max-w-[1440px] px-6 sm:px-12 lg:px-[165px] mt-[160px] mx-auto">
        <CategoryList />
      </section>

      {/* ===== Aside Section ===== */}
      <aside className="w-full max-w-[1440px] px-6 sm:px-12 lg:px-[165px] mt-[160px] mx-auto">
        <Aside />
      </aside>

      {/* ===== Footer ===== */}
      <footer className="w-full max-w-[1440px] mt-[160px] mx-auto">
        <Footer />
      </footer>
    </section>
  );
};

export default Earphones;
