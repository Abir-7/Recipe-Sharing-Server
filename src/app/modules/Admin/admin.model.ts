import { model, Schema } from "mongoose";
import { IAdmin } from "./admin.interface";
import { adminGender } from "./admin.const";

// Define the IAdmin interface as a Mongoose schema
export const adminSchema = new Schema<IAdmin>({
  id: {
    type: String,
    required: [true, "ID is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User reference is required"],
  },
  userName: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  phone: {
    type: Number,
    required: [true, "Contact number is required."],
  },
  photo: {
    type: String,
    required: [true, "Photo is required."],
  },
  address: {
    type: String,
    required: [true, "Address is required."],
    trim: true,
  },
});

export const Admin = model<IAdmin>("Admin", adminSchema);
