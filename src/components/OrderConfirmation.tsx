// src/components/OrderConfirmation.tsx
import { useNavigate } from "react-router-dom";

interface OrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    orderId: string;
    grandTotal: number;
    items: Array<{
      productName: string;
      price: number;
      quantity: number;
    }>;
  };
}

export default function OrderConfirmation({ isOpen, onClose, orderDetails }: OrderConfirmationProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Calculate first item total and other items count
  const firstItem = orderDetails.items[0];
  const otherItemsCount = orderDetails.items.length - 1;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8 w-[90%] max-w-[540px] z-50 shadow-2xl">
        {/* Large Orange Checkmark Icon */}
        <div className="w-20 h-20 bg-[#D87D4A] rounded-full flex items-center justify-center mb-6 mx-auto">
          <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12L10 18L27 4" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 className="text-3xl font-bold mb-4 text-center uppercase tracking-wide">Thank you for your order</h2>
        <p className="text-gray-600 mb-8 text-center">You will receive an email confirmation shortly.</p>

        {/* Order Summary - Split Layout */}
        <div className="flex flex-col md:flex-row rounded-lg overflow-hidden mb-8">
          {/* Left Side - Items */}
          <div className="bg-gray-100 p-6 flex-1">
            {/* First Item */}
            {firstItem && (
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gray-300 rounded-md flex items-center justify-center">
                    <span className="text-gray-500 text-xs">IMG</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{firstItem.productName}</p>
                    <p className="text-gray-500 text-sm">$ {firstItem.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-gray-500 font-bold">
                  x{firstItem.quantity}
                </div>
              </div>
            )}

            {/* Other Items Count */}
            {otherItemsCount > 0 && (
              <div className="border-t border-gray-300 pt-4 text-center">
                <p className="text-gray-600 text-sm">
                  and {otherItemsCount} other item(s)
                </p>
              </div>
            )}
          </div>

          {/* Right Side - Grand Total */}
          <div className="bg-black text-white p-6 flex flex-col justify-center min-w-[200px]">
            <p className="text-gray-400 uppercase text-sm mb-2">Grand Total</p>
            <p className="font-bold text-lg">$ {orderDetails.grandTotal.toLocaleString()}</p>
          </div>
        </div>

        {/* Back to Home Button */}
        <button
          onClick={() => navigate("/")}
          className="w-full bg-[#D87D4A] hover:bg-[#FBAF85] text-white font-bold py-4 rounded-md uppercase tracking-wider text-sm transition-all"
        >
          Back to home
        </button>
      </div>
    </>
  );
}