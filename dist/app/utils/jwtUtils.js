"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const AppError_1 = __importDefault(require("../errors/AppError"));
// Assuming you have a custom error class
// Utility function to verify JWT
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt_secrete_key);
        return decoded;
    }
    catch (error) {
        // Handle JWT-specific errors
        throw new AppError_1.default(401, "Invalid or expired token");
    }
};
exports.verifyToken = verifyToken;
