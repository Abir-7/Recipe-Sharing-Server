import { Router } from "express";
import { recipeController } from "./recipe.controller";
import { auth } from "../../middleware/auth/auth";

const router = Router();
router.get("/", recipeController.getAllRecipe);

router.post("/add-recipe", auth("user"), recipeController.addRecipe);

router.get("/my-recipe", auth("user"), recipeController.getMyRecipe);
router.get("/:id", auth("user"), recipeController.recipeDetails);

router.patch(
  "/my-recipe-delete/:rId",
  auth("user"),
  recipeController.deleteRecipe
);

export const RecipeRouter = router;
