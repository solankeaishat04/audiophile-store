import { useState } from "react";
import { FiMenu, FiX, FiShoppingCart } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navData } from "../data/navdata";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const cartItems = useQuery(api.cart.getCart);
  const removeFromCart = useMutation(api.cart.removeFromCart);
  const clearCart = useMutation(api.cart.clearCart);

  const handleRemoveItem = async (cartItemId: Id<"cart">) => {
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
    if (!cartItems) return 0;
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <header className="w-full bg-[#0E0E0E]">
      <nav className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12 border-b border-[#979797] w-[90%] md:w-[76%]">
        <div className="flex items-center justify-between py-6">
          
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-200 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/image/logo.svg"
                alt="Audiophile logo"
                className="h-6 md:h-7 select-none"
              />
            </Link>
          </div>

          {/* ===== DESKTOP NAV LINKS ===== */}
          <ul className="hidden md:flex items-center gap-8 text-sm tracking-widest text-gray-300">
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

          {/* ===== RIGHT (Cart Icon) ===== */}
          <div className="flex items-center gap-4">
            <button
              aria-label="Open cart"
              className="relative text-gray-200 hover:text-white focus:outline-none"
              onClick={() => setShowCartModal(true)}
            >
              <FiShoppingCart size={20} />
              {cartItems && cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D87D4A] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ===== MOBILE DRAWER MENU ===== */}
      <div
        className={`md:hidden bg-[#0E0E0E] text-white fixed inset-x-0 top-0 z-40 transform transition-transform duration-200 ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-3xl px-6 py-6">
          <ul className="flex flex-col gap-4 text-center text-lg font-medium">
            {navData.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`block py-2 ${
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

    
    {/* ===== CART MODAL ===== */}
{showCartModal && (
  <>
    {/* Backdrop */}
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={() => setShowCartModal(false)}
    />

    {/* Modal */}
   <div className="fixed top-28 right-4 md:right-12 lg:right-24 bg-white rounded-lg p-8 w-[90%] max-w-md z-50 shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold tracking-wider uppercase">
          Cart ({getTotalItems()})
        </h3>
        <button 
          onClick={handleClearCart}
          className="text-gray-500 hover:text-gray-700 text-sm underline"
        >
          Remove all
        </button>
      </div>

      {cartItems && cartItems.length > 0 ? (
        <>
          {/* Cart Items */}
          <div className="space-y-6 mb-8">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm uppercase">{item.productName}</p>
                    <p className="text-gray-500 text-sm font-semibold">$ {item.price.toLocaleString()}</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-md">
                  <button 
                    onClick={() => {
                      if (item.quantity > 1) {
                        // Decrease quantity logic
                      } else {
                        handleRemoveItem(item._id);
                      }
                    }}
                    className="text-gray-400 hover:text-[#D87D4A] font-bold w-4 text-center"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => {
                      // Increase quantity logic
                    }}
                    className="text-gray-400 hover:text-[#D87D4A] font-bold w-4 text-center"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total Section */}
          <div className="flex justify-between items-center mb-8">
            <span className="text-gray-500 uppercase text-sm">Total</span>
            <span className="font-bold text-lg">$ {getTotalPrice().toLocaleString()}</span>
          </div>

          {/* Checkout Button */}
        <button 
  onClick={() => {
    setShowCartModal(false); // Close cart modal first
    navigate("/checkout"); // Then navigate to checkout
  }}
  className="w-full bg-[#D87D4A] hover:bg-[#FBAF85] text-white font-bold py-4 rounded-md uppercase tracking-wider text-sm transition-all"
>
  Checkout
</button>
              </>
            ) : (
              <p className="text-center text-gray-600 py-8">Your cart is empty</p>
            )}
          </div>
        </> 
      )} 
    </header>
  );
};

export default Navbar;