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
exports.getOrCreateChatByParticipants = void 0;
const chat_1 = require("../../models/chat");
const users_1 = require("../../models/users");
const getOrCreateChatByParticipants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId1, userId2 } = req.body;
    try {
        let chat = yield chat_1.chatModel
            .findOne({
            participants: { $all: [userId1, userId2] },
        })
            .populate('participants', 'nickname');
        if (!chat) {
            chat = yield chat_1.chatModel.create({
                participants: [userId1, userId2],
                messages: [],
            });
        }
        const participants = yield users_1.userModel.find({
            _id: { $in: chat.participants },
        }, 'nickname');
        res.status(200).json({
            chatId: chat._id,
            messages: chat.messages,
            participants: participants.map((p) => ({
                id: p._id,
                nickname: p.nickName,
            })),
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar ou criar chat', error });
    }
});
exports.getOrCreateChatByParticipants = getOrCreateChatByParticipants;
