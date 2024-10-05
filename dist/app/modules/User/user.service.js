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
exports.userService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const customer_model_1 = require("../Customer/customer.model");
const admin_model_1 = require("../Admin/admin.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../../config");
const jwtUtils_1 = require("../../utils/jwtUtils");
const createCustomerIntoDb = (data, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {};
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        user.email = data.email;
        user.password = password;
        const userData = yield user_model_1.User.create([user], { session });
        if (!userData.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create user");
        }
        data.user = userData[0]._id;
        const result = yield customer_model_1.Customer.create([data], { session });
        if (!userData.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create user");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return result;
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error);
    }
});
const createAdminIntoDb = (data, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {};
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        user.email = data.email;
        user.password = password;
        user.role = "admin";
        const userData = yield user_model_1.User.create([user], { session });
        if (!userData.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create admin");
        }
        data.user = userData[0]._id;
        data.id = userData[0].id;
        const result = yield admin_model_1.Admin.create([data], { session });
        if (!userData.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create admin");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return result;
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error);
    }
});
const setUserNewPassword = (token, password) => __awaiter(void 0, void 0, void 0, function* () {
    // Use the utility to decode the token
    const decoded = (0, jwtUtils_1.verifyToken)(token);
    const isUserExist = yield user_model_1.User.findOne({ email: decoded.email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User not Found");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.config.bcrypt_sault_round));
    const result = yield user_model_1.User.findOneAndUpdate({ email: decoded.email }, { password: hashedPassword }, { new: true } // Option to return the updated document
    );
    return result;
});
const updatePassword = (userData, oldPass, newPass) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({
        email: userData.email,
        _id: userData.id,
    });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User not Found");
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(oldPass, isUserExist.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password not matched! Please check your password");
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPass, Number(config_1.config.bcrypt_sault_round));
    const result = yield user_model_1.User.findOneAndUpdate({ email: userData.email }, { password: hashedPassword }, { new: true });
    return result;
});
const myDataFromDb = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // Use the utility to decode the token
    const data = yield customer_model_1.Customer.findOne({
        email: userData.email,
        user: userData.id,
    });
    return data;
});
const userProfileUpdate = (userData, dataInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({
        email: userData.email,
        _id: userData.id,
    });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User not Found");
    }
    const data = yield customer_model_1.Customer.findOneAndUpdate({
        email: userData.email,
        user: userData.id,
    }, dataInfo, { new: true });
    return data;
});
const blockUserProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({
        _id: id,
    });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User not Found");
    }
    if (isUserExist.isblocked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already blocked");
    }
    const data = yield user_model_1.User.findOneAndUpdate({
        _id: id,
    }, { isblocked: true }, { new: true });
    return data;
});
const deletUserProfileDelet = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({
        _id: id,
    });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User not Found");
    }
    if (isUserExist.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already deleted");
    }
    const data = yield user_model_1.User.findOneAndUpdate({
        _id: id,
    }, { isDeleted: true }, { new: true });
    return data;
});
exports.userService = {
    updatePassword,
    createCustomerIntoDb,
    createAdminIntoDb,
    setUserNewPassword,
    myDataFromDb,
    userProfileUpdate,
    deletUserProfileDelet,
    blockUserProfile,
};
