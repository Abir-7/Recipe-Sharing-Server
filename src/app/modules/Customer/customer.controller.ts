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

export const customerController = {
  getAllCustomerInfo,
};
