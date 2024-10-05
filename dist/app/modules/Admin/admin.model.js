"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = exports.adminSchema = void 0;
const mongoose_1 = require("mongoose");
// Define the IAdmin interface as a Mongoose schema
exports.adminSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: [true, "ID is required"],
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User reference is required"],
    },
    userName: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    phone: {
        type: Number,
        required: [true, "Contact number is required."],
    },
    photo: {
        type: String,
        required: [true, "Photo is required."],
    },
    address: {
        type: String,
        required: [true, "Address is required."],
        trim: true,
    },
});
exports.Admin = (0, mongoose_1.model)("Admin", exports.adminSchema);
