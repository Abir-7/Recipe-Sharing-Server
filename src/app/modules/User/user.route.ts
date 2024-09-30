import { Router } from "express";
import { userController } from "./user.controller";

import { zodAdminSchema } from "../Admin/admin.zodValidation";
import validationMiddleware from "../../middleware/validationMiddleware";
import { zodCustomerSchema } from "../Customer/customer.zodValidation";

const router = Router();

router.post(
  "/signup",
  validationMiddleware(zodCustomerSchema),
  userController.createCustomer
);
router.post(
  "/create-admin",
  validationMiddleware(zodAdminSchema),
  userController.createAdmin
);

router.post("/update-pass", userController.updatePassword);

export const UserRouter = router;
