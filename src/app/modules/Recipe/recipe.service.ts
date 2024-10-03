import { JwtPayload } from "jsonwebtoken";
import { Customer } from "../Customer/customer.model";
import { Recipe } from "./recipe.model";
import mongoose, { Types } from "mongoose";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const addRecipeIntoDb = async (userData: JwtPayload, recipe: string) => {
  const customerData = await Customer.findOne({ email: userData.email });
  const data = { recipe, customer: customerData?._id };
  const result = await Recipe.create(data);
  return result;
};

const getMyRecipeFromDb = async (userData: JwtPayload) => {
  const customerData = await Customer.findOne({ email: userData.email });
  console.log(customerData);
  const recipe = await Recipe.aggregate([
    {
      $match: {
        customer: customerData?._id,
      },
    },
    {
      $lookup: {
        from: "customers", // Join with the 'customers' collection
        localField: "customer", // Field in 'Recipe' collection
        foreignField: "_id", // Field in 'customers' collection
        as: "customer", // Name the output field
      },
    },
    {
      $unwind: "$customer", // Unwind to get the single customer object (since each recipe has one customer)
    },
    {
      $lookup: {
        from: "ratings", // Look up ratings collection
        localField: "_id",
        foreignField: "recipeId",
        as: "ratings",
      },
    },
    {
      $lookup: {
        from: "customers", // Look up customers again to get the details for the rating's customer
        localField: "ratings.customerId", // Use the customerId field in ratings
        foreignField: "_id",
        as: "ratingCustomers", // Store the result in 'ratingCustomers'
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
                  "$ratingCustomers.email", // Get email from 'ratingCustomers'
                  {
                    $indexOfArray: [
                      "$ratingCustomers._id",
                      "$$rating.customerId",
                    ],
                  }, // Match the rating's customerId
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
        recipe: "$$ROOT",
        totalLikes: 1,
        totalDislikes: 1,
        averageRating: 1,
        comments: 1,
        customer: 1, // Include the populated customer details for the recipe
      },
    },
  ]);
  console.log(recipe, "ff");
  return recipe;
};

const getAllRecipeFromDb = async () => {
  const recipes = await Recipe.aggregate([
    {
      $lookup: {
        from: "customers", // Join with the 'customers' collection
        localField: "customer", // Field in 'Recipe' collection
        foreignField: "_id", // Field in 'customers' collection
        as: "customer", // Name the output field
      },
    },
    {
      $unwind: "$customer", // Unwind to get the single customer object (since each recipe has one customer)
    },
    {
      $lookup: {
        from: "ratings", // Look up ratings collection
        localField: "_id",
        foreignField: "recipeId",
        as: "ratings",
      },
    },
    {
      $lookup: {
        from: "customers", // Look up customers again to get the details for the rating's customer
        localField: "ratings.customerId", // Use the customerId field in ratings
        foreignField: "_id",
        as: "ratingCustomers", // Store the result in 'ratingCustomers'
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
                  "$ratingCustomers.email", // Get email from 'ratingCustomers'
                  {
                    $indexOfArray: [
                      "$ratingCustomers._id",
                      "$$rating.customerId",
                    ],
                  }, // Match the rating's customerId
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
        recipe: "$$ROOT",
        totalLikes: 1,
        totalDislikes: 1,
        averageRating: 1,
        comments: 1,
        customer: 1, // Include the populated customer details for the recipe
      },
    },
  ]);

  return recipes;
};

const recipeDetailsFromDb = async (id: string, authEmail: string) => {
  const recipe = await Recipe.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) },
    },
    {
      $lookup: {
        from: "customers", // Join with the 'customers' collection
        localField: "customer", // Field in 'Recipe' collection
        foreignField: "_id", // Field in 'customers' collection
        as: "customer", // Name the output field
      },
    },
    {
      $unwind: "$customer", // Unwind to get the single customer object (since each recipe has one customer)
    },
    {
      $lookup: {
        from: "ratings", // Look up ratings collection
        localField: "_id",
        foreignField: "recipeId",
        as: "ratings",
      },
    },
    {
      $lookup: {
        from: "customers", // Look up customers again to get the details for the rating's customer
        localField: "ratings.customerId", // Use the customerId field in ratings
        foreignField: "_id",
        as: "ratingCustomers", // Store the result in 'ratingCustomers'
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
                  "$ratingCustomers.email", // Get email from 'ratingCustomers'
                  {
                    $indexOfArray: [
                      "$ratingCustomers._id",
                      "$$rating.customerId",
                    ],
                  }, // Match the rating's customerId
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
        recipe: "$$ROOT",
        totalLikes: 1,
        totalDislikes: 1,
        averageRating: 1,
        comments: 1,
        customer: 1, // Include the populated customer details for the recipe
      },
    },
  ]);

  const findAuthData = await Customer.findOne({ email: authEmail });

  const isFollower = recipe[0]?.customer?.followers
    ? recipe[0]?.customer?.followers.some((followerId: Types.ObjectId) =>
        followerId.equals(findAuthData?._id)
      )
    : false;
  console.log({ ...recipe[0], isFollower });

  return { ...recipe[0], isFollower };
};

const deleteRecipe = async (rId: string, userEmail: string) => {
  const customerData = await Customer.findOne({ email: userEmail });
  if (!customerData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Recipe not found");
  }
  const result = await Recipe.findOneAndDelete(
    {
      _id: rId,
      customer: customerData._id,
    },
    { new: true }
  );
  return result;
};

export const recipeService = {
  addRecipeIntoDb,
  getMyRecipeFromDb,
  getAllRecipeFromDb,
  recipeDetailsFromDb,
  deleteRecipe,
};
