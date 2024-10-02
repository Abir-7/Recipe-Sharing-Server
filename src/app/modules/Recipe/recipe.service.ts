import { JwtPayload } from "jsonwebtoken";
import { Customer } from "../Customer/customer.model";
import { Recipe } from "./recipe.model";
import mongoose from "mongoose";

const addRecipeIntoDb = async (userData: JwtPayload, recipe: string) => {
  const customerData = await Customer.findOne({ email: userData.email });
  const data = { recipe, customer: customerData?._id };
  const result = await Recipe.create(data);
  return result;
};

const getMyRecipeFromDb = async (userData: JwtPayload) => {
  const customerData = await Customer.findOne({ email: userData.email });

  const result = await Recipe.find({ customer: customerData?._id });
  return result;
};

const getAllRecipeFromDb = async () => {
  const recipes = await Recipe.aggregate([
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "recipeId",
        as: "ratings",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "ratings.customerId",
        foreignField: "_id",
        as: "users",
      },
    },
    {
      $addFields: {
        totalLikes: {
          $size: {
            $filter: {
              input: "$ratings",
              as: "rating",
              cond: { $eq: ["$$rating.isLiked", true] },
            },
          },
        },
        totalDislikes: {
          $size: {
            $filter: {
              input: "$ratings",
              as: "rating",
              cond: { $eq: ["$$rating.isDisliked", true] },
            },
          },
        },
        averageRating: { $avg: "$ratings.rating" },
        comments: {
          $map: {
            input: "$ratings",
            as: "rating",
            in: {
              userEmail: {
                $arrayElemAt: [
                  "$users.email",
                  { $indexOfArray: ["$users._id", "$$rating.customerId"] },
                ],
              },
              comment: "$$rating.comment",
            },
          },
        },
      },
    },
    {
      $project: {
        recipe: 1,
        totalLikes: 1,
        totalDislikes: 1,
        averageRating: 1,
        comments: 1,
      },
    },
  ]);

  return recipes;
};

const recipeDetailsFromDb = async (id: string) => {
  const recipe = await Recipe.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) },
    },
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "recipeId",
        as: "ratings",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "ratings.customerId",
        foreignField: "_id",
        as: "users",
      },
    },
    {
      $addFields: {
        totalLikes: {
          $size: {
            $filter: {
              input: "$ratings",
              as: "rating",
              cond: { $eq: ["$$rating.isLiked", true] },
            },
          },
        },
        totalDislikes: {
          $size: {
            $filter: {
              input: "$ratings",
              as: "rating",
              cond: { $eq: ["$$rating.isDisliked", true] },
            },
          },
        },
        averageRating: { $avg: "$ratings.rating" },
        comments: {
          $map: {
            input: "$ratings",
            as: "rating",
            in: {
              userEmail: {
                $arrayElemAt: [
                  "$users.email",
                  { $indexOfArray: ["$users._id", "$$rating.customerId"] },
                ],
              },
              comment: "$$rating.comment",
            },
          },
        },
      },
    },
    {
      $project: {
        recipe: 1,
        totalLikes: 1,
        totalDislikes: 1,
        averageRating: 1,
        comments: 1,
      },
    },
  ]);

  return recipe;
};

export const recipeService = {
  addRecipeIntoDb,
  getMyRecipeFromDb,
  getAllRecipeFromDb,
  recipeDetailsFromDb,
};
