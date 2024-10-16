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
exports.recipeController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const recipe_service_1 = require("./recipe.service");
const updateRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.user;
    const { rId } = req.params;
    const recipeData = req.body;
    const result = yield recipe_service_1.recipeService.updateRecipeIntoDb(userData, recipeData, rId);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Recipe added successfully",
    });
}));
const addRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.user;
    const recipe = req.body;
    const result = yield recipe_service_1.recipeService.addRecipeIntoDb(userData, recipe);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Recipe added successfully",
    });
}));
const getMyRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.user;
    // Extract search, sort, and category from query parameters
    const { search = "", sort = "", category = "", currentPage, pageSize, } = req.query;
    console.log(req.query, "gg");
    const result = yield recipe_service_1.recipeService.getMyRecipeFromDb(userData, search, sort, category, currentPage, pageSize);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Recipe fetched successfully",
    });
}));
const getAllRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search = "", sort = "", category = "", page, limit, } = req.query;
    const result = yield recipe_service_1.recipeService.getAllRecipeFromDb(search, sort, category, page, limit);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Recipe fetched successfully",
    });
}));
const recipeDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("gg");
    const { id } = req.params;
    const authEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    console.log(authEmail, "gg");
    const result = yield recipe_service_1.recipeService.recipeDetailsFromDb(id, authEmail);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Recipe details fetched successfully",
    });
}));
const deleteRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { rId } = req.params;
    const authEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const result = yield recipe_service_1.recipeService.deleteRecipe(rId, authEmail);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Recipe deleted successfully",
    });
}));
const getAllAdminRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield recipe_service_1.recipeService.getAllRecipeAdminFromDb();
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Recipe fetched successfully",
    });
}));
const deleteAdminRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rId } = req.params;
    const result = yield recipe_service_1.recipeService.deleteAdminRecipe(rId);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Recipe deleted successfully",
    });
}));
const unpublishAdminRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rId } = req.params;
    const result = yield recipe_service_1.recipeService.unpublishAdminRecipe(rId);
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Recipe deleted successfully",
    });
}));
const getTopRecipe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield recipe_service_1.recipeService.getTopRecipesByLikes();
    (0, sendResponse_1.default)(res, {
        data: result,
        statusCode: 200,
        success: true,
        message: "Top Recipe fetched successfully",
    });
}));
exports.recipeController = {
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
