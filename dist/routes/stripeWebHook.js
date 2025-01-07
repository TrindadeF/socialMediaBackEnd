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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const stripe_2 = require("../utils/stripe");
const users_1 = require("../models/users");
const router = express_1.default.Router();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET);
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error('Erro ao validar o webhook:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
        case 'checkout.session.completed':
            yield (0, stripe_2.handleCheckoutSessionCompleted)(event);
            break;
        case 'customer.subscription.updated':
            yield (0, stripe_2.handleSubscriptionSessionCompleted)(event);
            break;
        case 'customer.subscription.deleted':
            yield (0, stripe_2.handleCancelPlan)(event);
            break;
        default:
            console.log(`Evento não tratado: ${event.type}`);
    }
    res.json({ received: true });
}));
router.post('/cancel-subscription', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subscriptionId } = req.body;
        if (!subscriptionId) {
            return res
                .status(400)
                .json({ error: 'Subscription ID is required' });
        }
        const updatedSubscription = yield (0, stripe_2.handleCancelSubscription)(subscriptionId);
        const stripeCustomerId = updatedSubscription.customer;
        const user = yield users_1.userModel.findOne({ stripeCustomerId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.stripeSubscriptionStatus = null;
        yield user.save();
        res.status(200).json({
            success: true,
            subscription: updatedSubscription,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error canceling subscription:', error.message);
            return res.status(500).json({ error: error.message });
        }
        console.error('Unexpected error:', error);
        return res.status(500).json({ error: 'Unexpected error occurred' });
    }
}));
exports.default = router;
