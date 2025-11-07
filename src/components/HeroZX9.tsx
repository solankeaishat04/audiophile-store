import React from "react";
import Container from "./Container";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const HeroZX9: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="mt-[160px] px-4 sm:px-8 lg:px-0">
      <Container>
        <div className="w-full h-auto min-h-[600px] md:h-[560px] bg-[#D87D4A] rounded-lg bg-no-repeat bg-cover relative overflow-hidden flex items-center justify-center">
          {/* === Pattern Circles Background === */}
          <img
            src="/image/pattern-circles.svg"
            alt="background pattern"
            className="absolute inset-0 z-0 opacity-40 scale-150 md:scale-100 top-[-100px] md:top-0"
          />

          {/* === MOBILE LAYOUT === */}
          <div className="flex flex-col md:hidden items-center text-center justify-center h-full py-12 relative z-10">
            <img
              src="/image/image-removebg-preview.png"
              alt="ZX9 Speaker"
              className="w-[180px] mb-8 object-contain"
            />

            <h1 className="font-manrope font-bold text-[36px] leading-[40px] tracking-[1.5px] uppercase text-white">
              ZX9 SPEAKER
            </h1>

            <p className="text-[15px] leading-[25px] opacity-75 text-white max-w-[280px] mx-auto mt-4">
              Upgrade to premium speakers that are phenomenally built to deliver
              truly remarkable sound.
            </p>

            <Button
              onClick={() => navigate("/product/zx9-speaker")}
              className="bg-black text-white mt-6 py-3 px-8 hover:bg-[#4C4C4C] transition"
            >
              SEE PRODUCT
            </Button>
          </div>

          {/* === DESKTOP LAYOUT === */}
          <div className="hidden md:flex items-center justify-between w-full px-16 lg:px-28 relative z-10">
            {/* Speaker Image Left - lowered and spaced */}
            <div className="flex-shrink-0 flex items-end h-full relative">
              <img
                src="/image/image-removebg-preview.png"
                alt="ZX9 Speaker"
                className="object-contain w-[370px] lg:w-[450px] translate-y-[90px]" // lowered further
              />
            </div>

            {/* Text Right - with more left spacing */}
            <div className="flex flex-col text-white max-w-[420px] lg:max-w-[460px] ml-8 lg:ml-16">
              <h1 className="font-manrope font-bold text-[56px] leading-[58px] tracking-[2px] uppercase">
                ZX9 SPEAKER
              </h1>

              <p className="text-[15px] leading-[25px] opacity-75 mt-6 mb-10">
                Upgrade to premium speakers that are phenomenally built to
                deliver truly remarkable sound.
              </p>

              <Button
                onClick={() => navigate("/product/zx9-speaker")}
                className="bg-black text-white py-3 px-8 hover:bg-[#4C4C4C] transition w-fit"
              >
                SEE PRODUCT
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroZX9;
