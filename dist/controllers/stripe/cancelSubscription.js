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
exports.cancelSubscription = void 0;
const stripe_1 = require("../../utils/stripe");
const users_1 = require("../../models/users");
const cancelSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res
                .status(400)
                .json({ message: 'ID do usuário não fornecido.' });
        }
        const user = yield users_1.userModel.findById(userId);
        if (!user || !user.stripeSubscriptionId) {
            return res
                .status(404)
                .json({ message: 'Usuário ou assinatura não encontrado.' });
        }
        const canceledSubscription = yield stripe_1.stripe.subscriptions.update(user.stripeSubscriptionId, {
            cancel_at_period_end: true,
        });
        user.stripeSubscriptionStatus = 'canceled';
        yield user.save();
        return res.status(200).json({
            message: 'Assinatura cancelada com sucesso.',
            subscription: canceledSubscription,
        });
    }
    catch (error) {
        console.error('Erro ao cancelar assinatura:', error);
        res.status(500).json({ message: 'Erro ao cancelar assinatura.' });
    }
});
exports.cancelSubscription = cancelSubscription;
