import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route";
import { UserRouter } from "../modules/User/user.route";
import { CustomerRoute } from "../modules/Customer/customer.route";
import { RecipeRouter } from "../modules/Recipe/reciepe.route";
import { RatingRouter } from "../modules/Rating/rating.route";
import { AdminRouter } from "../modules/Admin/admin.route";

const router = Router();

const moduleRoutes = [
  { path: "/user", route: UserRouter },
  { path: "/auth", route: AuthRouter },
  { path: "/customer", route: CustomerRoute },
  { path: "/admin", route: AdminRouter },
  { path: "/recipe", route: RecipeRouter },
  { path: "/rating", route: RatingRouter },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
