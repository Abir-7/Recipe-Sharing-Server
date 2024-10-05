"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rating = void 0;
const mongoose_1 = require("mongoose");
const RatingSchema = new mongoose_1.Schema({
    recipeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Recipe ID is required"],
        ref: "Recipe",
    },
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Customer ID is required"],
        ref: "Customer",
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        default: 0,
    },
    comment: {
        type: [String],
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
});
exports.Rating = (0, mongoose_1.model)("Rating", RatingSchema);
