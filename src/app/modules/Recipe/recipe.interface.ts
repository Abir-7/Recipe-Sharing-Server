import { Types } from "mongoose";

export interface IRecipe {
  recipe: string;
  title: string;
  photo: string;
  category: string;
  customer: Types.ObjectId;
  isDeleted: boolean;
  isPublished: boolean;
  isPremium: boolean;
}
