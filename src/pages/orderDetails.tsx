/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/OrderDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const order = useQuery(
    api.orders.getOrderById,
    orderId ? { orderId } : "skip"
  );

  if (!orderId) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-28 pb-16 flex items-center justify-center">
          <p className="text-red-500 text-lg">No order ID provided.</p>
        </div>
        <Footer />
      </>
    );
  }

  if (orderId && !order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-28 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D87D4A] mx-auto mb-4"></div>
            <p className="text-gray-500">Loading order details...</p>
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
          <p className="text-red-500 text-lg">Order not found.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <section className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
          <h3 className="text-2xl font-bold text-[#D87D4A] mb-4">
            Order #{orderId}
          </h3>

          <div className="space-y-2 mb-6">
            <p>
              <span className="font-semibold">Name:</span> {order.customer?.name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {order.customer?.email || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {order.customer?.phone || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
            </p>
          </div>

          <h4 className="text-xl font-semibold text-[#D87D4A] mb-2">Items</h4>
          {order.items?.length ? (
            <ul className="mb-6 space-y-3">
              {order.items.map((item: any, index: number) => (
                <li key={index} className="py-2 border-b last:border-b-0 flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.productName || item.name}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      × {item.quantity}
                    </span>
                  </div>
                  <span className="font-semibold">
                    ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mb-6">No items in this order.</p>
          )}

          <h4 className="text-xl font-semibold text-[#D87D4A] mb-2">Shipping Address</h4>
          <p className="mb-6 text-gray-700">
            {order.shipping?.address}, {order.shipping?.city}, {order.shipping?.country} ({order.shipping?.zipCode})
          </p>

          <h4 className="text-xl font-semibold text-[#D87D4A] mb-2">Totals</h4>
          <div className="space-y-1 text-gray-700">
            <p>Subtotal: ${order.totals?.subtotal?.toFixed(2) || "0.00"}</p>
            <p>Shipping: ${order.totals?.shipping?.toFixed(2) || "0.00"}</p>
            <p>Tax: ${order.totals?.tax?.toFixed(2) || "0.00"}</p>
            <p className="font-bold text-lg border-t pt-2">
              Grand Total: ${order.totals?.grandTotal?.toFixed(2) || "0.00"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-6 border-t">
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
        </section>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetails;