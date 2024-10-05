"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactValidation = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const zod_1 = require("zod");
// Mongoose Schema and Model
const contactSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const Contact = mongoose_1.default.model("Contact", contactSchema);
// Zod validation schema
exports.contactValidation = zod_1.z.object({
    name: zod_1.z
        .string()
        .nonempty("Name is required")
        .min(2, "Name must be at least 2 characters long"),
    email: zod_1.z.string().email("Invalid email format"),
    message: zod_1.z.string().nonempty("Message is required"),
});
exports.default = Contact;
