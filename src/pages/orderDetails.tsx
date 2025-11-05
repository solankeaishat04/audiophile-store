// src/pages/OrderDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface Order {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    zipCode: string;
    city: string;
    country: string;
  };
  status: string;
  items: OrderItem[];
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    grandTotal: number;
  };
  orderDate: number;
}

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Use the getOrderById query with the string orderId from URL
  const order = useQuery(api.orders.getOrderById, { 
    orderId: orderId || "" 
  }) as Order | undefined | null;

  if (order === null) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-28 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#D87D4A] hover:bg-[#FBAF85] text-white font-bold py-2 px-6 rounded-md uppercase tracking-wider text-sm transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-28 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D87D4A] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          
          {/* Order Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {/* Order Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order #{order._id}</h1>
                <p className="text-gray-500 mt-1">
                  Placed on {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Processing'}
              </span>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Items</h2>
              <div className="space-y-4">
                {order.items.map((item: OrderItem, index: number) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.productName}</h3>
                        <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${order.totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">${order.totals.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${order.totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-[#D87D4A]">
                    ${order.totals.grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
              <div className="text-gray-600 space-y-2">
                <p><strong>Name:</strong> {order.customer.name}</p>
                <p><strong>Email:</strong> {order.customer.email}</p>
                <p><strong>Phone:</strong> {order.customer.phone}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
              <div className="text-gray-600 space-y-2">
                <p>{order.shipping.address}</p>
                <p>{order.shipping.city}</p>
                <p>{order.shipping.zipCode}</p>
                <p>{order.shipping.country}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="bg-[#D87D4A] hover:bg-[#FBAF85] text-white font-bold py-3 px-6 rounded-md uppercase tracking-wider text-sm transition-all"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-md uppercase tracking-wider text-sm transition-all"
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}