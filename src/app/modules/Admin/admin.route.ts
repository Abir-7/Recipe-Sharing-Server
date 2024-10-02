import { Router } from "express";
import { auth } from "../../middleware/auth/auth";
import { adminController } from "./admin.controller";

const router = Router();
router.get(
  "/all-admin",
  auth("admin", "superAdmin"),
  adminController.getAllAdminInfo
);
router.patch(
  "/update-admin/:id",
  auth("superAdmin"),
  adminController.updateAdminProfile
);
export const AdminRouter = router;
