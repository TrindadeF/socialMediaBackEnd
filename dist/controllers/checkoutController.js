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
exports.checkSubscriptionStatus = exports.createPortal = exports.createCheckout = void 0;
const stripe_1 = require("../utils/stripe");
const users_1 = require("../models/users");
const createCheckout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, planId } = req.params;
        const user = yield users_1.userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        const checkout = yield (0, stripe_1.generateCheckoutByPlan)(user.id, user.email, planId);
        return res.status(200).json({ url: checkout.url });
    }
    catch (e) {
        console.error('Erro ao criar sessão de checkout:', e);
        return res
            .status(500)
            .json({ error: 'Erro ao criar sessão de checkout' });
    }
});
exports.createCheckout = createCheckout;
const createPortal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield users_1.userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        const stripeCustomer = yield (0, stripe_1.getStripeCustomerByEmail)(user.email);
        if (!stripeCustomer) {
            return res
                .status(404)
                .json({ message: 'Cliente Stripe não encontrado' });
        }
        const portalSession = yield (0, stripe_1.createPortalCustomer)(stripeCustomer.id);
        return res.status(200).json({ url: portalSession.url });
    }
    catch (e) {
        console.error('Erro ao criar portal do cliente:', e);
        return res
            .status(500)
            .json({ error: 'Erro ao criar portal do cliente' });
    }
});
exports.createPortal = createPortal;
const checkSubscriptionStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield users_1.userModel.findById(id);
        if (!user || !user.stripeCustomerId) {
            return res
                .status(404)
                .json({
                message: 'Usuário não encontrado ou não associado ao Stripe.',
            });
        }
        const subscriptions = yield stripe_1.stripe.subscriptions.list({
            customer: user.stripeCustomerId,
            status: 'active',
        });
        const hasActiveSubscription = subscriptions.data.length > 0;
        return res.status(200).json({ hasActiveSubscription });
    }
    catch (error) {
        console.error('Erro ao verificar status da assinatura:', error);
        res.status(500).json({
            error: 'Erro ao verificar status da assinatura.',
        });
    }
});
exports.checkSubscriptionStatus = checkSubscriptionStatus;
