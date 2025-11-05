// src/pages/OrderDetails.tsx
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function OrderDetails() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 mx-auto">
            <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L10 18L27 4" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8 text-lg">
            Thank you for your purchase. Your order has been confirmed and you will receive an email with all the details shortly.
          </p>

          <div className="bg-white rounded-lg p-8 max-w-md mx-auto mb-8">
            <h2 className="text-xl font-bold mb-4">What's Next?</h2>
            <ul className="text-left space-y-3 text-gray-600">
              <li>• Check your email for order confirmation</li>
              <li>• You'll receive shipping updates via email</li>
              <li>• Contact support if you have any questions</li>
            </ul>
          </div>

          <button
            onClick={() => navigate("/")}
            className="bg-[#D87D4A] hover:bg-[#FBAF85] text-white font-bold py-4 px-8 rounded-md uppercase tracking-wider text-sm transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}