import { model, Schema } from "mongoose";
import { IRating } from "./rating.interface";

const RatingSchema = new Schema<IRating>({
  recipeId: {
    type: Schema.Types.ObjectId,
    required: [true, "Recipe ID is required"],
    ref: "Recipe",
  },
  customerId: {
    type: Schema.Types.ObjectId,
    required: [true, "Customer ID is required"],
    ref: "Customer",
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    default: 0,
  },
  comment: {
    type: [String],
    default: [""],
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
  isDisliked: {
    type: Boolean,
    default: false,
  },
});

export const Rating = model<IRating>("Rating", RatingSchema);
