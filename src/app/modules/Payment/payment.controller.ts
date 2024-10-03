/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import { Payment } from "./payment.model";

const payment = catchAsync(async (req, res) => {
  const result = await paymentService.createPaymentIntoDB(
    req.body,
    req.user as JwtPayload
  );

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Subciption placed successfully",
  });
});

export const paymentController = {
  payment,
};
