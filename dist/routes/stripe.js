"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_1 = require("../utils/stripe");
const checkoutController_1 = require("../controllers/stripe/checkoutController");
const router = (0, express_1.Router)();
router.post('/checkout/:plan', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, email } = req.body;
    const plan = req.params.plan;
    const planMap = {
        plan1: process.env.STRIPE_ID_PLAN,
        plan2: process.env.STRIPE_ID_PLAN_2,
        plan3: process.env.STRIPE_ID_PLAN_3,
    };
    const planId = planMap[plan];
    if (!planId) {
        return res.status(400).json({ error: 'Plano inválido' });
    }
    try {
        const { url } = yield (0, stripe_1.generateCheckoutByPlan)(userId, email, planId);
        res.status(200).json({ url });
    }
    catch (error) {
        console.error('Erro ao gerar sessão de checkout:', error);
        res.status(500).json({ error: 'Erro ao gerar sessão de checkout' });
    }
}));
router.post('/create-portal', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.body;
    try {
        const session = yield (0, stripe_1.createPortalCustomer)(customerId);
        res.status(200).json({ url: session.url });
    }
    catch (error) {
        console.error('Erro ao criar portal de cliente:', error);
        res.status(500).json({ error: 'Erro ao criar portal de cliente' });
    }
}));
router.get('/subscription-status/:id', checkoutController_1.checkSubscriptionStatus);
exports.default = router;
