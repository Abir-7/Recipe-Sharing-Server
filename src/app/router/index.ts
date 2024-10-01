import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route";
import { UserRouter } from "../modules/User/user.route";
import { CustomerRoute } from "../modules/Customer/customer.route";

const router = Router();

const moduleRoutes = [
  { path: "/user", route: UserRouter },
  { path: "/auth", route: AuthRouter },
  { path: "/customer", route: CustomerRoute },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
