// convex/orders.ts
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel"; // Add 'type' keyword

export const createOrder = mutation({
  args: {
    customer: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
    }),
    shipping: v.object({
      address: v.string(),
      zipCode: v.string(),
      city: v.string(),
      country: v.string(),
    }),
    payment: v.object({
      method: v.union(v.literal("e-Money"), v.literal("Cash on Delivery")),
      eMoneyNumber: v.optional(v.string()),
      eMoneyPIN: v.optional(v.string()),
    }),
    items: v.array(v.object({
      productId: v.string(),
      productName: v.string(),
      price: v.number(),
      quantity: v.number(),
      imageUrl: v.optional(v.string()),
    })),
    totals: v.object({
      subtotal: v.number(),
      shipping: v.number(),
      tax: v.number(),
      grandTotal: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    try {
      // Create order in database first
      const orderId = await ctx.db.insert("orders", {
        ...args,
        status: "confirmed",
        orderDate: Date.now(),
      });

      console.log("✅ Order created:", orderId);

      // Schedule email sending (non-blocking)
      await ctx.scheduler.runAfter(0, internal.email.sendOrderConfirmation, {
        orderId: orderId,
        customerName: args.customer.name,
        customerEmail: args.customer.email,
        customerPhone: args.customer.phone,
        shippingAddress: {
          street: args.shipping.address,
          city: args.shipping.city,
          state: args.shipping.city,
          zipCode: args.shipping.zipCode,
          country: args.shipping.country,
        },
        items: args.items.map(item => ({
          id: item.productId,
          name: item.productName,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: args.totals.subtotal,
        shipping: args.totals.shipping,
        taxes: args.totals.tax,
        grandTotal: args.totals.grandTotal,
      });

      console.log("📧 Email scheduled for:", args.customer.email);
      return orderId;

    } catch (error) {
      console.error("❌ Failed to create order:", error);
      throw new Error("Failed to create order");
    }
  },
});

// FIXED: Query to get order by string ID from URL
export const getOrderById = query({
  args: { orderId: v.string() },
  handler: async (ctx, args) => {
    try {
      // Convert string ID to Convex ID
      const order = await ctx.db.get(args.orderId as Id<"orders">);
      return order;
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  },
});

// Keep your existing getOrder query for internal use
export const getOrder = query({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

export const getOrdersByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_email", (q) => q.eq("customer.email", args.email))
      .collect();
  },
});