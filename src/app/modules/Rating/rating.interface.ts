import { Types } from "mongoose";

export interface IRating {
  recipeId: Types.ObjectId;
  customerId: Types.ObjectId;
  rating: number;
  comment: string[];
  isLiked: boolean;
  isDisliked: boolean;
}
