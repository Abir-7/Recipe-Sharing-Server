import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Customer } from "./customer.model";
import mongoose from "mongoose";
import { Recipe } from "../Recipe/recipe.model";

const getAllCustomerInfoFromDb = async () => {
  const result = await Customer.aggregate([
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
};

const followUser = async (mineId: string, userId: string) => {
  const mydata = await Customer.findOne({ user: mineId });
  if (!mydata) {
    throw new Error("User not Found");
  }

  if (mydata?._id.toString() === userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "you can not follow yourself");
  }

  const result = await Customer.findByIdAndUpdate(
    mydata?._id,
    { $addToSet: { following: userId } }, // Prevent duplicates
    { new: true }
  );

  // Add current user to the target user's followers list
  await Customer.findByIdAndUpdate(
    userId,
    { $addToSet: { followers: mydata._id } },
    { new: true }
  );

  return result;
};

const unfollowUser = async (mineId: string, userId: string) => {
  const mydata = await Customer.findOne({ user: mineId });
  if (!mydata) {
    throw new Error("User not Found");
  }

  if (mydata?._id.toString() === userId) {
    throw new AppError(httpStatus.BAD_REQUEST, "you can not unfollow yourself");
  }

  const result = await Customer.findByIdAndUpdate(
    mydata?._id,
    { $pull: { following: userId } }, // Remove the user from following list
    { new: true }
  );

  // Remove current user from the target user's followers list
  await Customer.findByIdAndUpdate(
    userId,
    { $pull: { followers: mydata._id } },
    { new: true }
  );

  return result;
};

const userDashboardData = async (mineId: string) => {
  const mydata = await Customer.findOne({ user: mineId })
    .populate("followers", "userName email photo")
    .populate("following", "userName email photo");

  if (!mydata) {
    throw new Error("User not Found");
  }

  const myRacipe = await Recipe.find({ customer: mydata._id });
  return { myRacipe, mydata };
};

const getTopFollowerCustomer = async () => {
  const topFollowerCustomer = await Customer.find()
    .sort({ followers: -1 })
    .limit(4);

  return topFollowerCustomer;
};

export const customerService = {
  getAllCustomerInfoFromDb,
  userDashboardData,
  followUser,
  unfollowUser,
  getTopFollowerCustomer,
};
