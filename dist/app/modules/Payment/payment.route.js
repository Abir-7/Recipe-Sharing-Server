"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../../middleware/auth/auth");
const payment_controller_1 = require("./payment.controller");
const confirmPayment_controller_1 = require("./confirmPayment.controller");
const router = (0, express_1.Router)();
router.post("/create-payment", (0, auth_1.auth)("user"), payment_controller_1.paymentController.payment);
router.post("/confirmation", confirmPayment_controller_1.paymentConfirm);
exports.PaymentRouter = router;
