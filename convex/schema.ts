// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    slug: v.string(),
    category: v.string(),
    price: v.number(),
    description: v.string(),
    features: v.string(),
    inBox: v.array(v.object({ 
      quantity: v.number(), 
      item: v.string() 
    })),
    image: v.string(),
    gallery: v.array(v.string()),
    new: v.optional(v.boolean()),
  }).index("by_slug", ["slug"]),
  
  cart: defineTable({
    productId: v.string(),
    productName: v.optional(v.string()), // Made optional
    price: v.optional(v.number()), // Made optional
    quantity: v.number(),
    imageUrl: v.optional(v.string()),
  }),

  orders: defineTable({
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
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("shipped"),
      v.literal("delivered")
    ),
    orderDate: v.number(),
  }).index("by_email", ["customer.email"])
    .index("by_date", ["orderDate"]),
});