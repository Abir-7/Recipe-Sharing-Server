import { Router } from "express";
import { recipeController } from "./recipe.controller";
import { auth } from "../../middleware/auth/auth";

const router = Router();
router.get("/", recipeController.getAllRecipe);
router.get("/:id", recipeController.recipeDetails);
router.post("/add-recipe", auth("user"), recipeController.addRecipe);

router.get("/my-recipe", auth("user"), recipeController.getMyRecipe);
export const RecipeRouter = router;
