"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/User/user.route");
const customer_route_1 = require("../modules/Customer/customer.route");
const reciepe_route_1 = require("../modules/Recipe/reciepe.route");
const rating_route_1 = require("../modules/Rating/rating.route");
const admin_route_1 = require("../modules/Admin/admin.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const contactus_route_1 = require("../modules/ContactUs/contactus.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    { path: "/user", route: user_route_1.UserRouter },
    { path: "/auth", route: auth_route_1.AuthRouter },
    { path: "/customer", route: customer_route_1.CustomerRoute },
    { path: "/admin", route: admin_route_1.AdminRouter },
    { path: "/recipe", route: reciepe_route_1.RecipeRouter },
    { path: "/rating", route: rating_route_1.RatingRouter },
    { path: "/payment", route: payment_route_1.PaymentRouter },
    { path: "/contact", route: contactus_route_1.ContactRouter },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
