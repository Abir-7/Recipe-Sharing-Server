import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

// Interface for the form data
export interface IFormData extends Document {
  name: string;
  email: string;
  message: string;
}

// Mongoose Schema and Model
const contactSchema: Schema = new Schema<IFormData>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model<IFormData>("Contact", contactSchema);

// Zod validation schema
export const contactValidation = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email format"),
  message: z.string().nonempty("Message is required"),
});

export default Contact;
