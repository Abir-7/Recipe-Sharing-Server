"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingRouter = void 0;
const express_1 = require("express");
const rating_controller_1 = require("./rating.controller");
const auth_1 = require("../../middleware/auth/auth");
const router = (0, express_1.Router)();
router.post("/add-rating", (0, auth_1.auth)("user"), rating_controller_1.ratingController.ratingOperation);
exports.RatingRouter = router;
