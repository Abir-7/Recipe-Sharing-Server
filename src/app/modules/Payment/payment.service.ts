import { JwtPayload } from "jsonwebtoken";
import { initiatePayment } from "./payment.utils";
import { Customer } from "../Customer/customer.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Payment } from "./payment.model";

const createPaymentIntoDB = async (
  price: { price: string },
  userData: JwtPayload
) => {
  // Find customer by email
  const customerData = await Customer.findOne({ email: userData.email });

  if (!customerData) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }

  // Find the most recent payment for this customer
  const lastPayment = await Payment.findOne({
    customer: customerData._id,
  }).sort({ createdAt: -1 });

  // If there is a last payment, check if the validateFor date has passed
  if (lastPayment && lastPayment.validateFor) {
    const currentDate = new Date();
    const validateForDate = new Date(lastPayment.validateFor);

    // Prevent user from making payment if the validateFor date has not passed
    if (currentDate < validateForDate) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        `You cannot make a payment until ${validateForDate.toLocaleString()}`
      );
    }
  }

  // Generate transaction ID
  const txn = `TXN-${Date.now()}${userData.email}`;

  // Create a new payment record
  const result = await Payment.create({
    amount: price.price,
    customer: customerData._id,
    tnxId: txn,
    paymentStatus: "unpaid",
  });

  // Initiate payment and get payment link
  const paymentInfo = await initiatePayment({
    price: result.amount,
    txn,
    customerData,
    orderId: result._id,
  });

  // Return the result and payment link
  return { ...result.toObject(), payLink: paymentInfo.data.payment_url };
};
export const paymentService = {
  createPaymentIntoDB,
};
