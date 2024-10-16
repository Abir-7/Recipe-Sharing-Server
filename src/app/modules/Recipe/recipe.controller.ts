import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { recipeService } from "./recipe.service";

const updateRecipe = catchAsync(async (req, res) => {
  const userData = req.user;
  const { rId } = req.params;
  const recipeData = req.body;

  const result = await recipeService.updateRecipeIntoDb(
    userData,
    recipeData,
    rId
  );

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Recipe added successfully",
  });
});

const addRecipe = catchAsync(async (req, res) => {
  const userData = req.user;
  const recipe = req.body;

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
  // Extract search, sort, and category from query parameters
  const {
    search = "",
    sort = "",
    category = "",
    currentPage,
    pageSize,
  } = req.query as {
    search?: string;
    sort?: string;
    category?: string;
    currentPage?: number;
    pageSize?: number;
  };
  console.log(req.query, "gg");
  const result = await recipeService.getMyRecipeFromDb(
    userData,
    search,
    sort,
    category,
    currentPage as number,
    pageSize as number
  );
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Recipe fetched successfully",
  });
});
const getAllRecipe = catchAsync(async (req, res) => {
  const {
    search = "",
    sort = "",
    category = "",
    page,
    limit,
  } = req.query as {
    search?: string;
    sort?: string;
    category?: string;
    page: string;
    limit: string;
  };
  const result = await recipeService.getAllRecipeFromDb(
    search,
    sort,
    category,
    page,
    limit
  );
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Recipe fetched successfully",
  });
});
const recipeDetails = catchAsync(async (req, res) => {
  console.log("gg");
  const { id } = req.params;
  const authEmail = req.user?.email;
  console.log(authEmail, "gg");
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

const getTopRecipe = catchAsync(async (req, res) => {
  const result = await recipeService.getTopRecipesByLikes();
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Top Recipe fetched successfully",
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
  getTopRecipe,
  updateRecipe,
};
