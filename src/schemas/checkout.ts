import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7).optional(),
  address: z.string().min(5, "Enter a valid address"),
  city: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().min(2),
  // payment fields if any...
});
export type CheckoutForm = z.infer<typeof checkoutSchema>;
