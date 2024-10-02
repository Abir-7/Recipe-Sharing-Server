import { Types } from "mongoose";

export interface IRecipe {
  recipe: string;
  customer: Types.ObjectId;
  upVote: number;
  downVote: number;
  rating: { avgRating: number; totalCount: number };
}
