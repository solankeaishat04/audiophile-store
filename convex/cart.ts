// convex/cart.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCart = query({
  handler: async (ctx) => {
    try {
      const cartItems = await ctx.db.query("cart").collect();
      
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
          try {
            const products = await ctx.db
              .query("products")
              .filter((q) => q.eq(q.field("_id"), item.productId))
              .collect();
            
            const product = products[0];
            if (product) {
              return {
                ...item,
                productName: product.name,
                price: product.price,
                imageUrl: product.image,
              };
            }
          } catch (error) {
            console.error("Error fetching product:", error);
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
    } catch (error) {
      console.error("Error in getCart:", error);
      return []; // Return empty array instead of throwing
    }
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
    try {
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
          try {
            const products = await ctx.db
              .query("products")
              .filter((q) => q.eq(q.field("_id"), args.productId))
              .collect();
            
            const product = products[0];
            if (product) {
              productName = product.name;
              price = product.price;
              imageUrl = product.image;
            }
          } catch (error) {
            console.error("Error fetching product details:", error);
          }
        }

        // Add new item to cart
        const cartItemId = await ctx.db.insert("cart", {
          productId: args.productId,
          productName: productName || "Unknown Product",
          price: price || 0,
          quantity: args.quantity,
          imageUrl: imageUrl || "",
        });
        
        return cartItemId;
      }
    } catch (error) {
      console.error("Error in addToCart:", error);
      throw new Error("Failed to add item to cart");
    }
  },
});

export const removeFromCart = mutation({
  args: {
    cartItemId: v.id("cart"),
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.delete(args.cartItemId);
    } catch (error) {
      console.error("Error in removeFromCart:", error);
      throw new Error("Failed to remove item from cart");
    }
  },
});

export const updateCartQuantity = mutation({
  args: {
    cartItemId: v.id("cart"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      if (args.quantity <= 0) {
        await ctx.db.delete(args.cartItemId);
      } else {
        await ctx.db.patch(args.cartItemId, {
          quantity: args.quantity,
        });
      }
    } catch (error) {
      console.error("Error in updateCartQuantity:", error);
      throw new Error("Failed to update cart quantity");
    }
  },
});

export const clearCart = mutation({
  handler: async (ctx) => {
    try {
      const cartItems = await ctx.db.query("cart").collect();
      await Promise.all(cartItems.map(item => ctx.db.delete(item._id)));
    } catch (error) {
      console.error("Error in clearCart:", error);
      throw new Error("Failed to clear cart");
    }
  },
});