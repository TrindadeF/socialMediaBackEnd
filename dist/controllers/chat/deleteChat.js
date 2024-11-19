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
exports.deleteChat = void 0;
const chat_1 = require("../../models/chat");
const deleteChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId1, userId2 } = req.params;
    try {
        const chat = yield chat_1.chatModel.findOneAndDelete({
            participants: { $all: [userId1, userId2], $size: 2 },
        });
        if (!chat) {
            return res
                .status(404)
                .json({ error: 'Chat não encontrado entre os dois usuarios' });
        }
        return res.status(200).json({ message: 'Chat deletado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao deletar chat:', error);
        return res.status(500).json({ error: 'Error ao deletar chat' });
    }
});
exports.deleteChat = deleteChat;
