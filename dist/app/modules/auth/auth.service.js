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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_utils_1 = require("./auth.utils");
const config_1 = require("../../config");
const user_model_1 = require("../User/user.model");
const customer_model_1 = require("../Customer/customer.model");
const nodeMailer_1 = require("../../utils/nodeMailer");
const payment_model_1 = require("../Payment/payment.model");
const userLogin = (logInData) => __awaiter(void 0, void 0, void 0, function* () {
    //check if user exist
    const user = yield user_model_1.User.findOne({ email: logInData.email }).select(["-__v"]);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User not found! Please Check your email.");
    }
    //check password is matched or not
    const isPasswordMatch = yield bcrypt_1.default.compare(logInData.password, user.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password not matched! Please check your password");
    }
    let photo = "";
    const customer = yield customer_model_1.Customer.findOne({ user: user._id });
    if (customer && customer.photo) {
        photo = customer.photo;
    }
    if (!customer && user.role !== "superAdmin") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "customer not found! Please Check your email.");
    }
    //check customer has any valid subcription  from payment data
    let hasValidSubscription = false;
    if (customer) {
        const payment = yield payment_model_1.Payment.findOne({
            customer: customer._id,
            paymentStatus: "paid",
        }).sort({ createdAt: -1 });
        if (payment && payment.validateFor) {
            const currentDate = new Date();
            if (new Date(payment.validateFor) > currentDate) {
                hasValidSubscription = true;
            }
        }
    }
    // Creating user data to include in token
    const userJWtData = {
        photo: photo,
        email: user.email,
        role: user.role,
        id: user._id,
        hasValidSubscription: hasValidSubscription || false,
    };
    // create token
    const accessToken = (0, auth_utils_1.createToken)(userJWtData, config_1.config.jwt_secrete_key, "40d");
    return {
        accessToken: accessToken,
        user: {
            _id: user._id,
            email: user.email,
            role: user.role,
        },
    };
});
const userResetPassLinkGenarator = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield user_model_1.User.findOne({ email: userEmail });
    if (!findUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User not found");
    }
    const accessToken = (0, auth_utils_1.createToken)({
        email: userEmail,
        role: "",
    }, config_1.config.jwt_secrete_key, "5m");
    // { to, subject, text, html }
    (0, nodeMailer_1.sendMail)({
        to: userEmail,
        subject: "Reset pass link",
        text: "Change your pass within 5min",
        html: `<a href="https://recipe-sharing-client.vercel.app/reset-password?email=${userEmail}&token=${accessToken}">Reset Link</a>
  <p>Change your pass within 5min</p>`,
    });
    return accessToken;
});
exports.AuthService = {
    userLogin,
    userResetPassLinkGenarator,
};
