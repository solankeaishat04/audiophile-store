import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Hero: React.FC = () => {
  return (
    <section className="bg-[#0E0E0E] text-white flex justify-center">
      {/* Outer container matches Footer */}
      <div className="w-full max-w-[1440px] mx-auto h-[729px] flex flex-col relative z-10">
        {/* Navbar */}
        <div className="relative z-50">
          <Navbar />
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center md:items-stretch flex-1 px-0 md:px-28">
          {/* Right Image Side */}
          <div className="relative w-full md:w-1/2 h-[500px] md:h-full bg-[#0E0E0E] order-1 md:order-2 flex justify-center items-center">
            <img
              src="/image/Bitmap.svg"
              alt="XX99 Mark II Headphones"
              className="hidden md:block w-full h-full object-contain select-none"
            />

            {/* Mobile Image with Text Overlay */}
            <div className="relative w-full h-[600px] md:hidden">
              <img
                src="/image/image-header.jpg"
                alt="XX99 Mark II Headphones Mobile"
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 bg-black/50">
                <span className="text-sm tracking-[6px] text-gray-300 mb-3 uppercase">
                  NEW PRODUCT
                </span>
                <h1 className="text-4xl font-extrabold leading-tight">
                  XX99 MARK II
                  <br />
                  HEADPHONES
                </h1>
                <p className="mt-4 text-gray-300 text-sm max-w-sm">
                  Experience natural, lifelike audio and exceptional build
                  quality made for the passionate music enthusiast.
                </p>
                <Link
                  to="/product"
                  className="mt-6 inline-block bg-[#D87D4A] text-white px-6 py-3 text-sm font-semibold rounded-sm hover:opacity-90 transition"
                >
                  SEE PRODUCT
                </Link>
              </div>
            </div>
          </div>

          {/* Left Text Side */}
          <div className="hidden md:flex md:w-1/2 p-10 md:p-16 flex-col justify-center bg-[#0E0E0E]">
            <span className="text-sm tracking-[6px] text-gray-400 mb-4 uppercase">
              NEW PRODUCT
            </span>
            <h1 className="font-manrope font-extrabold tracking-tight text-6xl leading-[1.05] text-white">
              XX99 MARK II
              <br />
              HEADPHONES
            </h1>
            <p className="mt-6 text-gray-300 max-w-md">
              Experience natural, lifelike audio and exceptional build quality
              made for the passionate music enthusiast.
            </p>
            <div className="mt-8">
              <Link
                to="/product"
                className="inline-block bg-[#D87D4A] text-white px-8 py-3 rounded-sm tracking-wide text-sm font-semibold shadow-sm hover:opacity-90 transition"
              >
                SEE PRODUCT
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
