"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRouter = void 0;
const express_1 = require("express");
const contact_controller_1 = require("./contact.controller");
const router = (0, express_1.Router)();
router.post("/message", contact_controller_1.contactController.postMesage);
exports.ContactRouter = router;
