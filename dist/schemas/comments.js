"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.commentSchema = new mongoose_1.default.Schema({
    content: { type: 'String', required: true },
    createdAt: { type: Date, default: Date.now },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
});
