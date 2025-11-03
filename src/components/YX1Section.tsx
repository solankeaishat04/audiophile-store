import React from "react";
import Container from "./Container";

const YX1Section: React.FC = () => {
  return (
    <section className="my-8 sm:my-12 px-4 sm:px-8 lg:px-0">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-center">
          {/* Image Section */}
          <div className="flex justify-center lg:justify-start">
            <img
              src="/image/image-earphones-yx1.jpg"
              alt="earphone"
              className="object-cover w-full h-[200px] sm:h-[320px] rounded-lg"
            />
          </div>

          {/* Content Section */}
          <div className="w-full bg-[#F1F1F1] h-[200px] sm:h-80 rounded-lg flex items-center justify-center">
            <div className="text-center px-4 sm:px-0">
              <h3 className="font-manrope font-bold text-[28px] text-black tracking-[2px] uppercase">
                YX1 EARPHONES
              </h3>
              <div className="mt-4 sm:mt-6">
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

export default YX1Section;
