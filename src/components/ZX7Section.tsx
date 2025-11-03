import React from "react";
import Container from "./Container";

const ZX7Section: React.FC = () => {
  return (
    <section className="my-12 px-4 sm:px-8 lg:px-0">
      <Container>
        <div className="relative rounded-lg w-full h-80 overflow-hidden">
          {/* Desktop Image */}
          <img
            src="/image/image-speaker-zx7.jpg"
            alt="ZX7 Speaker"
            className="hidden sm:block w-full h-full object-cover"
          />
          {/* Mobile Image */}
          <img
            src="/image/image-speaker-zx7-mobile.jpg"
            alt="ZX7 Speaker"
            className="sm:hidden w-full h-full object-cover"
          />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="pl-6 sm:pl-12 md:pl-24">
              <h2 className="font-manrope text-black font-bold text-[28px] tracking-[2px] uppercase">
                ZX7 SPEAKER
              </h2>
              <div className="mt-6">
                <button className="border border-black text-black py-3 px-6 sm:px-8 uppercase font-bold text-sm sm:text-base hover:bg-black hover:text-white transition-colors">
                  See Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ZX7Section;
