import { Types } from "mongoose";

export interface IRecipe {
  recipe: string;
  customer: Types.ObjectId;
  isDeleted: boolean;
  isPublished: boolean;
}
