"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkoutController_1 = require("../controllers/stripe/checkoutController");
const router = (0, express_1.Router)();
router.get('/checkout', checkoutController_1.createCheckout);
exports.default = router;
