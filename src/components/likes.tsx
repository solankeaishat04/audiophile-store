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
    {
      id: 1,
      name: 'ZX9 SPEAKER',
      image: '/image/Group 12.png',
      slug: 'zx9-speaker'
    },
  ];

  return (
    <div className="max-w-[1110px] mx-auto pt-16 md:pt-[165px] px-4 md:px-0 md:h-auto">
      <h2 className="w-full font-bold text-center text-gray-800 mb-8 md:mb-12 tracking-wide text-2xl md:text-3xl">
        YOU MAY ALSO LIKE
      </h2>
      
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-[30px]">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col items-center w-full md:w-[350px] mb-8 md:mb-0">
            {/* Image container */}
            <div className="w-full max-w-[327px] h-[120px] md:w-[350px] md:h-[140px] flex items-center justify-center mb-6 md:mb-[32px] bg-gray-50 rounded-lg">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-[80px] h-[104px] md:w-[148px] md:h-[193px] object-contain"
              />
            </div>
            
            {/* Product name with 32px gap from image */}
            <h3 className="text-lg md:text-2xl font-bold text-gray-800 text-center mb-4 md:mb-8 tracking-wide">
              {product.name}
            </h3>
            
            {/* Button */}
            <Link 
              to={`/product/${product.slug}`}
              className="w-[160px] h-[48px] bg-[#D87D4A] hover:bg-[#FBAF85] text-white font-bold flex items-center justify-center transition-colors duration-200 rounded-lg"
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