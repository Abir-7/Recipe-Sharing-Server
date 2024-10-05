import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../User/user.model";
import { Admin } from "./admin.model";
import { Recipe } from "../Recipe/recipe.model";

const getAllAdminFromDb = async () => {
  const result = await Admin.aggregate([
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
};

const adminProfileUpdate = async (
  userId: string,
  dataInfo: Record<string, unknown>
) => {
  const isUserExist = await User.findOne({
    _id: userId,
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not Found");
  }

  const data = await Admin.findOneAndUpdate(
    {
      email: isUserExist.email,
    },
    dataInfo,
    { new: true }
  );

  return data;
};

const adminDashboard = async () => {
  const totalUser = await User.find({
    isblocked: false,
    isDeleted: false,
    role: "user",
  }).countDocuments();

  const totalAdmin = await User.find({
    isblocked: false,
    isDeleted: false,
    role: "admin",
  }).countDocuments();

  const totalPost = await Recipe.find({
    isDeleted: false,
    isPublished: true,
  }).countDocuments();

  return { totalAdmin, totalUser, totalPost };
};

export const adminService = {
  getAllAdminFromDb,
  adminProfileUpdate,
  adminDashboard,
};
