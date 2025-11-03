import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Navbar from "../components/Navbar"; // Import Navbar
import Likes from "../components/likes";
import CategoryList from "../components/CategoryList";
import Aside from "../components/Aside";
import Footer from "../components/Footer";

const Product: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const product = useQuery(
    api.product.getProductBySlug, // Changed to products.getProductBySlug
    slug ? { slug } : "skip"
  );

  const cartItems = useQuery(api.cart.getCart);
  const addToCart = useMutation(api.cart.addToCart);
  const removeFromCart = useMutation(api.cart.removeFromCart);
  const clearCart = useMutation(api.cart.clearCart);

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart({ 
        productId: product._id, 
        quantity: quantity 
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRemoveItem = async (cartItemId: any) => {
    try {
      await removeFromCart({ cartItemId });
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const getTotalPrice = () => {
    if (!cartItems || !product) return 0;
    return cartItems.reduce((total, item) => {
      return total + (product.price || 0) * item.quantity;
    }, 0);
  };

  if (product === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading product details...
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Product not found ❌
        <br />
        <small>Slug: {slug}</small>
        <br />
        <Link to="/" className="text-blue-500 mt-4 block">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Navbar Component */}
      <Navbar />

      <div className="px-6 md:px-16 py-12">
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            ✅ Successfully added to cart!
          </div>
        )}

        {/* Cart Modal */}
        {showCartModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Cart ({cartItems?.length || 0})</h3>
                <button 
                  onClick={() => setShowCartModal(false)}
                  className="text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              </div>

              {cartItems && cartItems.length > 0 ? (
                <>
                  <div className="space-y-4 mb-4">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-gray-600">${product.price} each</p>
                        </div>
                        <button 
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold">Total: ${getTotalPrice()}</span>
                    <button 
                      onClick={handleClearCart}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove All
                    </button>
                  </div>
                  
                  <button className="w-full bg-[#D87D4A] hover:bg-[#FBAF85] text-white font-bold py-3 rounded-lg transition-all">
                    Checkout
                  </button>
                </>
              ) : (
                <p className="text-center text-gray-600">Your cart is empty</p>
              )}
            </div>
          </div>
        )}

        {/* Go Back Link */}
        <div className="mb-8 px-6 lg:px-[165px] ">
          <Link to={`/${product.category}`} className="text-gray-500 hover:text-black">
            Go Back
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row px-6 lg:px-[165px] items-center gap-12 mt-8">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-w-[400px] rounded-lg object-contain"
          />

          <div className="flex flex-col gap-4">
            {product.new && (
              <p className="uppercase tracking-widest text-[#D87D4A] text-sm">
                New Product
              </p>
            )}
            <h1 className="text-3xl font-bold uppercase">{product.name}</h1>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
            <p className="text-xl font-semibold mt-2">$ {product.price}</p>

            {/* Quantity Selector and Add to Cart Button */}
            <div className="flex items-center gap-4 mt-4">
              {/* Quantity Selector */}
              <div className="flex items-center bg-gray-100 rounded-lg">
                <button 
                  onClick={decreaseQuantity}
                  className="px-4 py-2 text-gray-500 hover:text-black transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="px-4 py-2 text-gray-500 hover:text-black transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="bg-[#D87D4A] hover:bg-[#FBAF85] text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>

        {/* Features + In The Box */}
        <div className="mt-16 flex flex-col px-6 lg:px-[165px] lg:flex-row gap-16">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 uppercase">Features</h2>
            <p className="text-gray-600 whitespace-pre-line">
              {product.features}
            </p>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 uppercase">In the Box</h2>
            <ul className="space-y-2">
              {product.inBox.map((item: { quantity: number; item: string }, index: number) => (
                <li key={index} className="text-gray-700">
                  <span className="text-[#D87D4A] font-semibold">
                    {item.quantity}x{" "}
                  </span>
                  {item.item}
                </li>
              ))}
            </ul>
          </div>
        </div>

      
        {/* Gallery */}
<div className="mt-20 w-full max-w-[1110px] mx-auto px-6 lg:px-[165px]">
  <div className="flex flex-col md:flex-row gap-8">
    {/* First two images in a column */}
    <div className="flex flex-col gap-8 flex-1">
      {product.gallery.slice(0, 2).map((img: string, index: number) => (
        <img
          key={index}
          src={img}
          alt={`${product.name} gallery ${index + 1}`}
          className="rounded-lg w-full h-full object-cover"
        />
      ))}
    </div>
    
    {/* Third image - full height */}
    <div className="flex-1">
      <img
        src={product.gallery[2]}
        alt={`${product.name} gallery 3`}
        className="rounded-lg w-full h-full max-h-[592px] object-cover"
      />
    </div>
  </div>
</div>

        <div className="mx-auto px-6 sm:px-12">
          <Likes/>
        </div>

        <section className="w-full max-w-[1440px] mx-auto pt-[165px] px-6 sm:px-12 lg:px-[165px]">
          <CategoryList />
        </section>

        <aside className="w-full max-w-[1440px] px-6 sm:px-12 lg:px-[165px] mt-[160px] mx-auto">
          <Aside />
        </aside>
      </div>

      <footer className="mt-[160px] w-full max-w-[1440px] mx-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Product;