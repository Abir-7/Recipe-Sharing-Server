import { RequestHandler } from "express";
import { AuthService } from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const loginUser: RequestHandler = catchAsync(async (req, res) => {
  const loginData = req.body;
  const result = await AuthService.userLogin(loginData);

  sendResponse(res, {
    data: { token: result },
    statusCode: 200,
    success: true,
    message: "User Login successfull",
  });
});

const resetPassLink: RequestHandler = catchAsync(async (req, res) => {
  const userEmail = req.body.email;

  const result = await AuthService.userResetPassLinkGenarator(userEmail);

  sendResponse(res, {
    data: { token: result },
    statusCode: 200,
    success: true,
    message: "User Login successfull",
  });
});

export const AuthController = {
  loginUser,
  resetPassLink,
};
