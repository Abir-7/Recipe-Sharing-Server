"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipeService = void 0;
const customer_model_1 = require("../Customer/customer.model");
const recipe_model_1 = require("./recipe.model");
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const updateRecipeIntoDb = (authData, rData, rId) => __awaiter(void 0, void 0, void 0, function* () {
    const customerData = yield customer_model_1.Customer.findOne({ email: authData.email });
    if (!customerData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cant update Data");
    }
    const result = yield recipe_model_1.Recipe.findOneAndUpdate({
        _id: rId,
        customer: customerData === null || customerData === void 0 ? void 0 : customerData._id,
    }, rData, { new: true });
    return result;
});
const addRecipeIntoDb = (userData, recipe) => __awaiter(void 0, void 0, void 0, function* () {
    const customerData = yield customer_model_1.Customer.findOne({ email: userData.email });
    const data = Object.assign(Object.assign({}, recipe), { customer: customerData === null || customerData === void 0 ? void 0 : customerData._id });
    const result = yield recipe_model_1.Recipe.create(data);
    return result;
});
const getMyRecipeFromDb = (userData, search, sort, category, currentPage, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
    const customerData = yield customer_model_1.Customer.findOne({ email: userData.email });
    const matchConditions = {
        customer: customerData === null || customerData === void 0 ? void 0 : customerData._id,
        isDeleted: false,
        isPublished: true,
    };
    console.log(category, search);
    // Add category filter if it's provided
    if (category) {
        matchConditions.category = category;
    }
    const totalRecipes = yield recipe_model_1.Recipe.countDocuments(matchConditions);
    const recipe = yield recipe_model_1.Recipe.aggregate([
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
    const allCategory = (yield recipe_model_1.Recipe.find()).map((i) => i.category);
    const uniqueCategories = [...new Set(allCategory)];
    return { recipe, allCategory: uniqueCategories, total: totalRecipes };
});
const getAllRecipeFromDb = (search, sort, category, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const matchConditions = {
        isDeleted: false,
        isPublished: true,
    };
    // Add category filter if it's provided
    if (category) {
        matchConditions.category = category;
    }
    const totalRecipes = yield recipe_model_1.Recipe.countDocuments(matchConditions);
    const recipes = yield recipe_model_1.Recipe.aggregate([
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
    const allCategory = (yield recipe_model_1.Recipe.find()).map((i) => i.category);
    const uniqueCategories = [...new Set(allCategory)];
    return { recipes, allCategory: uniqueCategories, total: totalRecipes };
});
const recipeDetailsFromDb = (id, authEmail) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const recipe = yield recipe_model_1.Recipe.aggregate([
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(id),
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
    const findAuthData = yield customer_model_1.Customer.findOne({ email: authEmail });
    const isFollower = ((_b = (_a = recipe[0]) === null || _a === void 0 ? void 0 : _a.customer) === null || _b === void 0 ? void 0 : _b.followers)
        ? (_d = (_c = recipe[0]) === null || _c === void 0 ? void 0 : _c.customer) === null || _d === void 0 ? void 0 : _d.followers.some((followerId) => followerId.equals(findAuthData === null || findAuthData === void 0 ? void 0 : findAuthData._id))
        : false;
    return Object.assign(Object.assign({}, recipe[0]), { isFollower });
});
const deleteRecipe = (rId, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const customerData = yield customer_model_1.Customer.findOne({ email: userEmail });
    if (!customerData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Recipe not found");
    }
    const recipeData = yield recipe_model_1.Recipe.findOne({
        _id: rId,
        customer: customerData._id,
    });
    if (recipeData === null || recipeData === void 0 ? void 0 : recipeData.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Recipe already deleted");
    }
    const result = yield recipe_model_1.Recipe.findOneAndUpdate({
        _id: rId,
        customer: customerData._id,
    }, {
        isDeleted: true,
    }, { new: true });
    return result;
});
const getAllRecipeAdminFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const recipes = yield recipe_model_1.Recipe.aggregate([
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
});
const deleteAdminRecipe = (rId) => __awaiter(void 0, void 0, void 0, function* () {
    const recipeData = yield recipe_model_1.Recipe.findOne({
        _id: rId,
    });
    if (recipeData === null || recipeData === void 0 ? void 0 : recipeData.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Recipe already deleted");
    }
    const result = yield recipe_model_1.Recipe.findOneAndUpdate({
        _id: rId,
    }, {
        isDeleted: true,
    }, { new: true });
    return result;
});
const unpublishAdminRecipe = (rId) => __awaiter(void 0, void 0, void 0, function* () {
    const recipeData = yield recipe_model_1.Recipe.findOne({
        _id: rId,
    });
    if (recipeData === null || recipeData === void 0 ? void 0 : recipeData.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Recipe already deleted");
    }
    if (recipeData === null || recipeData === void 0 ? void 0 : recipeData.isPublished) {
        const result = yield recipe_model_1.Recipe.findOneAndUpdate({
            _id: rId,
        }, {
            isPublished: false,
        }, { new: true });
        return result;
    }
    else {
        const result = yield recipe_model_1.Recipe.findOneAndUpdate({
            _id: rId,
        }, {
            isPublished: true,
        }, { new: true });
        return result;
    }
});
const getTopRecipesByLikes = () => __awaiter(void 0, void 0, void 0, function* () {
    const topRecipes = yield recipe_model_1.Recipe.aggregate([
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
});
exports.recipeService = {
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
