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

import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../../utils/jwtUtils";

// const createCustomerIntoDb2 = async (data: any, password: string) => {
//   const user: Partial<IUser> = {};
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     console.log(data);

//     // Set user fields
//     user.email = data.email;
//     user.password = password;

//     // Create user
//     const userData = await User.create([user], { session });
//     if (!userData.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
//     }

//     // Set the created user ID to the customer data
//     data.user = userData[0]._id;

//     // Create customer
//     const result = await Customer.create([data], { session });
//     if (!result.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Failed to create customer");
//     }

//     // Commit transaction and end session
//     await session.commitTransaction();
//     return result;
//   } catch (error) {
//     // Abort transaction and rethrow error
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     await session.endSession();
//   }
// };

const createCustomerIntoDb = async (data: any, password: string) => {
  try {
    console.log(data);

    // Create user data
    const user: Partial<IUser> = {
      email: data.email,
      password: password,
    };

    // Create user (without session/transaction)
    const userData = await User.create(user);
    if (!userData) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    // Set the created user ID to the customer data
    data.user = userData._id;

    // Create customer (without session/transaction)
    const result = await Customer.create(data);
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create customer");
    }

    // Return result
    return result;
  } catch (error) {
    throw error;
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

const setUserNewPassword = async (token: string, password: string) => {
  // Use the utility to decode the token
  const decoded = verifyToken(token);

  const isUserExist = await User.findOne({ email: decoded.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not Found");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_sault_round)
  );

  const result = await User.findOneAndUpdate(
    { email: decoded.email },
    { password: hashedPassword },
    { new: true } // Option to return the updated document
  );

  return result;
};

const updatePassword = async (
  userData: JwtPayload,
  oldPass: string,
  newPass: string
) => {
  const isUserExist = await User.findOne({
    email: userData.email,
    _id: userData.id,
  });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not Found");
  }

  const isPasswordMatch = await bcrypt.compare(oldPass, isUserExist.password);
  if (!isPasswordMatch) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password not matched! Please check your password"
    );
  }
  const hashedPassword = await bcrypt.hash(
    newPass,
    Number(config.bcrypt_sault_round)
  );

  const result = await User.findOneAndUpdate(
    { email: userData.email },
    { password: hashedPassword },
    { new: true }
  );
  return result;
};

const myDataFromDb = async (userData: JwtPayload) => {
  // Use the utility to decode the token

  const data = await Customer.findOne({
    email: userData.email,
    user: userData.id,
  });

  return data;
};

const userProfileUpdate = async (
  userData: JwtPayload,
  dataInfo: Record<string, unknown>
) => {
  const isUserExist = await User.findOne({
    email: userData.email,
    _id: userData.id,
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not Found");
  }

  const data = await Customer.findOneAndUpdate(
    {
      email: userData.email,
      user: userData.id,
    },
    dataInfo,
    { new: true }
  );

  return data;
};

const blockUserProfile = async (id: string) => {
  const isUserExist = await User.findOne({
    _id: id,
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not Found");
  }
  if (isUserExist.isblocked) {
    const data = await User.findOneAndUpdate(
      {
        _id: id,
      },
      { isblocked: false },
      { new: true }
    );

    return data;
  } else {
    const data = await User.findOneAndUpdate(
      {
        _id: id,
      },
      { isblocked: true },
      { new: true }
    );

    return data;
  }
};

const deletUserProfileDelet = async (id: string) => {
  const isUserExist = await User.findOne({
    _id: id,
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not Found");
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already deleted");
  }

  const data = await User.findOneAndUpdate(
    {
      _id: id,
    },
    { isDeleted: true },
    { new: true }
  );

  return data;
};

export const userService = {
  updatePassword,
  createCustomerIntoDb,
  createAdminIntoDb,
  setUserNewPassword,
  myDataFromDb,
  userProfileUpdate,
  deletUserProfileDelet,
  blockUserProfile,
};
