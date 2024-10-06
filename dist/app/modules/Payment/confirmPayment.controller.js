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
exports.paymentConfirm = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const payment_model_1 = require("./payment.model");
exports.paymentConfirm = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const orderData = yield payment_model_1.Payment.findById(id).populate({
        path: "customer",
        select: "userName email",
    });
    const currentDate = new Date();
    const nextTwoMonths = new Date(currentDate.setMonth(currentDate.getMonth() + 2));
    if (!orderData) {
        res.status(404).send("<h1>Booking not found</h1>");
    }
    else {
        if (orderData) {
            orderData.paymentStatus = "paid";
            orderData.validateFor = nextTwoMonths;
            orderData.save();
        }
        // Extract user details
        const userName = orderData.customer.userName;
        const userEmail = orderData.customer.email;
        const ammout = orderData.amount;
        const validateFor = nextTwoMonths.toDateString(); // Format date
        // HTML response
        res.status(200).send(`<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      width: 100%;
                      max-width: 600px;
                      margin: 20px auto;
                      background-color: #ffffff;
                      padding: 20px;
                      border-radius: 8px;
                      box-shadow: 0 0 10px rgba(0,0,0,0.1);
                  }
                  .header {
                      background-color: rgb(3 7 18);
                      color: #ffffff;
                      padding: 10px;
                      text-align: center;
                      border-radius: 8px 8px 0 0;
                  }
                  .content {
                      padding: 20px;
                  }
                  .content p {
                      font-size: 16px;
                      color: #333333;
                  }
                  .footer {
                      background-color: rgb(3 7 18);
                      color: #ffffff;
                      padding: 10px;
                      text-align: center;
                      border-radius: 0 0 8px 8px;
                      font-size: 14px;
                  }
                  .highlight {
                      font-weight: bold;
                      color: #007BFF;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>Order Confirmation</h1>
                  </div>
                  <div class="content">
                      <p>Dear <strong>${userName}</strong>,</p>
                      <p>Your order has been <span class="highlight">confirmed</span> with the following details:</p>
                      <p><strong>User Email:</strong> ${userEmail}</p>
                      <p><strong>Amount:</strong> ${ammout} tk</p>
                      <p><strong>Valid Until:</strong> ${validateFor}</p>
                      <p  style={{ color: 'red' }} >You have to login again to activate your subscription!</p>
                  </div>
                  <div class="footer">
                      &copy; 2024 Food-Corner. All rights reserved. <a style="color: white; font-weight: bold;" href='https://recipe-sharing-client.vercel.app'>Home</a>
                  </div>
              </div>
          </body>
          </html>`);
    }
}));
