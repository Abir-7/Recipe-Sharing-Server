import { Router } from "express";
import { userController } from "./user.controller";

import { zodAdminSchema } from "../Admin/admin.zodValidation";
import validationMiddleware from "../../middleware/validationMiddleware";
import {
  zodCustomerSchema,
  zodCustomerUpdateSchema,
} from "../Customer/customer.zodValidation";
import { auth } from "../../middleware/auth/auth";

const router = Router();

router.get("/me", auth("user"), userController.meData);

router.post(
  "/signup",
  validationMiddleware(zodCustomerSchema),
  userController.createCustomer
);

router.post(
  "/create-admin",
  auth("admin", "superAdmin"),
  validationMiddleware(zodAdminSchema),
  userController.createAdmin
);
router.patch(
  "/upate-profile",
  validationMiddleware(zodCustomerUpdateSchema),
  auth("user"),
  userController.updateProfile
);

router.patch("/set-pass", userController.setNewPassword);
router.patch("/update-pass", auth("user"), userController.passwordUpdate);

router.patch(
  "/block-user/:id",
  auth("admin", "superAdmin"),
  userController.blockProfile
);

router.patch(
  "/delete-user/:id",
  auth("admin", "superAdmin"),
  userController.deleteProfile
);

export const UserRouter = router;
