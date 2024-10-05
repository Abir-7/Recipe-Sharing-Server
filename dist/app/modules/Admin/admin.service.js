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
exports.adminService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../User/user.model");
const admin_model_1 = require("./admin.model");
const recipe_model_1 = require("../Recipe/recipe.model");
const getAllAdminFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_model_1.Admin.aggregate([
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
                "userInfo.role": "admin", // Ensure the user's role is admin
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
const adminProfileUpdate = (userId, dataInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({
        _id: userId,
    });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User not Found");
    }
    const data = yield admin_model_1.Admin.findOneAndUpdate({
        email: isUserExist.email,
    }, dataInfo, { new: true });
    return data;
});
const adminDashboard = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUser = yield user_model_1.User.find({
        isblocked: false,
        isDeleted: false,
        role: "user",
    }).countDocuments();
    const totalAdmin = yield user_model_1.User.find({
        isblocked: false,
        isDeleted: false,
        role: "admin",
    }).countDocuments();
    const totalPost = yield recipe_model_1.Recipe.find({
        isDeleted: false,
        isPublished: true,
    }).countDocuments();
    return { totalAdmin, totalUser, totalPost };
});
exports.adminService = {
    getAllAdminFromDb,
    adminProfileUpdate,
    adminDashboard,
};
