import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { adminService } from "./admin.service";

const getAllAdminInfo = catchAsync(async (req, res) => {
  const result = await adminService.getAllAdminFromDb();
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Admin info are fetched successfully",
  });
});

const updateAdminProfile = catchAsync(async (req, res) => {
  const userId = req.params.id;

  const userData = req.body;
  const result = await adminService.adminProfileUpdate(userId, userData);

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Admin data is updated successfully",
  });
});

const adminDashboard = catchAsync(async (req, res) => {
  const result = await adminService.adminDashboard();
  console.log("hy");
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Admin dashboard data is fetched successfully",
  });
});

export const adminController = {
  getAllAdminInfo,
  updateAdminProfile,
  adminDashboard,
};
