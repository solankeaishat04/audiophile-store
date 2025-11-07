// src/pages/Checkout.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  paymentMethod: "e-Money" | "Cash on Delivery";
  eMoneyNumber?: string;
  eMoneyPIN?: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const cartItems = useQuery(api.cart.getCart);
  const createOrder = useMutation(api.orders.createOrder);
  const clearCart = useMutation(api.cart.clearCart);
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    zipCode: "",
    city: "",
    country: "",
    paymentMethod: "e-Money",
    eMoneyNumber: "",
    eMoneyPIN: ""
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{
    orderId: string;
    grandTotal: number;
  } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [confirmationItems, setConfirmationItems] = useState<any[]>([]); // Store items for confirmation modal

  // Add this useEffect to close any cart modal when checkout page loads
  useEffect(() => {
    // Remove any cart modal backdrop that might be open
    const cartModalBackdrop = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    if (cartModalBackdrop) {
      cartModalBackdrop.remove();
    }
    
    // Remove any cart modal content
    const cartModalContent = document.querySelector('.fixed.top-28.right-4, .fixed.top-28.right-12, .fixed.top-28.right-24');
    if (cartModalContent) {
      cartModalContent.remove();
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Billing Validation
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone format";
    }

    // Shipping Validation
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP Code is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    // Payment Validation
    if (formData.paymentMethod === "e-Money") {
      if (!formData.eMoneyNumber?.trim()) {
        newErrors.eMoneyNumber = "e-Money Number is required";
      } else if (!/^\d{9}$/.test(formData.eMoneyNumber.replace(/\s/g, ''))) {
        newErrors.eMoneyNumber = "Must be 9 digits";
      }
      
      if (!formData.eMoneyPIN?.trim()) {
        newErrors.eMoneyPIN = "e-Money PIN is required";
      } else if (!/^\d{4}$/.test(formData.eMoneyPIN)) {
        newErrors.eMoneyPIN = "Must be 4 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !cartItems || cartItems.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate totals with null checks
      const subtotal = cartItems.reduce((total, item) => {
        const itemPrice = item.price || 0;
        return total + (itemPrice * item.quantity);
      }, 0);
      
      const shipping = 50;
      const tax = Math.round(subtotal * 0.08);
      const grandTotal = subtotal + shipping + tax;

      // Store cart items for confirmation modal BEFORE clearing
      setConfirmationItems([...cartItems]);

      // Create order in Convex with proper structure
      const orderId = await createOrder({
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          address: formData.address,
          zipCode: formData.zipCode,
          city: formData.city,
          country: formData.country
        },
        payment: {
          method: formData.paymentMethod,
          eMoneyNumber: formData.eMoneyNumber,
          eMoneyPIN: formData.eMoneyPIN
        },
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.productName || "Unknown Product",
          price: item.price || 0,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        })),
        totals: {
          subtotal,
          shipping,
          tax,
          grandTotal
        }
      });

      // Set order details for confirmation modal
      setOrderDetails({
        orderId,
        grandTotal,
      });

      // Show confirmation modal BEFORE clearing cart
      setShowConfirmation(true);

      // THEN clear the cart after showing the modal
      await clearCart();

    } catch (error) {
      console.error("Checkout error:", error);
      setErrors({ submit: "Failed to process order. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalPrice = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((total, item) => {
      const itemPrice = item.price || 0;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const shippingCost = 50;
  const tax = Math.round(getTotalPrice() * 0.08);
  const grandTotal = getTotalPrice() + shippingCost + tax;

  // Use confirmationItems for modal display instead of cartItems
  const firstItem = confirmationItems?.[0];

  // Don't show empty cart page if we're showing the confirmation modal
  if ((!cartItems || cartItems.length === 0) && !showConfirmation) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
              <button 
                onClick={() => navigate("/")}
                className="bg-[#D87D4A] text-white px-6 py-3 rounded-md hover:bg-[#FBAF85]"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="checkout-page">
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-28 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700 mb-8 inline-block"
          >
            Go Back
          </button>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 bg-white rounded-lg p-8">
              <h1 className="text-3xl font-bold mb-8 uppercase">Checkout</h1>

              {/* Billing Details */}
              <section className="mb-12">
                <h2 className="text-lg font-bold text-[#D87D4A] mb-6 uppercase">Billing Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">Name</label>
<input
  type="text"
  value={formData.name}
  onChange={(e) => handleInputChange('name', e.target.value)}
  className={`w-full border rounded-md px-4 py-3 text-sm font-bold placeholder-gray-400 focus:outline-none focus:border-[#D87D4A] focus:ring-1 focus:ring-[#D87D4A] ${
    errors.name 
      ? 'border-red-500' 
      : 'border-gray-300'
  }`}
  placeholder="Insert your name"
/>
{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
</div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full border rounded-md px-4 py-3 text-sm font-bold placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="alexei@mail.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full border rounded-md px-4 py-3 text-sm font-bold placeholder-gray-400 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="+1 202-555-0136"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </section>

              {/* Shipping Info */}
              <section className="mb-12">
                <h2 className="text-lg font-bold text-[#D87D4A] mb-6 uppercase">Shipping Info</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full border rounded-md px-4 py-3 text-sm font-bold placeholder-gray-400 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="1137 Williams Avenue"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className={`w-full border rounded-md px-4 py-3 text-sm font-bold placeholder-gray-400 ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="10001"
                      />
                      {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`w-full border rounded-md px-4 py-3 text-sm font-bold placeholder-gray-400 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="New York"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className={`w-full border rounded-md px-4 py-3 text-sm font-bold placeholder-gray-400 ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="United States"
                    />
                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                  </div>
                </div>
              </section>

              {/* Payment Details */}
              <section>
                <h2 className="text-lg font-bold text-[#D87D4A] mb-6 uppercase">Payment Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-4">Payment Method</label>
                    <div className="space-y-4">
                      <label className={`flex items-center border rounded-md p-4 cursor-pointer transition-all ${
                        formData.paymentMethod === "e-Money" 
                          ? 'border-[#D87D4A]' 
                          : 'border-gray-300 hover:border-[#D87D4A]'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="e-Money"
                          checked={formData.paymentMethod === "e-Money"}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                          className="mr-4"
                        />
                        <span className="text-sm font-bold">e-Money</span>
                      </label>
                      <label className={`flex items-center border rounded-md p-4 cursor-pointer transition-all ${
                        formData.paymentMethod === "Cash on Delivery" 
                          ? 'border-[#D87D4A]' 
                          : 'border-gray-300 hover:border-[#D87D4A]'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Cash on Delivery"
                          checked={formData.paymentMethod === "Cash on Delivery"}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                          className="mr-4"
                        />
                        <span className="text-sm font-bold">Cash on Delivery</span>
                      </label>
                    </div>
                  </div>

                  {formData.paymentMethod === "e-Money" && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold mb-2">e-Money Number</label>
                        <input
                          type="text"
                          value={formData.eMoneyNumber}
                          onChange={(e) => handleInputChange('eMoneyNumber', e.target.value)}
                          className={`w-full border rounded-md px-4 py-3 text-sm font-bold placeholder-gray-400 ${
                            errors.eMoneyNumber 
                              ? 'border-red-500' 
                              : formData.eMoneyNumber 
                                ? 'border-gray-300' 
                                : 'border-gray-300'
                          }`}
                          placeholder="238521993"
                        />
                        {errors.eMoneyNumber && <p className="text-red-500 text-sm mt-1">{errors.eMoneyNumber}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">e-Money PIN</label>
                        <input
                          type="password"
                          value={formData.eMoneyPIN}
                          onChange={(e) => handleInputChange('eMoneyPIN', e.target.value)}
                          className={`w-full border rounded-md px-4 py-3 text-sm font-bold placeholder-gray-400 ${
                            errors.eMoneyPIN 
                              ? 'border-red-500' 
                              : formData.eMoneyPIN 
                                ? 'border-gray-300' 
                                : 'border-gray-300'
                          }`}
                          placeholder="6891"
                          maxLength={4}
                        />
                        {errors.eMoneyPIN && <p className="text-red-500 text-sm mt-1">{errors.eMoneyPIN}</p>}
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === "Cash on Delivery" && (
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="w-12 h-12">
                        <img src="/image/cash.svg" alt="Cash on Delivery" />
                      </div>
                      <p>The 'Cash on Delivery' option enables you to pay in cash when our delivery courier arrives at your residence. Just make sure your address is correct so that your order will not be cancelled.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

          {/* Right Column - Order Summary */}
<div className="lg:col-span-1">
  <div className="bg-white rounded-lg p-8 sticky top-28">
    <h2 className="text-lg font-bold mb-6 uppercase">Summary</h2>
    
    {/* Cart Items */}
    <div className="space-y-6 mb-8">
      {cartItems?.map((item) => (
        <div key={item._id} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <p className="font-bold text-sm">{item.productName}</p>
              <p className="text-gray-500 text-sm">$ {(item.price || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="text-gray-500 font-bold">
            x{item.quantity}
          </div>
        </div>
      ))}
    </div>

    {/* Totals */}
    <div className="space-y-4 mb-8">
      <div className="flex justify-between">
        <span className="text-gray-500 uppercase">Total</span>
        <span className="font-bold">$ {getTotalPrice().toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500 uppercase">Shipping</span>
        <span className="font-bold">$ {shippingCost}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500 uppercase">Tax (VAT)</span>
        <span className="font-bold">$ {tax}</span>
      </div>
      <div className="flex justify-between border-t border-gray-300 pt-4">
        <span className="text-gray-500 uppercase">Grand Total</span>
        <span className="font-bold text-[#D87D4A]">$ {grandTotal.toLocaleString()}</span>
      </div>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-[#D87D4A] hover:bg-[#FBAF85] text-white font-bold py-4 rounded-md uppercase tracking-wider text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? "Processing..." : "Continue & Pay"}
    </button>

    {errors.submit && (
      <p className="text-red-500 text-sm mt-4 text-center">{errors.submit}</p>
    )}
  </div>
</div>
          </form>
        </div>
      </div>
      <Footer />

      {/* Order Confirmation Modal */}
      {showConfirmation && orderDetails && confirmationItems.length > 0 && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowConfirmation(false)}
          />
          
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8 w-[90%] max-w-[540px] z-50 shadow-2xl">
            {/* Large Orange Checkmark Icon */}
            <div className="w-20 h-20 bg-[#D87D4A] rounded-full flex items-center justify-center mb-6 mx-auto">
              <img src="/image/check.png" alt="Order Confirmed" />
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
                      <div className="w-12 h-12 bg-gray-300 rounded-md flex items-center justify-center overflow-hidden">
                        {firstItem.imageUrl ? (
                          <img 
                            src={firstItem.imageUrl} 
                            alt={firstItem.productName} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 text-xs">IMG</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{firstItem.productName}</p>
                        <p className="text-gray-500 text-sm">$ {(firstItem.price || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-gray-500 font-bold">
                      x{firstItem.quantity}
                    </div>
                  </div>
                )}

                {/* Other Items Count */}
                {confirmationItems.length > 1 && (
                  <div className="border-t border-gray-300 pt-4 text-center">
                    <p className="text-gray-600 text-sm">
                      and {confirmationItems.length - 1} other item(s)
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
      )}
    </div>
  );
}