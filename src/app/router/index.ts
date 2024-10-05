import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route";
import { UserRouter } from "../modules/User/user.route";
import { CustomerRoute } from "../modules/Customer/customer.route";
import { RecipeRouter } from "../modules/Recipe/reciepe.route";
import { RatingRouter } from "../modules/Rating/rating.route";
import { AdminRouter } from "../modules/Admin/admin.route";
import { PaymentRouter } from "../modules/Payment/payment.route";
import { ContactRouter } from "../modules/ContactUs/contactus.route";

const router = Router();

const moduleRoutes = [
  { path: "/user", route: UserRouter },
  { path: "/auth", route: AuthRouter },
  { path: "/customer", route: CustomerRoute },
  { path: "/admin", route: AdminRouter },
  { path: "/recipe", route: RecipeRouter },
  { path: "/rating", route: RatingRouter },
  { path: "/payment", route: PaymentRouter },
  { path: "/contact", route: ContactRouter },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
