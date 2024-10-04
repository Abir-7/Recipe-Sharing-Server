import { model, Schema } from "mongoose";
import { IRecipe } from "./recipe.interface";

const recipeSchema = new Schema<IRecipe>(
  {
    recipe: {
      type: String,
      required: [true, "Recipe name is required"], // Custom error message
    },
    photo: {
      type: String,
      required: [true, "Recipe photo is required"], // Custom error message
    },
    category: {
      type: String,
      required: [true, "Recipe category is required"], // Custom error message
    },
    title: {
      type: String,
      required: [true, "Recipe Title is required"], // Custom error message
    },
    customer: {
      type: Schema.Types.ObjectId,
      required: [true, "Customer name is required"],
      ref: "Customer", // Custom error message
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
export const Recipe = model<IRecipe>("Recipe", recipeSchema);
