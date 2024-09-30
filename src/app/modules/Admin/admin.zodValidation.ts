import { z } from "zod";
import { adminGender } from "./admin.const";

// Define the IUserName schema using Zod
const UserNameSchema = z.object({
  firstName: z.string({
    required_error: "First name is required",
    invalid_type_error: "First name must be a string",
  }),
  middleName: z
    .string({ invalid_type_error: "Middle name must be a string" })
    .optional(),
  lastName: z.string({
    required_error: "Last name is required",
    invalid_type_error: "Last name must be a string",
  }),
});

// Define the IAdmin schema using Zod
export const zodAdminSchema = z.object({
  body: z.object({
    password: z.string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    }),
    admin: z.object({
      name: UserNameSchema,
      email: z
        .string({
          required_error: "Email is required",
          invalid_type_error: "Email must be a string",
        })
        .email("Please provide a valid email address"),
      gender: z.enum(adminGender, {
        required_error: "Gender is required",
        invalid_type_error: "Gender must be one of Male, Female, Other",
      }),
      phone: z.string({
        required_error: "Contact number is required",
        invalid_type_error: "Contact number must be a string",
      }),
      address: z.string({
        required_error: "Address is required",
        invalid_type_error: "Address must be a string",
      }),
    }),
  }),
});
