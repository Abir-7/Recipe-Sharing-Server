import { model, Schema } from "mongoose";
import { IRecipe } from "./recipe.interface";

const recipeSchema = new Schema<IRecipe>({
  recipe: {
    type: String,
    required: [true, "Recipe name is required"], // Custom error message
  },
  customer: {
    type: Schema.Types.ObjectId,
    required: [true, "Customer name is required"],
    ref: "Customer", // Custom error message
  },
  upVote: {
    type: Number,

    default: 0, // Optional default value
  },
  downVote: {
    type: Number,

    default: 0, // Optional default value
  },
  rating: {
    avgRating: {
      type: Number,

      default: 0,
    },
    totalCount: {
      type: Number,

      default: 0,
    },
  },
});
export const Recipe = model<IRecipe>("Recipe", recipeSchema);
