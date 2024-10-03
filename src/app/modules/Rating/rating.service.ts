import { Rating } from "./rating.model";
import { JwtPayload } from "jsonwebtoken";
import { IRating } from "./rating.interface";
import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Customer } from "../Customer/customer.model";

const ratingOperationIntoDb = async (
  userData: JwtPayload,
  data: {
    recipeId: string;
    rating: number;
    comment: string;
    isLiked: boolean;
    isDisliked: boolean;
    oldComment: string;
    newComment: string;
  }
) => {
  const {
    recipeId,
    rating,
    comment,
    isLiked,
    isDisliked,
    oldComment,
    newComment,
  } = data;

  if (
    !rating &&
    !comment &&
    !isLiked &&
    !isDisliked &&
    !oldComment &&
    !newComment
  ) {
    throw new Error("No Review is given");
  }

  if (!recipeId) {
    throw new Error("Recipe ID is required.");
  }
  const customerData = await Customer.findOne({ user: userData.id });
  if (!customerData) {
    throw new Error("Customer ID is required.");
  }
  const customerId = customerData._id;

  // Check if the user already rated this recipe
  const existingRating = await Rating.findOne({
    recipeId: recipeId,
    customerId: customerId,
  });

  if (existingRating) {
    // Update the existing rating

    existingRating.rating = rating ?? existingRating.rating;

    if (oldComment || newComment) {
      if (newComment === "true") {
        await Rating.updateOne(
          { recipeId: recipeId, customerId: customerId }, // The document to find
          { $pull: { comment: oldComment } } // Removes the specified comment
        );
      } else {
        const commentIndex = existingRating.comment.findIndex(
          (comment) => comment === oldComment
        );

        if (commentIndex !== -1) {
          // Update the old comment with the new one
          existingRating.comment[commentIndex] = newComment;
        } else {
          throw new AppError(httpStatus.BAD_REQUEST, "Comment not found");
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

    await existingRating.save();
    return existingRating;
  } else {
    // Create a new rating
    const newRating = await Rating.create({
      recipeId,
      customerId,
      rating: rating ?? 0, // Set default rating to 0 if not provided
      comment: comment ?? "",
      isLiked: isLiked ?? false,
      isDisliked: isDisliked ?? false,
    });

    return newRating;
  }
};

export const ratingService = {
  ratingOperationIntoDb,
};
