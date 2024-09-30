import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import validationMiddleware from "../../middleware/validationMiddleware";

const router = Router();

router.post(
  "/login",
  validationMiddleware(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);
router.post(
  "/reset",
  validationMiddleware(AuthValidation.resetPassValidationSchema),
  AuthController.resetPassLink
);

export const AuthRouter = router;
