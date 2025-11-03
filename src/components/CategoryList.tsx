// src/components/CategoryList.tsx
import React from "react";
import Container from "./Container";
import CategoryCard from "./CategoryCard";

const CategoryList: React.FC = () => {
  return (
    <section className="mt-10 sm:mt-24 lg:mt-[120px]">
      <Container>
        <div className="max-w-[1110px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-[30px]">
          <CategoryCard 
            title="HEADPHONES" 
            imageSrc="/image/headphoneshop.png" 
          />
          <CategoryCard 
            title="SPEAKERS" 
            imageSrc="/image/speakershop.png" 
          />
          <CategoryCard 
            title="EARPHONES" 
            imageSrc="/image/earphonesshop.png" 
          />
        </div>
      </Container>
    </section>
  );
};

export default CategoryList;