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
exports.ratingService = void 0;
const rating_model_1 = require("./rating.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const customer_model_1 = require("../Customer/customer.model");
const ratingOperationIntoDb = (userData, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { recipeId, rating, comment, isLiked, isDisliked, oldComment, newComment, } = data;
    if (!rating &&
        !comment &&
        !isLiked &&
        !isDisliked &&
        !oldComment &&
        !newComment) {
        throw new Error("No Review is given");
    }
    if (!recipeId) {
        throw new Error("Recipe ID is required.");
    }
    const customerData = yield customer_model_1.Customer.findOne({ user: userData.id });
    if (!customerData) {
        throw new Error("Customer ID is required.");
    }
    const customerId = customerData._id;
    // Check if the user already rated this recipe
    const existingRating = yield rating_model_1.Rating.findOne({
        recipeId: recipeId,
        customerId: customerId,
    });
    if (existingRating) {
        // Update the existing rating
        existingRating.rating = rating !== null && rating !== void 0 ? rating : existingRating.rating;
        if (oldComment || newComment) {
            if (newComment === "true") {
                yield rating_model_1.Rating.updateOne({ recipeId: recipeId, customerId: customerId }, // The document to find
                { $pull: { comment: oldComment } } // Removes the specified comment
                );
            }
            else {
                const commentIndex = existingRating.comment.findIndex((comment) => comment === oldComment);
                if (commentIndex !== -1) {
                    // Update the old comment with the new one
                    existingRating.comment[commentIndex] = newComment;
                }
                else {
                    throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Comment not found");
                }
            }
        }
        if (comment) {
            existingRating.comment.push(comment);
        }
        // Handle isLiked and isDisliked toggling
        if (isLiked !== undefined) {
            existingRating.isLiked = isLiked;
            existingRating.isDisliked = !isLiked; // Ensure mutual exclusivity
        }
        if (isDisliked !== undefined) {
            existingRating.isDisliked = isDisliked;
            existingRating.isLiked = !isDisliked; // Ensure mutual exclusivity
        }
        yield existingRating.save();
        return existingRating;
    }
    else {
        // Create a new rating
        const newRating = yield rating_model_1.Rating.create({
            recipeId,
            customerId,
            rating: rating !== null && rating !== void 0 ? rating : 0, // Set default rating to 0 if not provided
            comment: comment !== null && comment !== void 0 ? comment : "",
            isLiked: isLiked !== null && isLiked !== void 0 ? isLiked : false,
            isDisliked: isDisliked !== null && isDisliked !== void 0 ? isDisliked : false,
        });
        return newRating;
    }
});
exports.ratingService = {
    ratingOperationIntoDb,
};
