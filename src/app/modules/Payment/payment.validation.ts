import { z } from "zod";

export const zodPaymentSchema = z.object({
  amount: z
    .number()
    .nonnegative(" Amount must be a positive number")
    .refine((val) => val > 0, {
      message: " Amount is required",
    }),
});
