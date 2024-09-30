import mongoose from "mongoose";
import { User } from "./user.model";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IUser } from "./user.interface";
import { ICustomer } from "../Customer/customer.interface";
import { Customer } from "../Customer/customer.model";
import { IAdmin } from "../Admin/admin.interface";
import { Admin } from "../Admin/admin.model";
import bcrypt from "bcrypt";
import { config } from "../../config";

import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../../utils/jwtUtils";

const createCustomerIntoDb = async (data: ICustomer, password: string) => {
  const user: Partial<IUser> = {};
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    user.email = data.email;
    user.password = password;
    const userData = await User.create([user], { session });

    if (!userData.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    data.user = userData[0]._id;
    const result = await Customer.create([data], { session });

    if (!userData.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    await session.commitTransaction();
    await session.endSession();
    return result;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const createAdminIntoDb = async (data: IAdmin, password: string) => {
  const user: Partial<IUser> = {};

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    user.email = data.email;
    user.password = password;
    user.role = "admin";
    const userData = await User.create([user], { session });

    if (!userData.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create admin");
    }

    data.user = userData[0]._id;
    data.id = userData[0].id;
    const result = await Admin.create([data], { session });

    if (!userData.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create admin");
    }

    await session.commitTransaction();
    await session.endSession();
    return result;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

// userService.ts

const updateUserPassword = async (token: string, password: string) => {
  // Use the utility to decode the token
  const decoded = verifyToken(token);

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_sault_round)
  );

  const isUserExist = await User.findOne({ email: decoded.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not Found");
  }

  const result = await User.findOneAndUpdate(
    { email: decoded.email },
    { password: hashedPassword },
    { new: true } // Option to return the updated document
  );

  return result;
};

export const userService = {
  createCustomerIntoDb,
  createAdminIntoDb,
  updateUserPassword,
};
