import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ConvexProvider,
  ConvexReactClient,
} from "convex/react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

import Home from "./pages/Home";
import Headphones from "./pages/Headphones";
import Product from "./pages/Product";
import Cart from "./pages/carts";
import OrderDetails from "./pages/orderDetails";

import "./App.css";
import Speakers from "./pages/Speaker";
import Earphones from "./pages/Earphones";
import Category from "./pages/Category";
import Checkout from "./pages/Checkout";

// ✅ Convex client setup — make sure your .env has VITE_CONVEX_URL
const convexUrl: string =
  import.meta.env.VITE_CONVEX_URL ?? "http://localhost:6789";
const convexClient = new ConvexReactClient(convexUrl);

// Create a wrapper component to use the migration hook
function AppContent() {
  const migrateCart = useMutation(api.migration.migrateCart);
  
  // Run migration on app start
  useEffect(() => {
    migrateCart().catch(console.error);
  }, [migrateCart]);
  
  return (
    <Router>
      <Routes>
        {/* Home route */}
        <Route path="/" element={<Home />} />

        {/* Product route */}
        <Route path="/Headphones" element={<Headphones/>} />
        <Route path="/Speakers" element={<Speakers/>}/>
        <Route path="/Earphones" element={<Earphones/>} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders/:orderId" element={<OrderDetails/>}/>

        {/* Dynamic category route last */}
        <Route path="/:category" element={<Category />} />
      </Routes>
    </Router>
  );
}

const App: React.FC = () => {
  return (
    <ConvexProvider client={convexClient}>
      <AppContent />
    </ConvexProvider>
  );
};

export default App;