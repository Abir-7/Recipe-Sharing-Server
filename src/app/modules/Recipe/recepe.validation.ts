import { z } from "zod";

export const zodRecipeSchema = z.object({
  recepe: z.string({
    required_error: "Recipe  is required",
  }),
  title: z.string({
    required_error: "Recipe title is required",
  }),
  category: z.string({
    required_error: "Recipe category is required",
  }),
  image: z.string({
    required_error: "Recipe Image is required",
  }),
});
