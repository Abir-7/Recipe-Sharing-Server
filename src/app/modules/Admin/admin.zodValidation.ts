import { z } from "zod";
import { adminGender } from "./admin.const";

// Define the IAdmin schema using Zod
export const zodAdminSchema = z.object({
  body: z.object({
    password: z.string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    }),
    admin: z.object({
      userName: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      }),
      email: z
        .string({
          required_error: "Email is required",
          invalid_type_error: "Email must be a string",
        })
        .email("Please provide a valid email address"),
      phone: z.string({
        required_error: "Contact number is required",
        invalid_type_error: "Contact number must be a string",
      }),
      address: z.string({
        required_error: "Address is required",
        invalid_type_error: "Address must be a string",
      }),
      photo: z.string({
        required_error: "Photo is required",
        invalid_type_error: "Photo must be a string",
      }),
    }),
  }),
});
