import { Router } from "express";
import { ratingController } from "./rating.controller";
import { auth } from "../../middleware/auth/auth";

const router = Router();

router.post("/add-rating", auth("user"), ratingController.ratingOperation);

export const RatingRouter = router;
