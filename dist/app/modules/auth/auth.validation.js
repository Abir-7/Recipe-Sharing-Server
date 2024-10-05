"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: "Email is required." })
            .email("This is not a valid email"),
        password: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
const resetPassValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: "Email is required." })
            .email("This is not a valid email"),
    }),
});
exports.AuthValidation = {
    loginValidationSchema,
    resetPassValidationSchema,
};
