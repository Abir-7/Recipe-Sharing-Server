"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const createCustomer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, customer } = req.body;
    const result = yield user_service_1.userService.createCustomerIntoDb(customer, password);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "User Created Successfully",
    });
}));
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, admin } = req.body;
    const result = yield user_service_1.userService.createAdminIntoDb(admin, password);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Admin Created Successfully",
    });
}));
const setNewPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const result = yield user_service_1.userService.setUserNewPassword(data === null || data === void 0 ? void 0 : data.token, data === null || data === void 0 ? void 0 : data.password);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Password Updated Successfully",
    });
}));
const passwordUpdate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const userData = req.user;
    const result = yield user_service_1.userService.updatePassword(userData, data === null || data === void 0 ? void 0 : data.oldPass, data.newPass);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Password Updated Successfully",
    });
}));
const meData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.user;
    const result = yield user_service_1.userService.myDataFromDb(userData);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "User data fetched successfully",
    });
}));
const updateProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.user;
    const userInfo = req.body;
    const result = yield user_service_1.userService.userProfileUpdate(userData, userInfo);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "User data is updated successfully",
    });
}));
const blockProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield user_service_1.userService.blockUserProfile(id);
    console.log(result);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: (result === null || result === void 0 ? void 0 : result.isblocked)
            ? "User blocked successfully"
            : "User unblocked successfully",
    });
}));
const deleteProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield user_service_1.userService.deletUserProfileDelet(id);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "User deleted successfully",
    });
}));
exports.userController = {
    createCustomer,
    createAdmin,
    setNewPassword,
    meData,
    updateProfile,
    passwordUpdate,
    blockProfile,
    deleteProfile,
};
