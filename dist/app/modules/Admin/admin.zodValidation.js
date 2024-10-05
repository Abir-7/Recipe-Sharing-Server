"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodAdminSchema = void 0;
const zod_1 = require("zod");
// Define the IAdmin schema using Zod
exports.zodAdminSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
        }),
        admin: zod_1.z.object({
            userName: zod_1.z.string({
                required_error: "Name is required",
                invalid_type_error: "Name must be a string",
            }),
            email: zod_1.z
                .string({
                required_error: "Email is required",
                invalid_type_error: "Email must be a string",
            })
                .email("Please provide a valid email address"),
            phone: zod_1.z.string({
                required_error: "Contact number is required",
                invalid_type_error: "Contact number must be a string",
            }),
            address: zod_1.z.string({
                required_error: "Address is required",
                invalid_type_error: "Address must be a string",
            }),
            photo: zod_1.z.string({
                required_error: "Photo is required",
                invalid_type_error: "Photo must be a string",
            }),
        }),
    }),
});
