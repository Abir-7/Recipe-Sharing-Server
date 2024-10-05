"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recipe = void 0;
const mongoose_1 = require("mongoose");
const recipeSchema = new mongoose_1.Schema({
    recipe: {
        type: String,
        required: [true, "Recipe name is required"], // Custom error message
    },
    photo: {
        type: String,
        required: [true, "Recipe photo is required"], // Custom error message
    },
    category: {
        type: String,
        required: [true, "Recipe category is required"], // Custom error message
    },
    title: {
        type: String,
        required: [true, "Recipe Title is required"], // Custom error message
    },
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Customer name is required"],
        ref: "Customer", // Custom error message
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.Recipe = (0, mongoose_1.model)("Recipe", recipeSchema);
