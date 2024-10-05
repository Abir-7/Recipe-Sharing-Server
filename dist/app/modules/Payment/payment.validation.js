"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodPaymentSchema = void 0;
const zod_1 = require("zod");
exports.zodPaymentSchema = zod_1.z.object({
    amount: zod_1.z
        .number()
        .nonnegative(" Amount must be a positive number")
        .refine((val) => val > 0, {
        message: " Amount is required",
    }),
});
