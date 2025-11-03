// convex/cart.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCart = query({
  handler: async (ctx) => {
    const cartItems = await ctx.db.query("cart").collect();
    
    // For items missing product details, we'll fetch product info but NOT update the cart
    // We'll return the enhanced data without modifying the database in a query
    const itemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        // Check if we have all required fields
        const hasRequiredFields = item.productName && item.price !== undefined && item.price !== null;
        
        if (hasRequiredFields) {
          return {
            ...item,
            price: item.price || 0,
          };
        }
        
        // Fetch product details if missing (read-only in query)
        const products = await ctx.db
          .query("products")
          .filter((q) => q.eq(q.field("_id"), item.productId))
          .collect();
        
        const product = products[0];
        if (product) {
          // Return enhanced data without updating the database
          return {
            ...item,
            productName: product.name,
            price: product.price,
            imageUrl: product.image,
          };
        }
        
        // If product not found but we have the item, provide safe defaults
        return {
          ...item,
          productName: item.productName || "Unknown Product",
          price: item.price || 0,
        };
      })
    );
    
    return itemsWithDetails;
  },
});

export const addToCart = mutation({
  args: {
    productId: v.string(),
    productName: v.optional(v.string()),
    price: v.optional(v.number()),
    quantity: v.number(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if item already exists in cart
    const existingItems = await ctx.db
      .query("cart")
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .collect();

    const existingItem = existingItems[0];

    if (existingItem) {
      // Update quantity if item exists
      await ctx.db.patch(existingItem._id, {
        quantity: existingItem.quantity + args.quantity,
      });
      return existingItem._id;
    } else {
      // If product details are missing, try to fetch from products
      let productName = args.productName;
      let price = args.price;
      let imageUrl = args.imageUrl;

      if (!productName || price === undefined) {
        const products = await ctx.db
          .query("products")
          .filter((q) => q.eq(q.field("_id"), args.productId))
          .collect();
        
        const product = products[0];
        if (product) {
          productName = product.name;
          price = product.price;
          imageUrl = product.image;
        } else {
          // If product not found, use provided values or defaults
          productName = productName || "Unknown Product";
          price = price || 0;
        }
      }

      // Add new item to cart
      const cartItemId = await ctx.db.insert("cart", {
        productId: args.productId,
        productName: productName || "Unknown Product",
        price: price || 0,
        quantity: args.quantity,
        imageUrl,
      });
      
      return cartItemId;
    }
  },
});

export const removeFromCart = mutation({
  args: {
    cartItemId: v.id("cart"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.cartItemId);
  },
});

export const updateCartQuantity = mutation({
  args: {
    cartItemId: v.id("cart"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.quantity <= 0) {
      await ctx.db.delete(args.cartItemId);
    } else {
      await ctx.db.patch(args.cartItemId, {
        quantity: args.quantity,
      });
    }
  },
});

export const clearCart = mutation({
  handler: async (ctx) => {
    const cartItems = await ctx.db.query("cart").collect();
    await Promise.all(cartItems.map(item => ctx.db.delete(item._id)));
  },
});

// Add a new mutation to fix cart items with missing data
export const fixCartItems = mutation({
  handler: async (ctx) => {
    const cartItems = await ctx.db.query("cart").collect();
    let fixedCount = 0;
    
    for (const item of cartItems) {
      if (!item.productName || item.price === undefined) {
        const products = await ctx.db
          .query("products")
          .filter((q) => q.eq(q.field("_id"), item.productId))
          .collect();
        
        const product = products[0];
        if (product) {
          await ctx.db.patch(item._id, {
            productName: product.name,
            price: product.price,
            imageUrl: product.image,
          });
          fixedCount++;
        } else {
          // If product not found, set defaults
          await ctx.db.patch(item._id, {
            productName: "Unknown Product",
            price: 0,
          });
          fixedCount++;
        }
      }
    }
    
    return { fixed: fixedCount };
  },
});