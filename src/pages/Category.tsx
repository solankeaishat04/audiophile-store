import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

const Category: React.FC = () => {
  const { category } = useParams<{ category: string }>();

  const products = useQuery(
    api.product.getProductsByCategory,
    category ? { category: category.toLowerCase() } : "skip" // Ensure case matching
  );

  if (products === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading products...
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No products found in {category} category ❌
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen px-6 md:px-16 py-12">
      <h1 className="text-3xl font-bold uppercase text-center mb-12">
        {category}
      </h1>

      <div className="flex flex-col gap-24">
        {products.map((product: Doc<"products">, index: number) => (
          <div
            key={product.slug} // Using slug as key since you're using slugs
            className={`flex flex-col lg:flex-row items-center gap-12 ${
              index % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-[400px] rounded-lg object-contain"
            />
            <div className="flex flex-col gap-4 text-center lg:text-left">
              {product.new && (
                <p className="uppercase tracking-widest text-[#D87D4A] text-sm">
                  New Product
                </p>
              )}
              <h2 className="text-3xl font-bold uppercase">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <Link
                to={`/product/${product.slug}`} // Using slug in URL
                className="mt-4 bg-[#D87D4A] hover:bg-[#FBAF85] text-white font-bold py-3 px-6 rounded-lg w-fit transition-all mx-auto lg:mx-0"
              >
                See Product
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;