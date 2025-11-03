import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { navData } from "../data/navdata";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  return (
    <footer className="bg-[#101010] text-white w-full">
      {/* ===== Orange Decorative Bar ===== */}
      <div className="bg-[#D87D4A] h-1 w-[101px] mx-auto md:ml-48"></div>

      {/* ===== Main Content ===== */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-48 py-12 flex flex-col gap-10">
        {/* ===== Top Section (Logo + Nav) ===== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <Link to="/">
              <img
                src="/image/logo.svg"
                alt="Audiophile Logo"
                className="h-[36px] w-[143px] md:h-[40px] select-none"
              />
            </Link>
          </div>

          {/* Nav Links */}
          <ul className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 text-sm font-semibold tracking-widest text-gray-300 text-center">
            {navData.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`hover:text-[#D87D4A] transition-colors ${
                    location.pathname === link.path ? "text-white" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== Middle Section (Description + Socials) ===== */}
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-8 text-center md:text-left">
          {/* Description */}
          <p className="text-gray-400 md:max-w-[540px]">
            Audiophile is an all-in-one stop to fulfill your audio needs. We’re a
            small team of music lovers and sound specialists who are devoted to
            helping you get the most out of personal audio. Come and visit our
            demo facility — we’re open 7 days a week.
          </p>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-end items-center space-x-4">
            <Link to="#" className="hover:text-[#D87D4A] transition-colors">
              <FaFacebook size={20} />
            </Link>
            <Link to="#" className="hover:text-[#D87D4A] transition-colors">
              <FaTwitter size={20} />
            </Link>
            <Link to="#" className="hover:text-[#D87D4A] transition-colors">
              <FaInstagram size={20} />
            </Link>
          </div>
        </div>

        {/* ===== Bottom Section (Copyright) ===== */}
        <p className="text-gray-500 text-sm text-center md:text-left">
          Copyright {currentYear}. All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
