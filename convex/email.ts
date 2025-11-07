// convex/email.ts
"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import nodemailer from 'nodemailer';

export const sendOrderConfirmation = internalAction({
  args: {
    orderId: v.string(),
    name: v.string(),
    to: v.string(),
    items: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
      })
    ),
    shipping: v.object({
      address: v.string(),
      city: v.string(),
      state: v.string(),
      country: v.string(),
    }),
    totals: v.object({
      grandTotal: v.number(),
      shipping: v.number(),
      taxes: v.number(),
    }),
  },
  handler: async (_, args) => {
    // Get credentials from environment variables
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    
    if (!gmailUser || !gmailAppPassword) {
      throw new Error("Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables in your Convex dashboard.");
    }

    console.log("📧 Sending order confirmation to:", args.to);
    console.log("🔧 Using Gmail account:", gmailUser);

    const subtotal = args.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const emailHtml = generateOrderEmailHtml({
      orderId: args.orderId,
      customerName: args.name,
      customerEmail: args.to,
      items: args.items,
      shippingAddress: {
        street: args.shipping.address,
        city: args.shipping.city,
        state: args.shipping.state,
        zipCode: "", // Not provided in shipping object
        country: args.shipping.country,
      },
      subtotal,
      shippingCost: args.totals.shipping,
      taxes: args.totals.taxes,
      grandTotal: args.totals.grandTotal,
    });

    try {
      // Create email transporter with Gmail service
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailAppPassword, // Use the app password, NOT your Gmail password
        },
      });

      console.log("✅ SMTP transporter created");

      // Verify connection first
      await transporter.verify();
      console.log("✅ SMTP connection verified");

      // Send email
      const info = await transporter.sendMail({
        from: `"Audiophile Store" <${gmailUser}>`,
        to: args.to,
        subject: `Order Confirmation - ${args.orderId}`,
        html: emailHtml,
        text: generatePlainTextEmail({
          orderId: args.orderId,
          customerName: args.name,
          items: args.items,
          grandTotal: args.totals.grandTotal,
          shippingAddress: args.shipping,
        }),
      });

      console.log("✅ Email sent successfully! Message ID:", info.messageId);
      console.log("✅ Email sent to:", args.to);
      
      return { 
        success: true, 
        messageId: info.messageId,
        recipient: args.to
      };

    } catch (error) {
      console.error("❌ Failed to send email:", error);
      
      // More detailed error logging
      if (error instanceof Error) {
        console.error("❌ Error details:", {
          message: error.message,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code: (error as any).code,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          command: (error as any).command,
        });
      }
      
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

// Helper function for plain text email
function generatePlainTextEmail(order: {
  orderId: string;
  customerName: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  grandTotal: number;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
}): string {
  const itemsText = order.items
    .map(item => `- ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');

  return `
Hi ${order.customerName},

Thank you for your order! We've received your order #${order.orderId} and it's being processed.

ORDER SUMMARY:
${itemsText}

Shipping Address:
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.state}
${order.shippingAddress.country}

Grand Total: $${order.grandTotal.toFixed(2)}

You can view your order details by logging into your account on our website.

Thank you for choosing Audiophile!
  `.trim();
}

// Your existing HTML template function (unchanged)
function generateOrderEmailHtml(order: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  shippingCost: number;
  taxes: number;
  grandTotal: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}): string {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #4f46e5; padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Thank You for Your Order!</h1>
                </td>
              </tr>
              
              <!-- Greeting -->
              <tr>
                <td style="padding: 30px 30px 20px;">
                  <p style="margin: 0; font-size: 16px; color: #374151;">Hi ${order.customerName},</p>
                  <p style="margin: 15px 0 0; font-size: 16px; color: #374151; line-height: 1.6;">
                    We've received your order and it's being processed. You'll receive another email when your order ships.
                  </p>
                </td>
              </tr>
              
              <!-- Order ID -->
              <tr>
                <td style="padding: 0 30px 20px;">
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #4f46e5;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Order ID:</p>
                    <p style="margin: 5px 0 0; font-size: 18px; font-weight: 600; color: #111827;">${order.orderId}</p>
                  </div>
                </td>
              </tr>
              
              <!-- Order Items -->
              <tr>
                <td style="padding: 0 30px 20px;">
                  <h2 style="margin: 0 0 15px; font-size: 20px; color: #111827;">Order Summary</h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                    <thead>
                      <tr style="background-color: #f9fafb;">
                        <th style="padding: 12px; text-align: left; font-size: 14px; color: #6b7280; font-weight: 600;">Item</th>
                        <th style="padding: 12px; text-align: center; font-size: 14px; color: #6b7280; font-weight: 600;">Qty</th>
                        <th style="padding: 12px; text-align: right; font-size: 14px; color: #6b7280; font-weight: 600;">Price</th>
                        <th style="padding: 12px; text-align: right; font-size: 14px; color: #6b7280; font-weight: 600;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>
                </td>
              </tr>
              
              <!-- Totals -->
              <tr>
                <td style="padding: 0 30px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Subtotal:</td>
                      <td style="padding: 8px 0; font-size: 14px; color: #111827; text-align: right;">$${order.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Shipping:</td>
                      <td style="padding: 8px 0; font-size: 14px; color: #111827; text-align: right;">$${order.shippingCost.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Taxes:</td>
                      <td style="padding: 8px 0; font-size: 14px; color: #111827; text-align: right;">$${order.taxes.toFixed(2)}</td>
                    </tr>
                    <tr style="border-top: 2px solid #e5e7eb;">
                      <td style="padding: 12px 0 0; font-size: 18px; font-weight: 700; color: #111827;">Grand Total:</td>
                      <td style="padding: 12px 0 0; font-size: 18px; font-weight: 700; color: #4f46e5; text-align: right;">$${order.grandTotal.toFixed(2)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Shipping Details -->
              <tr>
                <td style="padding: 0 30px 20px;">
                  <h2 style="margin: 0 0 15px; font-size: 20px; color: #111827;">Shipping Details</h2>
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px;">
                    <p style="margin: 0; font-size: 14px; color: #111827; line-height: 1.8;">
                      ${order.shippingAddress.street}<br>
                      ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
                      ${order.shippingAddress.country}
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Support Info -->
              <tr>
                <td style="padding: 0 30px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 20px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                    Need help? Contact our support team at<br>
                    <a href="mailto:support@audiophile.com" style="color: #4f46e5; text-decoration: none;">support@audiophile.com</a>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                    © ${new Date().getFullYear()} Audiophile. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}