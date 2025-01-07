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
exports.sendNotifications = exports.registerSubscription = void 0;
const web_push_1 = __importDefault(require("web-push"));
const subscription_1 = require("../../models/subscription");
const preparePushPayload_1 = require("../../utils/preparePushPayload");
web_push_1.default.setVapidDetails('mailto:nakedlove.service@gmail.com', 'BPwM7KFK1sKJmBYyB3P5O7Iz46xXN1cxR1jyxvvfVjrvPBKR8wAfmvoodu5vh69KkukpNhFle3__5Q4bh505YgU', 'nAID9cWBIwFFjHkF5x3ybAqh35gpKWArqSpMM2ynntA');
const registerSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = req.body;
    try {
        yield subscription_1.SubscriptionModel.create(subscription);
        res.status(201).json({ message: 'Assinatura registrada com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao registrar assinatura:', error);
        res.status(500).json({ error: 'Erro ao registrar assinatura.' });
    }
});
exports.registerSubscription = registerSubscription;
const sendNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.body;
    const notifications = (0, preparePushPayload_1.preparePushPayload)(data);
    try {
        const subscriptions = yield subscription_1.SubscriptionModel.find();
        for (const subscription of subscriptions) {
            if (subscription.keys &&
                subscription.keys.p256dh &&
                subscription.keys.auth) {
                const pushSubscription = {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: subscription.keys.p256dh,
                        auth: subscription.keys.auth,
                    },
                };
                for (const notification of notifications) {
                    try {
                        yield web_push_1.default.sendNotification(pushSubscription, JSON.stringify(notification));
                        console.log('Notificação enviada:', notification.title);
                    }
                    catch (error) {
                        console.error('Erro ao enviar notificação:', error);
                        if (error.statusCode === 410 ||
                            error.statusCode === 404) {
                            yield subscription_1.SubscriptionModel.deleteOne({
                                _id: subscription._id,
                            });
                            console.log('Assinatura inválida removida:', subscription.endpoint);
                        }
                    }
                }
            }
        }
        res.status(200).json({ message: 'Notificações enviadas com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao enviar notificações:', error);
        res.status(500).json({ error: 'Erro ao enviar notificações.' });
    }
});
exports.sendNotifications = sendNotifications;
