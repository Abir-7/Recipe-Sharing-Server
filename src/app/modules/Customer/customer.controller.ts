import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IAuthUserInfo } from "../../interface/global.interface";
import { customerService } from "./customer.service";

const updateCustomer = catchAsync(async (req, res) => {
  const { email } = req.params;
  const data = req.body;
  const result = await customerService.updateCustomerFromDB(email, data);

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "User updated Successfully",
  });
});

const getCustomerInfo = catchAsync(async (req, res) => {
  const userData = req.user as JwtPayload & IAuthUserInfo;

  const result = await customerService.getCustomerInfoFromDb(userData);

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Customer info is fetched successfully",
  });
});

export const customerController = {
  updateCustomer,
  getCustomerInfo,
};
