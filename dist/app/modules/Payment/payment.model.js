"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const PaymentSchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Customer",
        required: [true, "Custom message: Customer is required"],
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid",
    },
    validateFor: { type: Date },
    tnxId: {
        type: String,
        required: [true, "Custom message: Transaction ID is required"],
    },
    amount: {
        type: Number,
        required: [true, "Custom message: Amount is required"],
    },
}, { timestamps: true });
exports.Payment = (0, mongoose_1.model)("Payment", PaymentSchema);
