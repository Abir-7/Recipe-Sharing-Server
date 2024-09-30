import { model, Schema } from "mongoose";

import bcrypt from "bcrypt";

import AppError from "../../errors/AppError";
import httpstatus from "http-status";
import { userRole } from "./user.const";
import { IUser } from "./user.interface";
import { config } from "../../config";
export const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, "User email is required"],
    unique: true,
  },
  password: { type: String, required: [true, "User password is required"] },
  role: {
    type: String,
    enum: userRole,
    required: [true, "User role is required"],
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  const isUserExist = await User.findOne({ email: this.email });
  if (isUserExist) {
    throw new AppError(httpstatus.CONFLICT, "User already exist");
  }
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_sault_round)
  );
  next();
});

userSchema.post("save", async function (data) {
  data.password = "**********************";
});
export const User = model<IUser>("User", userSchema);
