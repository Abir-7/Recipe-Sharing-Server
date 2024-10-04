import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { customerService } from "./customer.service";

const getAllCustomerInfo = catchAsync(async (req, res) => {
  const result = await customerService.getAllCustomerInfoFromDb();

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Customer info is fetched successfully",
  });
});

const followUser = catchAsync(async (req, res) => {
  const { userID } = req.body;
  const myData = req.user;
  const result = await customerService.followUser(myData.id, userID);

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "you followed successfully",
  });
});

const unfollowUser = catchAsync(async (req, res) => {
  const { userID } = req.body;
  const myData = req.user;
  const result = await customerService.unfollowUser(myData.id, userID);

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "you unfollowed successfully",
  });
});
const userDashboard = catchAsync(async (req, res) => {
  const myData = req.user;
  const result = await customerService.userDashboardData(myData.id);
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Dashboard data fethed successfully",
  });
});

const userWithTopFollower = catchAsync(async (req, res) => {
  const result = await customerService.getTopFollowerCustomer();
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Dashboard data fethed successfully",
  });
});

export const customerController = {
  userDashboard,
  getAllCustomerInfo,
  followUser,
  unfollowUser,
  userWithTopFollower,
};
