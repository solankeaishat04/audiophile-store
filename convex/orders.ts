// convex/orders.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

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
    // Create the order first
    const orderId = await ctx.db.insert("orders", {
      ...args,
      status: "confirmed",
      orderDate: Date.now(),
    });

    console.log("✅ Order created:", {
      orderId,
      customer: args.customer.email,
      total: args.totals.grandTotal,
      items: args.items.length,
    });

    // Schedule email sending (non-blocking)
    try {
      await ctx.scheduler.runAfter(0, internal.email.sendOrderConfirmation, {
        orderId: orderId,
        customerEmail: args.customer.email,
        customerName: args.customer.name,
        items: args.items.map(item => ({
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
        })),
        totals: args.totals,
        shipping: args.shipping,
      });
      console.log("📧 Email scheduled for:", args.customer.email);
    } catch (error) {
      console.error("❌ Failed to schedule email:", error);
      // Don't throw - we don't want email failures to prevent order creation
    }

    return orderId;
  },
});

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