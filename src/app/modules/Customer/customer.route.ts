import { Router } from "express";

import { customerController } from "./customer.controller";
import { auth } from "../../middleware/auth/auth";

const router = Router();

router.get(
  "/all-customer",
  auth("admin", "superAdmin"),
  customerController.getAllCustomerInfo
);

export const CustomerRoute = router;
