/* eslint-disable @typescript-eslint/no-explicit-any */
// convex/email.ts
import { internalAction } from "./_generated/server";
import { v } from "convex/values";

export const sendOrderConfirmation = internalAction({
  args: {
    orderId: v.string(),
    customerEmail: v.string(),
    customerName: v.string(),
    items: v.array(v.object({
      productName: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    totals: v.object({
      subtotal: v.number(),
      shipping: v.number(),
      tax: v.number(),
      grandTotal: v.number(),
    }),
    shipping: v.object({
      address: v.string(),
      zipCode: v.string(),
      city: v.string(),
      country: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    try {
      // Generate email content
      const emailContent = generateEmailTemplate(args);
      
      console.log("📧 Sending confirmation email to:", args.customerEmail);
      console.log("📦 Order ID:", args.orderId);

      // Use Resend API to send actual email
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Audiophile <onboarding@resend.dev>', // Use your verified domain later
          to: [args.customerEmail],
          subject: `Order Confirmation #${args.orderId}`,
          html: emailContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Resend API error:', errorData);
        throw new Error(`Email failed: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Email sent successfully via Resend:", data.id);
      
      return { 
        success: true, 
        emailId: data.id,
        emailSent: args.customerEmail,
        orderId: args.orderId,
      };
    } catch (error) {
      console.error("Failed to send email:", error);
      // Don't throw error - we don't want email failures to break orders
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        emailSent: args.customerEmail,
        orderId: args.orderId,
      };
    }
  },
});

function generateEmailTemplate(args: any): string {
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Audiophile</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: #0E0E0E; color: white; padding: 40px 30px; text-align: center; }
        .header h1 { font-size: 28px; font-weight: bold; letter-spacing: 2px; margin-bottom: 10px; }
        .header h2 { font-size: 20px; font-weight: normal; color: #D87D4A; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; margin-bottom: 20px; }
        .order-summary { background: #f9f9f9; border-radius: 8px; padding: 25px; margin: 25px 0; border: 1px solid #e1e1e1; }
        .order-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .items-list { margin: 20px 0; }
        .item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e1e1e1; }
        .item:last-child { border-bottom: none; }
        .totals { border-top: 2px solid #ddd; padding-top: 20px; margin-top: 20px; }
        .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .grand-total { font-weight: bold; font-size: 18px; color: #D87D4A; }
        .shipping-info { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: #D87D4A; color: white; padding: 14px 35px; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        .footer { text-align: center; padding: 30px; background: #0E0E0E; color: #999; }
        .contact { margin: 25px 0; padding: 20px; background: #f9f9f9; border-radius: 8px; }
        @media (max-width: 600px) {
            .container { margin: 10px; }
            .header, .content { padding: 25px 20px; }
            .order-header { flex-direction: column; gap: 10px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>AUDIOPHILE</h1>
            <h2>Order Confirmation</h2>
        </div>
        
        <div class="content">
            <p class="greeting">Hi <strong>${args.customerName}</strong>,</p>
            <p>Thank you for your purchase! We're preparing your order and will notify you when it ships.</p>
            
            <div class="order-summary">
                <div class="order-header">
                    <div>
                        <strong>Order Number:</strong><br>
                        #${args.orderId}
                    </div>
                    <div>
                        <strong>Order Date:</strong><br>
                        ${orderDate}
                    </div>
                </div>
                
                <h3 style="margin-bottom: 15px;">Items Ordered:</h3>
                <div class="items-list">
                    ${args.items.map((item: any) => `
                    <div class="item">
                        <div>
                            <strong>${item.quantity}x</strong> ${item.productName}
                        </div>
                        <div>$${(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                    `).join('')}
                </div>
                
                <div class="totals">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>$${args.totals.subtotal.toLocaleString()}</span>
                    </div>
                    <div class="total-row">
                        <span>Shipping:</span>
                        <span>$${args.totals.shipping.toLocaleString()}</span>
                    </div>
                    <div class="total-row">
                        <span>Tax:</span>
                        <span>$${args.totals.tax.toLocaleString()}</span>
                    </div>
                    <div class="total-row grand-total">
                        <span>Grand Total:</span>
                        <span>$${args.totals.grandTotal.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <div class="shipping-info">
                <h3 style="margin-bottom: 15px;">Shipping Address:</h3>
                <p>
                    ${args.customerName}<br>
                    ${args.shipping.address}<br>
                    ${args.shipping.city}, ${args.shipping.zipCode}<br>
                    ${args.shipping.country}
                </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'https://youraudiophileapp.com'}/orders/${args.orderId}" class="button">
                    View Your Order
                </a>
            </div>
            
            <div class="contact">
                <h3 style="margin-bottom: 10px;">Need Help?</h3>
                <p>If you have any questions about your order, please contact our customer service team:</p>
                <p>📧 support@audiophile.com<br>📞 +1 (555) 123-4567</p>
            </div>
            
            <p>Best regards,<br><strong>The Audiophile Team</strong></p>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 Audiophile. All rights reserved.</p>
            <p>123 Audio Street, Sound City, SC 12345</p>
        </div>
    </div>
</body>
</html>
  `;
}