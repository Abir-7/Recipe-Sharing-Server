import { z } from "zod";

export const zodRecipeSchema = z.object({
  recepe: z.string({
    required_error: "Recipe  is required",
  }),
});
