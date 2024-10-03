import httpStatus from "http-status";
import AppError from "../../errors/AppError";

import bcrypt from "bcrypt";
import { createToken } from "./auth.utils";

import { T_UserLogin } from "./auth.interface";
import { config } from "../../config";
import { User } from "../User/user.model";
import { Customer } from "../Customer/customer.model";
import { sendMail } from "../../utils/nodeMailer";
import { Payment } from "../Payment/payment.model";

const userLogin = async (logInData: T_UserLogin) => {
  //check if user exist
  const user = await User.findOne({ email: logInData.email }).select(["-__v"]);
  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User not found! Please Check your email."
    );
  }

  //check password is matched or not
  const isPasswordMatch = await bcrypt.compare(
    logInData.password,
    user.password
  );
  if (!isPasswordMatch) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password not matched! Please check your password"
    );
  }
  let photo = "";

  const customer = await Customer.findOne({ user: user._id });
  if (customer && customer.photo) {
    photo = customer.photo;
  }

  if (!customer && user.role !== "superAdmin") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "customer not found! Please Check your email."
    );
  }

  //check customer has any valid subcription  from payment data
  let hasValidSubscription = false;

  if (customer) {
    const payment = await Payment.findOne({
      customer: customer._id,
      paymentStatus: "paid",
    }).sort({ createdAt: -1 });

    if (payment && payment.validateFor) {
      const currentDate = new Date();
      if (new Date(payment.validateFor) > currentDate) {
        hasValidSubscription = true;
      }
    }
  }

  // Creating user data to include in token
  const userJWtData = {
    photo: photo,
    email: user.email,
    role: user.role,
    id: user._id,
    hasValidSubscription: hasValidSubscription || false,
  };

  // create token
  const accessToken = createToken(
    userJWtData,
    config.jwt_secrete_key as string,
    config.jwt_secrete_date as string
  );

  return {
    accessToken: accessToken,
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};

const userResetPassLinkGenarator = async (userEmail: string) => {
  const findUser = await User.findOne({ email: userEmail });
  if (!findUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }
  const accessToken = createToken(
    {
      email: userEmail,
      role: "",
    },
    config.jwt_secrete_key as string,
    "5m"
  );
  // { to, subject, text, html }
  sendMail({
    to: userEmail,
    subject: "Reset pass link",
    text: "Change your pass within 5min",
    html: `<a href="http://localhost:3000/reset-password?email=${userEmail}&token=${accessToken}">Reset Link</a>
  <p>Change your pass within 5min</p>`,
  });

  return accessToken;
};

export const AuthService = {
  userLogin,
  userResetPassLinkGenarator,
};
