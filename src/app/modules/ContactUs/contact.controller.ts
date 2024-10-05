import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { postMessageIntoDB } from "./contact.service";

const postMesage = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await postMessageIntoDB(data);
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Message posted successfully",
  });
});

export const contactController = { postMesage };
