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
  const authEmail = req.user?.email;
  const result = await recipeService.recipeDetailsFromDb(id, authEmail);
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Recipe details fetched successfully",
  });
});

const deleteRecipe = catchAsync(async (req, res) => {
  const { rId } = req.params;
  const authEmail = req.user?.email;
  const result = await recipeService.deleteRecipe(rId, authEmail);
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Recipe deleted successfully",
  });
});

const getAllAdminRecipe = catchAsync(async (req, res) => {
  const result = await recipeService.getAllRecipeAdminFromDb();
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Recipe fetched successfully",
  });
});

const deleteAdminRecipe = catchAsync(async (req, res) => {
  const { rId } = req.params;
  const result = await recipeService.deleteAdminRecipe(rId);
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Recipe deleted successfully",
  });
});
const unpublishAdminRecipe = catchAsync(async (req, res) => {
  const { rId } = req.params;
  const result = await recipeService.unpublishAdminRecipe(rId);
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Recipe deleted successfully",
  });
});

export const recipeController = {
  deleteAdminRecipe,
  addRecipe,
  getMyRecipe,
  getAllRecipe,
  recipeDetails,
  deleteRecipe,
  getAllAdminRecipe,
  unpublishAdminRecipe,
};
