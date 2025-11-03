import React from "react";
import Container from "./Container";
import Button from "./Button";

const HeroZX9: React.FC = () => {
  return (
    <section className="mt-[160px] px-4 sm:px-8 lg:px-0">
      <Container>
        <div className="relative bg-[#D87D4A] rounded-lg grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-[138px] overflow-hidden p-6 lg:p-12">
          {/* === Pattern Circles Background === */}
          <img
            src="/image/pattern-circles.svg"
            alt="background pattern"
            className="absolute top-0 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 w-[558px] h-[558px] md:w-[944px] md:h-[944px] object-contain opacity-40 pointer-events-none"
          />

          {/* === Speaker Image === */}
          <div className="relative flex justify-center lg:justify-start z-10 pb-0">
            <img
              src="/image/image-removebg-preview.png"
              alt="ZX9 speaker"
              className="object-contain w-[172px] md:w-[320px] lg:w-[410px]"
            />
          </div>

          {/* === Text Content === */}
          <div className="relative text-white text-center lg:text-left z-10">
            <h1 className="font-manrope font-bold text-[36px] md:text-[56px] leading-[40px] md:leading-[58px] tracking-[2px] uppercase mb-6">
              ZX9 SPEAKER
            </h1>

            <p className="text-[15px] leading-[25px] opacity-75 mb-8 max-w-[349px] mx-auto lg:mx-0">
              Upgrade to premium speakers that are phenomenally built to deliver
              truly remarkable sound.
            </p>

            <Button className="bg-black text-white py-3 px-8 hover:bg-[#4C4C4C] transition">
              SEE PRODUCT
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroZX9;
