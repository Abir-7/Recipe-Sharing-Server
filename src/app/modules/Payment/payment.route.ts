import { Router } from "express";
import { auth } from "../../middleware/auth/auth";
import { paymentController } from "./payment.controller";
import { paymentConfirm } from "./confirmPayment.controller";

const router = Router();

router.post("/create-payment", auth("user"), paymentController.payment);
router.post("/confirmation", paymentConfirm);

export const PaymentRouter = router;
