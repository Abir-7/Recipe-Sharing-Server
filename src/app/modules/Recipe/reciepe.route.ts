import { Router } from "express";
import { recipeController } from "./recipe.controller";
import { auth } from "../../middleware/auth/auth";

const router = Router();
router.get("/", recipeController.getAllRecipe);
router.get(
  "/admin-all-recipe",
  auth("superAdmin", "admin"),
  recipeController.getAllAdminRecipe
);

router.post("/add-recipe", auth("user"), recipeController.addRecipe);

router.get("/top-recipe", recipeController.getTopRecipe);

router.get("/my-recipe", auth("user"), recipeController.getMyRecipe);
router.get(
  "/:id",
  auth("user", "superAdmin", "admin"),
  recipeController.recipeDetails
);

router.patch(
  "/my-recipe-delete/:rId",
  auth("user"),
  recipeController.deleteRecipe
);
router.patch("/recipe/:rId", auth("user"), recipeController.updateRecipe);
router.patch(
  "/admin-recipe-delete/:rId",
  auth("superAdmin", "admin"),
  recipeController.deleteAdminRecipe
);
router.patch(
  "/admin-recipe-publish/:rId",
  auth("superAdmin", "admin"),
  recipeController.unpublishAdminRecipe
);

export const RecipeRouter = router;
