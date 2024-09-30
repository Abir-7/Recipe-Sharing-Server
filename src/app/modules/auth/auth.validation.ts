import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required." })
      .email("This is not a valid email"),
    password: z.string({ required_error: "Password is required" }),
  }),
});
const resetPassValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required." })
      .email("This is not a valid email"),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  resetPassValidationSchema,
};
