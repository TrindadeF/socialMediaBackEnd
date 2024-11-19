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
exports.getChatsByUserId = exports.getChatByUsers = void 0;
const chat_1 = require("../../models/chat");
const getChatByUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId1, userId2 } = req.params;
    try {
        const chat = yield chat_1.chatModel
            .findOne({
            participants: { $all: [userId1, userId2] },
        })
            .populate('participants', 'nickName');
        if (!chat) {
            return res.status(404).json({ message: 'Chat não encontrado' });
        }
        res.status(200).json(chat);
    }
    catch (error) {
        console.error('Erro ao buscar chat:', error);
        res.status(500).json({ message: 'Erro ao buscar chat', error });
    }
});
exports.getChatByUsers = getChatByUsers;
const getChatsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }
    const userId = req.user.id;
    try {
        const chats = yield chat_1.chatModel
            .find({ participants: userId })
            .populate('participants', 'nickName');
        if (!chats || chats.length === 0) {
            return res.status(404).json({ message: 'Nenhum chat encontrado' });
        }
        return res.status(200).json(chats);
    }
    catch (error) {
        console.error('Erro ao buscar chats:', error);
        return res.status(500).json({ message: 'Erro ao buscar chats.', error });
    }
});
exports.getChatsByUserId = getChatsByUserId;
