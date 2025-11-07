import React from "react";
import Container from "./Container";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const HeroZX9: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="mt-[160px] px-4 sm:px-8 lg:px-0">
      <Container>
        <div className="w-full h-160 md:h-140 bg-[#D87D4A] rounded-lg bg-no-repeat bg-cover aspect-video relative">
          {/* === Pattern Circles Background === */}
          <img
            src="/image/pattern-circles.svg"
            alt="background pattern"
            className="absolute inset-0 z-0 opacity-40"
          />
          
          <div className="flex flex-col md:flex-row gap-0 md:gap-20 items-center h-full">
            {/* === Speaker Image === */}
            <div className="w-fit flex flex-row self-end">
              <img
                src="/image/image-removebg-preview.png"
                alt="ZX9 Speaker"
                className="object-contain w-[172px] md:w-[320px] lg:w-[410px]"
              />
            </div>

            {/* === Text Content === */}
            <div className="flex flex-col max-w-87 gap-4 text-white w-3/6 h-fit z-1 md:mt-25 text-center md:text-left">
              <h1 className="font-manrope font-bold text-[36px] md:text-[56px] leading-[40px] md:leading-[58px] tracking-[2px] uppercase">
                ZX9 SPEAKER
              </h1>
              
              <p className="text-[15px] leading-[25px] opacity-75">
                Upgrade to premium speakers that are phenomenally built to deliver
                truly remarkable sound.
              </p>
<Button 
  onClick={() => {
    navigate("/product/zx9-speaker");
  }}
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