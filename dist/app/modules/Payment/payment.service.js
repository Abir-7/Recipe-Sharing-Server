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
exports.paymentService = void 0;
const payment_utils_1 = require("./payment.utils");
const customer_model_1 = require("../Customer/customer.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const payment_model_1 = require("./payment.model");
const createPaymentIntoDB = (price, userData) => __awaiter(void 0, void 0, void 0, function* () {
    // Find customer by email
    const customerData = yield customer_model_1.Customer.findOne({ email: userData.email });
    if (!customerData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User not found");
    }
    // Find the most recent payment for this customer
    const lastPayment = yield payment_model_1.Payment.findOne({
        customer: customerData._id,
    }).sort({ createdAt: -1 });
    // If there is a last payment, check if the validateFor date has passed
    if (lastPayment && lastPayment.validateFor) {
        const currentDate = new Date();
        const validateForDate = new Date(lastPayment.validateFor);
        // Prevent user from making payment if the validateFor date has not passed
        if (currentDate < validateForDate) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, `You cannot make a payment until ${validateForDate.toLocaleString()}`);
        }
    }
    // Generate transaction ID
    const txn = `TXN-${Date.now()}${userData.email}`;
    // Create a new payment record
    const result = yield payment_model_1.Payment.create({
        amount: price.price,
        customer: customerData._id,
        tnxId: txn,
        paymentStatus: "unpaid",
    });
    // Initiate payment and get payment link
    const paymentInfo = yield (0, payment_utils_1.initiatePayment)({
        price: result.amount,
        txn,
        customerData,
        orderId: result._id,
    });
    // Return the result and payment link
    return Object.assign(Object.assign({}, result.toObject()), { payLink: paymentInfo.data.payment_url });
});
exports.paymentService = {
    createPaymentIntoDB,
};
