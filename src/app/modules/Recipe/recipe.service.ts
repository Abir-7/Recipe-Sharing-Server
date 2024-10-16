import { JwtPayload } from "jsonwebtoken";
import { Customer } from "../Customer/customer.model";
import { Recipe } from "./recipe.model";
import mongoose, { Types } from "mongoose";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { IRecipe } from "./recipe.interface";

const updateRecipeIntoDb = async (
  authData: JwtPayload,
  rData: Partial<IRecipe>,
  rId: string
) => {
  const customerData = await Customer.findOne({ email: authData.email });
  if (!customerData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cant update Data");
  }
  const result = await Recipe.findOneAndUpdate(
    {
      _id: rId,
      customer: customerData?._id,
    },
    rData,
    { new: true }
  );

  return result;
};

const addRecipeIntoDb = async (
  userData: JwtPayload,
  recipe: Partial<IRecipe>
) => {
  const customerData = await Customer.findOne({ email: userData.email });
  const data = { ...recipe, customer: customerData?._id };

  const result = await Recipe.create(data);
  return result;
};

const getMyRecipeFromDb = async (
  userData: JwtPayload,
  search: string,
  sort: string,
  category: string,
  currentPage: number,
  pageSize: number
) => {
  const customerData = await Customer.findOne({ email: userData.email });

  const matchConditions: any = {
    customer: customerData?._id,
    isDeleted: false,
    isPublished: true,
  };
  console.log(category, search);
  // Add category filter if it's provided
  if (category) {
    matchConditions.category = category;
  }
  const totalRecipes = await Recipe.countDocuments(matchConditions);
  const recipe = await Recipe.aggregate([
    {
      $match: matchConditions,
    },
    // Add search filter if 'search' is provided
    ...(search
      ? [
          {
            $match: {
              $or: [
                {
                  title: {
                    $regex: search, // Search by title
                    $options: "i", // Case-insensitive
                  },
                },
                {
                  recipe: {
                    $regex: search, // Search by recipe
                    $options: "i", // Case-insensitive
                  },
                },
                {
                  category: {
                    $regex: search, // Search by category
                    $options: "i", // Case-insensitive
                  },
                },
              ],
            },
          },
        ]
      : []),

    {
      $lookup: {
        from: "customers", // Join with the 'customers' collection
        localField: "customer", // Field in 'Recipe' collection
        foreignField: "_id", // Field in 'customers' collection
        as: "customer", // Name the output field
      },
    },
    {
      $unwind: "$customer", // Unwind to get the single customer object
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

    // Define sorting conditions separately
  ])
    .sort(sort || "-createdAt")
    .skip((Number(currentPage) - 1) * Number(pageSize))
    .limit(Number(pageSize));

  const allCategory = (await Recipe.find()).map((i) => i.category);
  const uniqueCategories = [...new Set(allCategory)];

  return { recipe, allCategory: uniqueCategories, total: totalRecipes };
};

const getAllRecipeFromDb = async (
  search: string,
  sort: string,
  category: string,
  page: string,
  limit: string
) => {
  const matchConditions: any = {
    isDeleted: false,
    isPublished: true,
  };

  // Add category filter if it's provided
  if (category) {
    matchConditions.category = category;
  }

  const totalRecipes = await Recipe.countDocuments(matchConditions);

  const recipes = await Recipe.aggregate([
    {
      $match: matchConditions,
    },
    // Add search filter if 'search' is provided
    ...(search
      ? [
          {
            $match: {
              $or: [
                {
                  title: {
                    $regex: search, // Search by title
                    $options: "i", // Case-insensitive
                  },
                },
                {
                  recipe: {
                    $regex: search, // Search by recipe
                    $options: "i", // Case-insensitive
                  },
                },
                {
                  category: {
                    $regex: search, // Search by category
                    $options: "i", // Case-insensitive
                  },
                },
              ],
            },
          },
        ]
      : []),

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
  ])
    .sort(sort || "-createdAt")
    .limit(Number(page) * Number(limit));

  const allCategory = (await Recipe.find()).map((i) => i.category);
  const uniqueCategories = [...new Set(allCategory)];

  return { recipes, allCategory: uniqueCategories, total: totalRecipes };
};

const recipeDetailsFromDb = async (id: string, authEmail: string) => {
  const recipe = await Recipe.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
        isDeleted: false,
        isPublished: true,
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

  const findAuthData = await Customer.findOne({ email: authEmail });

  const isFollower = recipe[0]?.customer?.followers
    ? recipe[0]?.customer?.followers.some((followerId: Types.ObjectId) =>
        followerId.equals(findAuthData?._id)
      )
    : false;

  return { ...recipe[0], isFollower };
};

const deleteRecipe = async (rId: string, userEmail: string) => {
  const customerData = await Customer.findOne({ email: userEmail });
  if (!customerData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Recipe not found");
  }
  const recipeData = await Recipe.findOne({
    _id: rId,
    customer: customerData._id,
  });
  if (recipeData?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Recipe already deleted");
  }
  const result = await Recipe.findOneAndUpdate(
    {
      _id: rId,
      customer: customerData._id,
    },
    {
      isDeleted: true,
    },
    { new: true }
  );
  return result;
};

const getAllRecipeAdminFromDb = async () => {
  const recipes = await Recipe.aggregate([
    {
      $match: {
        isDeleted: false,
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

  return recipes;
};

const deleteAdminRecipe = async (rId: string) => {
  const recipeData = await Recipe.findOne({
    _id: rId,
  });
  if (recipeData?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Recipe already deleted");
  }
  const result = await Recipe.findOneAndUpdate(
    {
      _id: rId,
    },
    {
      isDeleted: true,
    },
    { new: true }
  );
  return result;
};

const unpublishAdminRecipe = async (rId: string) => {
  const recipeData = await Recipe.findOne({
    _id: rId,
  });
  if (recipeData?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Recipe already deleted");
  }
  if (recipeData?.isPublished) {
    const result = await Recipe.findOneAndUpdate(
      {
        _id: rId,
      },
      {
        isPublished: false,
      },
      { new: true }
    );
    return result;
  } else {
    const result = await Recipe.findOneAndUpdate(
      {
        _id: rId,
      },
      {
        isPublished: true,
      },
      { new: true }
    );
    return result;
  }
};

const getTopRecipesByLikes = async () => {
  const topRecipes = await Recipe.aggregate([
    {
      $match: {
        isDeleted: false,
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
      $unwind: "$customer", // Unwind to get the single customer object
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
        from: "customers", // Look up customers again for rating's customer
        localField: "ratings.customerId",
        foreignField: "_id",
        as: "ratingCustomers",
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
                  "$ratingCustomers.email",
                  {
                    $indexOfArray: [
                      "$ratingCustomers._id",
                      "$$rating.customerId",
                    ],
                  },
                ],
              },
              comment: "$$rating.comment",
            },
          },
        },
      },
    },
    {
      $sort: { totalLikes: -1 }, // Sort by totalLikes in descending order
    },
    {
      $limit: 5, // Limit to top 5 recipes
    },
    {
      $project: {
        recipe: "$$ROOT",
        totalLikes: 1,
        totalDislikes: 1,
        averageRating: 1,
        comments: 1,
        customer: 1,
      },
    },
  ]).sort("-averageRating");

  return topRecipes;
};

export const recipeService = {
  addRecipeIntoDb,
  getMyRecipeFromDb,
  getAllRecipeFromDb,
  recipeDetailsFromDb,
  deleteRecipe,
  getAllRecipeAdminFromDb,
  deleteAdminRecipe,
  unpublishAdminRecipe,
  getTopRecipesByLikes,
  updateRecipeIntoDb,
};
