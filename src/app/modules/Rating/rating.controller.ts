import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ratingService } from "./rating.service";

const ratingOperation = catchAsync(async (req, res) => {
  const data = req.body;
  const userData = req.user; // User data from middleware (e.g., JWT token)

  const result = await ratingService.ratingOperationIntoDb(userData, data);

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Rating processed successfully",
  });
});

export const ratingController = {
  ratingOperation,
};
