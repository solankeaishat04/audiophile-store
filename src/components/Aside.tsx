import React from "react";

const Aside: React.FC = () => {
  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-[125px]">
      {/* ===== Text Section ===== */}
      <div className="text-center md:text-left flex flex-col justify-center items-center md:items-start w-full md:w-[445px] order-2 md:order-1">
        <h2 className="w-full md:w-[445px] h-[88px] text-[24px] sm:text-[28px] md:text-[40px] leading-[32px] sm:leading-[36px] md:leading-[44px] font-bold text-[#000000] tracking-tight mb-4 md:mb-6 uppercase">
          BRINGING YOU THE
          <br />
          <span className="text-[#D87D4A]">BEST</span> AUDIO GEAR
        </h2>
        <p className="text-[#7D7D7D] text-[14px] sm:text-[15px] leading-[22px] sm:leading-[25px] w-full">
          Located at the heart of New York City, Audiophile is the premier store
          for high-end headphones, earphones, speakers, and audio accessories.
          Visit our store to explore a wide range of products and meet the
          fantastic people who make Audiophile the best place for premium sound
          experience.
        </p>
      </div>

      {/* ===== Image Section ===== */}
      <div className="flex justify-center items-center order-1 md:order-2 w-full md:w-auto">
        <img
          src="/image/man.png"
          alt="ManImage"
          className="w-full max-w-[540px] h-[300px] sm:h-[350px] md:h-[588px] object-none rounded-lg"
        />
      </div>
    </section>
  );
};

export default Aside;