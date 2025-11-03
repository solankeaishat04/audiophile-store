// convex/migrations.ts
import { mutation } from "./_generated/server";

export const migrateCart = mutation({
  handler: async (ctx) => {
    const cartItems = await ctx.db.query("cart").collect();
    
    for (const item of cartItems) {
      // If price and productName are missing, we need to get them from products
      if (!item.price || !item.productName) {
        // Try to find the product by productId
        const products = await ctx.db
          .query("products")
          .filter((q) => q.eq(q.field("_id"), item.productId))
          .collect();
        
        const product = products[0];
        
        if (product) {
          // Update the cart item with product details
          await ctx.db.patch(item._id, {
            productName: product.name,
            price: product.price,
            imageUrl: product.image,
          });
        } else {
          // If product not found, delete the cart item
          await ctx.db.delete(item._id);
        }
      }
    }
    
    return { migrated: cartItems.length };
  },
});