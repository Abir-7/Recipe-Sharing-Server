import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";

const createCustomer = catchAsync(async (req, res) => {
  const { password, customer } = req.body;

  const result = await userService.createCustomerIntoDb(customer, password);

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "User Created Successfully",
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin } = req.body;

  const result = await userService.createAdminIntoDb(admin, password);

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Admin Created Successfully",
  });
});

const setNewPassword = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await userService.setUserNewPassword(
    data?.token,
    data?.password
  );

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Password Updated Successfully",
  });
});
const passwordUpdate = catchAsync(async (req, res) => {
  const data = req.body;
  const userData = req.user;

  const result = await userService.updatePassword(
    userData,
    data?.oldPass,
    data.newPass
  );

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Password Updated Successfully",
  });
});

const meData = catchAsync(async (req, res) => {
  const userData = req.user;
  const result = await userService.myDataFromDb(userData);

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "User data fetched successfully",
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const userData = req.user;
  const userInfo = req.body;
  const result = await userService.userProfileUpdate(userData, userInfo);

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "User data is updated successfully",
  });
});

const blockProfile = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await userService.blockUserProfile(id);
  console.log(result);
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: result?.isblocked
      ? "User blocked successfully"
      : "User unblocked successfully",
  });
});
const deleteProfile = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await userService.deletUserProfileDelet(id);

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
  });
});

export const userController = {
  createCustomer,
  createAdmin,
  setNewPassword,
  meData,
  updateProfile,
  passwordUpdate,
  blockProfile,
  deleteProfile,
};
