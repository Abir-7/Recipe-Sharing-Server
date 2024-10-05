"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const user_const_1 = require("./user.const");
const config_1 = require("../../config");
exports.userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "User email is required"],
        unique: true,
    },
    isDeleted: { type: Boolean, default: false },
    isblocked: { type: Boolean, default: false },
    password: { type: String, required: [true, "User password is required"] },
    role: {
        type: String,
        enum: user_const_1.userRole,
        required: [true, "User role is required"],
        default: "user",
    },
});
exports.userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const isUserExist = yield exports.User.findOne({ email: this.email });
        if (isUserExist) {
            throw new AppError_1.default(http_status_1.default.CONFLICT, "User already exist");
        }
        this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.config.bcrypt_sault_round));
        next();
    });
});
exports.userSchema.post("save", function (data) {
    return __awaiter(this, void 0, void 0, function* () {
        data.password = "**********************";
    });
});
exports.User = (0, mongoose_1.model)("User", exports.userSchema);
