import React from 'react';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  image: string;
  slug?: string;
}

const Likes: React.FC = () => {
  const products: Product[] = [
    {
      id: 1,
      name: 'ZX9 SPEAKER',
      image: '/image/Group 12.png',
      slug: 'zx9-speaker'
    },
    {
      id: 2,
      name: 'XX99 MARK I',
      image: "/image/xx99mark.png",
      slug: 'xx99-mark-one'
    },
    {
      id: 3,
      name: 'XX59',
      image: '/image/XX59 m.png',
      slug: 'xx59'
    },
  ];

  return (
    <div className="max-w-[1110px] h-[571px] mx-auto pt-[165px]">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12 tracking-wide">
        YOU MAY ALSO LIKE
      </h2>
      
      <div className="flex justify-between items-start h-full gap-[30px]">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col items-center flex-1 max-w-[350px]">
            {/* Image with exact dimensions */}
            <div className="w-[350px] h-[318px] flex items-center justify-center mb-8">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Product name */}
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-8 tracking-wide">
              {product.name}
            </h3>
            
            {/* Button with exact dimensions */}
            <Link 
              to={`/product/${product.slug}`}
              className="w-[160px] h-[48px] bg-[#D87D4A] hover:bg-[#FBAF85] text-white font-bold flex items-center justify-center transition-colors duration-200"
            >
              SEE PRODUCT
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Likes;