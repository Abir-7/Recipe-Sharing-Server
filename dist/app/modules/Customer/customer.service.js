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
exports.customerService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const customer_model_1 = require("./customer.model");
const recipe_model_1 = require("../Recipe/recipe.model");
const getAllCustomerInfoFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield customer_model_1.Customer.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userInfo",
            },
        },
        {
            $unwind: "$userInfo",
        },
        {
            $match: {
                "userInfo.isDeleted": { $ne: true },
            },
        },
        {
            $addFields: {
                user: "$userInfo",
            },
        },
        {
            $project: {
                userInfo: 0, // Exclude the userInfo field
            },
        },
    ]);
    return result;
});
const followUser = (mineId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const mydata = yield customer_model_1.Customer.findOne({ user: mineId });
    if (!mydata) {
        throw new Error("User not Found");
    }
    if ((mydata === null || mydata === void 0 ? void 0 : mydata._id.toString()) === userId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "you can not follow yourself");
    }
    const result = yield customer_model_1.Customer.findByIdAndUpdate(mydata === null || mydata === void 0 ? void 0 : mydata._id, { $addToSet: { following: userId } }, // Prevent duplicates
    { new: true });
    // Add current user to the target user's followers list
    yield customer_model_1.Customer.findByIdAndUpdate(userId, { $addToSet: { followers: mydata._id } }, { new: true });
    return result;
});
const unfollowUser = (mineId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const mydata = yield customer_model_1.Customer.findOne({ user: mineId });
    if (!mydata) {
        throw new Error("User not Found");
    }
    if ((mydata === null || mydata === void 0 ? void 0 : mydata._id.toString()) === userId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "you can not unfollow yourself");
    }
    const result = yield customer_model_1.Customer.findByIdAndUpdate(mydata === null || mydata === void 0 ? void 0 : mydata._id, { $pull: { following: userId } }, // Remove the user from following list
    { new: true });
    // Remove current user from the target user's followers list
    yield customer_model_1.Customer.findByIdAndUpdate(userId, { $pull: { followers: mydata._id } }, { new: true });
    return result;
});
const userDashboardData = (mineId) => __awaiter(void 0, void 0, void 0, function* () {
    const mydata = yield customer_model_1.Customer.findOne({ user: mineId })
        .populate("followers", "userName email photo")
        .populate("following", "userName email photo");
    if (!mydata) {
        throw new Error("User not Found");
    }
    const myRacipe = yield recipe_model_1.Recipe.find({
        customer: mydata._id,
        isDeleted: false,
    });
    console.log(myRacipe);
    return { myRacipe, mydata };
});
const getTopFollowerCustomer = () => __awaiter(void 0, void 0, void 0, function* () {
    const topFollowerCustomer = yield customer_model_1.Customer.find()
        .sort({ followers: -1 })
        .limit(4);
    return topFollowerCustomer;
});
exports.customerService = {
    getAllCustomerInfoFromDb,
    userDashboardData,
    followUser,
    unfollowUser,
    getTopFollowerCustomer,
};
