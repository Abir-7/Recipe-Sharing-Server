import { model, Schema } from "mongoose";
import { IPayment } from "./payment.interface";

const PaymentSchema = new Schema<IPayment>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Custom message: Customer is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    validateFor: { type: Date },
    tnxId: {
      type: String,
      required: [true, "Custom message: Transaction ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Custom message: Amount is required"],
    },
  },
  { timestamps: true }
);
export const Payment = model<IPayment>("Payment", PaymentSchema);
