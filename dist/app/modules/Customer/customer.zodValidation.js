"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodCustomerUpdateSchema = exports.zodCustomerSchema = void 0;
const zod_1 = require("zod");
exports.zodCustomerSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({ required_error: "Password is required." }),
        customer: zod_1.z.object({
            userName: zod_1.z.string({
                required_error: "Username is required.",
                invalid_type_error: "Username must be a string.",
            }),
            email: zod_1.z
                .string({
                required_error: "Email is required.",
                invalid_type_error: "Email must be a string.",
            })
                .email("Invalid email format."),
            phone: zod_1.z
                .number({
                invalid_type_error: "Contact number must be a number.",
            })
                .optional(), // Make phone optional
            address: zod_1.z
                .string({
                invalid_type_error: "Address must be a string.",
            })
                .optional(), // Make address optional
            bio: zod_1.z
                .string({
                invalid_type_error: "Address must be a string.",
            })
                .optional(), // Make bio optional
            photo: zod_1.z.string().optional(), // Include photo if needed
        }),
    }),
});
exports.zodCustomerUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        userName: zod_1.z
            .string({
            required_error: "Username is required.",
            invalid_type_error: "Username must be a string.",
        })
            .optional(),
        phone: zod_1.z
            .number({
            invalid_type_error: "Contact number must be a number.",
        })
            .optional(), // Make phone optional
        address: zod_1.z
            .string({
            invalid_type_error: "Address must be a string.",
        })
            .optional(), // Make address optional
        bio: zod_1.z
            .string({
            invalid_type_error: "Address must be a string.",
        })
            .optional(), // Make bio optional
        photo: zod_1.z.string().optional(), // Include photo if needed
    }),
});
