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
const express_1 = require("express");
const stripe_1 = require("../utils/stripe");
const stripe_2 = __importDefault(require("stripe"));
const express_2 = __importDefault(require("express"));
const users_1 = require("../models/users");
const router = (0, express_1.Router)();
const stripe = new stripe_2.default(process.env.STRIPE_SECRET, {
    apiVersion: '2024-09-30.acacia',
});
router.post('/webhook', express_2.default.raw({ type: 'application/json' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error('Webhook signature verification failed.', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                yield (0, stripe_1.handleCheckoutSessionCompleted)(event);
                break;
            case 'invoice.payment_succeeded':
                const invoice = event.data.object;
                const customerId = invoice.customer;
                const subscriptionId = invoice.subscription;
                const userExist = yield users_1.userModel.findOne({
                    stripeCustomerId: customerId,
                });
                if (!userExist) {
                    console.error('User not found for customerId', customerId);
                    return res.status(400).send('User not found');
                }
                userExist.stripeSubscriptionId = subscriptionId;
                userExist.stripeSubscriptionStatus = 'active';
                yield userExist.save();
                console.log('Invoice paid successfully, user subscription status updated to active');
                break;
            case 'customer.subscription.deleted':
                yield (0, stripe_1.handleCancelPlan)(event);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    }
    catch (err) {
        console.error('Error handling webhook event:', err);
        return res.status(500).send('Webhook handler error');
    }
    res.json({ received: true });
}));
exports.default = router;
