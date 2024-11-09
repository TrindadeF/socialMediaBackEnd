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
exports.handleStripeWebhook = exports.createCheckoutSession = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-09-30.acacia',
});
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { priceId } = req.body;
    try {
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });
        return res.json({ url: session.url });
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: 'Erro ao criar a sessão de checkout' });
    }
});
exports.createCheckoutSession = createCheckoutSession;
const handleStripeWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error('Erro ao verificar assinatura do webhook:', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log(`Pagamento bem-sucedido para a sessão ${session.id}`);
            break;
        case 'invoice.payment_succeeded':
            console.log('Pagamento de assinatura bem-sucedido.');
            break;
        case 'invoice.payment_failed':
            console.log('Pagamento de assinatura falhou.');
            break;
        default:
            console.warn(`Evento não tratado: ${event.type}`);
    }
    res.json({ received: true });
});
exports.handleStripeWebhook = handleStripeWebhook;
