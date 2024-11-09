"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const message_1 = require("./message");
exports.chatSchema = new mongoose_1.default.Schema({
    participants: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    ],
    messages: [message_1.messageSchema],
    lastMessage: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Message',
        default: null,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    senderNickName: { type: String, default: '' },
    receiverNickName: { type: String, default: '' },
});
