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
exports.getMessages = exports.sendMessage = void 0;
const message_1 = require("../../models/message");
const chat_1 = require("../../models/chat");
const users_1 = require("../../models/users");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sender, receiver, content } = req.body;
        const senderUser = yield users_1.userModel.findById(sender).select('nickName');
        const receiverUser = yield users_1.userModel
            .findById(receiver)
            .select('nickName');
        const newMessage = new message_1.messageModel({
            sender,
            receiver,
            content,
            senderNickName: (senderUser === null || senderUser === void 0 ? void 0 : senderUser.nickName) || '',
            receiverNickName: (receiverUser === null || receiverUser === void 0 ? void 0 : receiverUser.nickName) || '',
        });
        yield newMessage.save();
        let chat = yield chat_1.chatModel.findOne({
            participants: { $all: [sender, receiver] },
        });
        if (!chat) {
            chat = new chat_1.chatModel({
                participants: [sender, receiver],
                messages: [],
                lastMessage: newMessage._id,
                updatedAt: new Date(),
            });
        }
        chat.messages.push(newMessage);
        chat.lastMessage = newMessage._id;
        chat.updatedAt = new Date();
        yield chat.save();
        res.status(201).json({
            id: newMessage._id,
            sender: newMessage.sender,
            receiver: newMessage.receiver,
            content: newMessage.content,
            timestamp: newMessage.timestamp,
            senderNickName: newMessage.senderNickName,
            receiverNickName: newMessage.receiverNickName,
        });
    }
    catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderId, receiverId } = req.query;
        if (!senderId || !receiverId) {
            console.error('Parâmetros inválidos:', { senderId, receiverId });
            res.status(400).json({
                error: 'senderId e receiverId são necessários',
            });
            return;
        }
        const chat = yield chat_1.chatModel
            .findOne({ participants: { $all: [senderId, receiverId] } })
            .populate('messages.sender', 'nickName')
            .populate('messages.receiver', 'nickName')
            .exec();
        if (!chat) {
            res.status(404).json({ error: 'Chat não encontrado' });
            return;
        }
        const formattedMessages = chat.messages.map((message) => ({
            id: message._id,
            sender: {
                id: message.sender._id,
                nickName: message.senderNickName,
            },
            receiver: {
                id: message.receiver._id,
                nickName: message.receiverNickName,
            },
            content: message.content,
            timestamp: message.timestamp,
        }));
        res.status(200).json(formattedMessages);
    }
    catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }
});
exports.getMessages = getMessages;
