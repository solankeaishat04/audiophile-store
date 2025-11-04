// convex/migrations.ts
import { mutation } from "./_generated/server";

export const migrateCart = mutation({
  handler: async (ctx) => {
    try {
      // Check if cart table exists and has items
      const cartItems = await ctx.db.query("cart").collect();
      
      if (cartItems.length === 0) {
        return { migrated: 0, message: "No cart items to migrate" };
      }
      
      let migratedCount = 0;
      let deletedCount = 0;
      
      for (const item of cartItems) {
        try {
          // If price or productName are missing, we need to get them from products
          if (!item.price || !item.productName || item.price === null) {
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
                imageUrl: product.image || item.imageUrl,
              });
              migratedCount++;
            } else {
              // If product not found, delete the cart item
              await ctx.db.delete(item._id);
              deletedCount++;
            }
          }
        } catch (itemError) {
          console.error(`Error migrating cart item ${item._id}:`, itemError);
          // Continue with next item instead of failing entire migration
        }
      }
      
      return { 
        migrated: migratedCount, 
        deleted: deletedCount,
        total: cartItems.length 
      };
    } catch (error) {
      console.error("Migration failed:", error);
      // FIXED: Safe error message handling
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { 
        migrated: 0, 
        deleted: 0, 
        error: errorMessage 
      };
    }
  },
});