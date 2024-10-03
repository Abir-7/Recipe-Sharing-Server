import { Types } from "mongoose";

export interface IPayment {
  customer: Types.ObjectId;
  paymentStatus: "paid" | "unpaid";
  validateFor?: Date;
  tnxId: string;
  amount: number;
}
