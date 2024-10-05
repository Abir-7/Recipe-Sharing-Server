import { Router } from "express";
import { contactController } from "./contact.controller";

const router = Router();
router.post("/message", contactController.postMesage);

export const ContactRouter = router;
