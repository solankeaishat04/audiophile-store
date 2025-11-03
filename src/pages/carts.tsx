import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const Cart: React.FC = () => {
  const cartItems = useQuery(api.cart.getCart);

  if (cartItems === undefined) {
    return <p className="text-center mt-20">Loading cart...</p>;
  }

  if (!cartItems || cartItems.length === 0) {
    return <p className="text-center mt-20">Your cart is empty 🛒</p>;
  }

  return (
    <div className="px-6 md:px-16 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div>
              <p className="font-semibold">Product ID: {item.productId}</p>
            </div>
            <p className="text-gray-600">Qty: {item.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;