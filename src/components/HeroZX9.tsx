import React from "react";
import Container from "./Container";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const HeroZX9: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="mt-[160px] px-4 sm:px-8 lg:px-0">
      <Container>
        <div className="w-full h-auto min-h-[600px] md:h-140 bg-[#D87D4A] rounded-lg bg-no-repeat bg-cover relative overflow-hidden">
          {/* === Pattern Circles Background === */}
          <img
            src="/image/pattern-circles.svg"
            alt="background pattern"
            className="absolute inset-0 z-0 opacity-40 scale-150 md:scale-100 -top-20 md:top-0"
          />
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-20 items-center justify-center h-full py-16 md:py-0">
            {/* === Speaker Image === */}
            <div className="w-full flex justify-center md:justify-end md:w-fit z-10 mt-8 md:mt-0">
              <img
                src="/image/image-removebg-preview.png"
                alt="ZX9 Speaker"
                className="object-contain w-[180px] md:w-[320px] lg:w-[410px]"
              />
            </div>

            {/* === Text Content === */}
            <div className="flex flex-col gap-6 text-white w-full md:w-3/6 z-10 text-center md:text-left px-8 md:px-0 mb-12 md:mb-0">
              <h1 className="font-manrope font-bold text-[36px] md:text-[56px] leading-[40px] md:leading-[58px] tracking-[1.5px] md:tracking-[2px] uppercase">
                ZX9 SPEAKER
              </h1>
              
              <p className="text-[15px] leading-[25px] opacity-75 max-w-md mx-auto md:mx-0">
                Upgrade to premium speakers that are phenomenally built to deliver truly remarkable sound.
              </p>
              
              <div className="flex justify-center md:justify-start">
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
        </div>
      </Container>
    </section>
  );
};

export default HeroZX9;