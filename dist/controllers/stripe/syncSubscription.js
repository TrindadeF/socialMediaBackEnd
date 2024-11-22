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
exports.syncSubscriptionStatus = void 0;
const stripe_1 = require("../../utils/stripe");
const users_1 = require("../../models/users");
const syncSubscriptionStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield users_1.userModel.find({
            stripeSubscriptionId: { $exists: true },
        });
        for (const user of users) {
            try {
                const subscription = yield stripe_1.stripe.subscriptions.retrieve(user.stripeSubscriptionId);
                user.stripeSubscriptionStatus = subscription.status;
                yield user.save();
                console.log(`Usuário ${user._id} atualizado para status: ${subscription.status}`);
            }
            catch (error) {
                console.error(`Erro ao obter status da assinatura para o usuário ${user._id}:`, error);
            }
        }
        console.log('Sincronização de status de assinatura concluída.');
    }
    catch (error) {
        console.error('Erro ao sincronizar status de assinatura:', error);
    }
});
exports.syncSubscriptionStatus = syncSubscriptionStatus;
(0, exports.syncSubscriptionStatus)();
