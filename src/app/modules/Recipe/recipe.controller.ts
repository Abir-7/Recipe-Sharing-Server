import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { recipeService } from "./recipe.service";

const addRecipe = catchAsync(async (req, res) => {
  const userData = req.user;
  const recipe = req.body.recipe;

  const result = await recipeService.addRecipeIntoDb(userData, recipe);

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Recipe added successfully",
  });
});

const getMyRecipe = catchAsync(async (req, res) => {
  const userData = req.user;

  const result = await recipeService.getMyRecipeFromDb(userData);
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Recipe fetched successfully",
  });
});
const getAllRecipe = catchAsync(async (req, res) => {
  const result = await recipeService.getAllRecipeFromDb();
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Recipe fetched successfully",
  });
});
const recipeDetails = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await recipeService.recipeDetailsFromDb(id);
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Recipe details fetched successfully",
  });
});
export const recipeController = {
  addRecipe,
  getMyRecipe,
  getAllRecipe,
  recipeDetails,
};
