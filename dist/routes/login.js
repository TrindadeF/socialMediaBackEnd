"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/auth/authController");
const router = (0, express_1.Router)();
const {} = authController_1.authController;
router.post('/login');
router.post('/register');
exports.default = router;
