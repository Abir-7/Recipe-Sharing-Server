import { Router } from "express";

import { customerController } from "./customer.controller";
import { auth } from "../../middleware/auth/auth";

const router = Router();
router.get("/top-follower", customerController.userWithTopFollower);
router.get(
  "/all-customer",
  auth("admin", "superAdmin"),
  customerController.getAllCustomerInfo
);
router.get("/dashboard", auth("user"), customerController.userDashboard);
router.patch("/follow-user", auth("user"), customerController.followUser);
router.patch("/unfollow-user", auth("user"), customerController.unfollowUser);

export const CustomerRoute = router;
