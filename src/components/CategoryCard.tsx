// src/components/CategoryCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

interface Props {
  title: string;
  imageSrc: string;
  href?: string;
}

const CategoryCard: React.FC<Props> = ({ 
  title, 
  imageSrc, 
  href = "/" 
}) => {
  return (
    <div className="relative w-full max-w-[350px] h-[284px] mx-auto flex flex-col items-center px-4 sm:px-0">
    
      {/* Image container - positioned to partially overflow the light card */}
      <div className="relative z-10 mb-4 flex flex-col items-center">
        <img
          src={imageSrc}
          alt={title}
          className="w-[140px] h-[140px] object-contain relative z-10"
        />
        {/* Shadow image positioned lower */}
        <img
          src="/image/Oval.png"
          alt=""
        
className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[180px] h-auto z-0"
        />
      </div>

      
      <div className="w-full h-[165px] bg-[#F1F1F1] rounded-lg flex flex-col items-center justify-end pb-6 -mt-12">
        {/* Content positioned at bottom */}
        <div className="w-full flex flex-col items-center justify-center">
          <h3 className="font-bold text-[15px] tracking-[1.07px] uppercase text-black mb-4">
            {title}
          </h3>
          <Link
            to={href}
            className="inline-flex items-center gap-2 font-bold text-[13px] tracking-[1px] uppercase text-[#000000] opacity-50 hover:text-[#D87D4A] hover:opacity-100 transition-all"
          >
            <span>SHOP</span>
            <IoIosArrowForward size={16} className="text-[#D87D4A]" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;