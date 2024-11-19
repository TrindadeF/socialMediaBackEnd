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
exports.createPortalCustomer = exports.handleCancelSubscription = exports.handleCancelPlan = exports.handleSubscriptionSessionCompleted = exports.handleCheckoutSessionCompleted = exports.generateCheckoutByPlan = exports.createStripeCustomer = exports.getStripeCustomerByEmail = exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const users_1 = require("../models/users");
exports.stripe = new stripe_1.default(process.env.STRIPE_SECRET, {
    httpClient: stripe_1.default.createFetchHttpClient(),
});
const getStripeCustomerByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const customers = yield exports.stripe.customers.list({ email });
    return customers.data[0];
});
exports.getStripeCustomerByEmail = getStripeCustomerByEmail;
const createStripeCustomer = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield (0, exports.getStripeCustomerByEmail)(data.email);
    if (customer)
        return customer;
    return exports.stripe.customers.create({
        email: data.email,
        name: data.name,
    });
});
exports.createStripeCustomer = createStripeCustomer;
const generateCheckoutByPlan = (userId, email, planId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield (0, exports.createStripeCustomer)({ email });
        const session = yield exports.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            client_reference_id: userId,
            customer: customer.id,
            success_url: `http://localhost:3000/done`,
            cancel_url: `http://localhost:3000/error`,
            line_items: [
                {
                    price: planId,
                    quantity: 1,
                },
            ],
        });
        return {
            url: session.url,
        };
    }
    catch (error) {
        console.log('Error generating checkout session', error);
        throw error;
    }
});
exports.generateCheckoutByPlan = generateCheckoutByPlan;
const handleCheckoutSessionCompleted = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const idUser = event.data.object.client_reference_id;
    const stripeSubscriptionId = event.data.object.subscription;
    const stripeCustomerId = event.data.object.customer;
    const checkoutStatus = event.data.object.status;
    if (checkoutStatus !== 'complete')
        return;
    if (!idUser || !stripeSubscriptionId || !stripeCustomerId) {
        throw new Error('idUser, stripeSubscriptionId, stripeCustomerId are required');
    }
    const userExist = yield users_1.userModel.findById(idUser);
    if (!userExist) {
        throw new Error('User not found');
    }
    userExist.stripeCustomerId = stripeCustomerId;
    userExist.stripeSubscriptionId = stripeSubscriptionId;
    yield userExist.save();
});
exports.handleCheckoutSessionCompleted = handleCheckoutSessionCompleted;
const handleSubscriptionSessionCompleted = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptionStatus = event.data.object.status;
    const stripeCustomerId = event.data.object.customer;
    const stripeSubscriptionId = event.data.object.id;
    const userExist = yield users_1.userModel.findOne({ stripeCustomerId });
    if (!userExist) {
        throw new Error('User with stripeCustomerId not found');
    }
    userExist.stripeSubscriptionId = stripeSubscriptionId;
    userExist.stripeSubscriptionStatus = subscriptionStatus;
    yield userExist.save();
});
exports.handleSubscriptionSessionCompleted = handleSubscriptionSessionCompleted;
const handleCancelPlan = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const stripeCustomerId = event.data.object.customer;
    const userExist = yield users_1.userModel.findOne({ stripeCustomerId });
    if (!userExist) {
        throw new Error('User with stripeCustomerId not found');
    }
    userExist.stripeSubscriptionStatus = null;
    yield userExist.save();
});
exports.handleCancelPlan = handleCancelPlan;
const handleCancelSubscription = (idSubscriptions) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield exports.stripe.subscriptions.update(idSubscriptions, {
        cancel_at_period_end: true,
    });
    return subscription;
});
exports.handleCancelSubscription = handleCancelSubscription;
const createPortalCustomer = (idCustomer) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield exports.stripe.billingPortal.sessions.create({
        customer: idCustomer,
        return_url: 'http://localhost:3000/',
    });
    return session;
});
exports.createPortalCustomer = createPortalCustomer;
