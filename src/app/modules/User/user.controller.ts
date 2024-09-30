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

const updatePassword = catchAsync(async (req, res) => {
  const data = req.body;
  console.log(data);
  const result = await userService.updateUserPassword(
    data?.token,
    data?.password
  );
  console.log(result);
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Password Updated Successfully",
  });
});

export const userController = { createCustomer, createAdmin, updatePassword };
