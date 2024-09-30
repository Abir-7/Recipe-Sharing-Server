import { z } from "zod";

export const zodCustomerSchema = z.object({
  body: z.object({
    password: z.string({ required_error: "Password is required." }),
    customer: z.object({
      userName: z.string({
        required_error: "Username is required.",
        invalid_type_error: "Username must be a string.",
      }),
      email: z
        .string({
          required_error: "Email is required.",
          invalid_type_error: "Email must be a string.",
        })
        .email("Invalid email format."),
      phone: z
        .number({
          invalid_type_error: "Contact number must be a number.",
        })
        .optional(), // Make phone optional
      address: z
        .string({
          invalid_type_error: "Address must be a string.",
        })
        .optional(), // Make address optional
      bio: z
        .string({
          invalid_type_error: "Address must be a string.",
        })
        .optional(), // Make bio optional
      photo: z.string().optional(), // Include photo if needed
    }),
  }),
});

export const zodCustomerUpdateSchema = z.object({
  body: z.object({
    userName: z
      .string({
        required_error: "Username is required.",
        invalid_type_error: "Username must be a string.",
      })
      .optional(),

    phone: z
      .number({
        invalid_type_error: "Contact number must be a number.",
      })
      .optional(), // Make phone optional
    address: z
      .string({
        invalid_type_error: "Address must be a string.",
      })
      .optional(), // Make address optional
    bio: z
      .string({
        invalid_type_error: "Address must be a string.",
      })
      .optional(), // Make bio optional
    photo: z.string().optional(), // Include photo if needed
  }),
});
