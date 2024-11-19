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
exports.getChatById = void 0;
const chat_1 = require("../../models/chat");
const getChatById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    try {
        const chat = yield chat_1.chatModel
            .findById(chatId)
            .populate('participants')
            .populate('messages');
        if (chat) {
            return res.status(200).json(chat);
        }
        else {
            return res.status(404).json({ message: 'Chat não encontrado' });
        }
    }
    catch (error) {
        console.error('Erro ao buscar o chat:', error);
        return res.status(500).json({ message: 'Erro no servidor' });
    }
});
exports.getChatById = getChatById;
