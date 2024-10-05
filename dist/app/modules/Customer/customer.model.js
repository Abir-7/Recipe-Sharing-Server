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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = exports.customerSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.customerSchema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: [true, "Username is required."],
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        lowercase: true,
    },
    phone: {
        type: Number,
        required: false, // Optional field
    },
    address: {
        type: String,
        required: false, // Optional field
        trim: true,
    },
    bio: {
        type: String,
        required: false, // Optional field
        trim: true,
    },
    photo: {
        type: String,
        default: "https://img.freepik.com/free-vector/hand-drawn-side-profile-cartoon-illustration_23-2150503804.jpg?t=st=1724927284~exp=1724930884~hmac=a42764fe18cff7567042535bfb6aec564591400f29408485d5cc8eed46b42d9a&w=740",
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User reference is required."],
    },
    followers: [
        { type: mongoose_1.default.Schema.Types.ObjectId, default: [], ref: "Customer" },
    ],
    following: [
        { type: mongoose_1.default.Schema.Types.ObjectId, default: [], ref: "Customer" },
    ],
});
exports.customerSchema.virtual("followerCount").get(function () {
    return this.followers.length;
});
exports.customerSchema.virtual("followingCount").get(function () {
    return this.following.length;
});
exports.customerSchema.statics.isCustomerExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        const iscustomerExist = yield exports.Customer.findOne({ email });
        return iscustomerExist;
    });
};
exports.Customer = (0, mongoose_1.model)("Customer", exports.customerSchema);
