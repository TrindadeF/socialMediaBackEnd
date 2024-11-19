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
exports.addComment = void 0;
const secondFeed_1 = __importDefault(require("../../models/secondFeed"));
const comments_1 = require("../../models/comments");
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }
        if (!content ||
            typeof content !== 'string' ||
            content.trim().length === 0) {
            return res
                .status(400)
                .json({ error: 'Conteúdo do comentário ausente ou inválido' });
        }
        const newComment = yield comments_1.commentsModel.create({
            content: content.trim(),
            owner: req.user.id,
            postId: postId,
            createdAt: new Date(),
        });
        const post = yield secondFeed_1.default.findByIdAndUpdate(postId, { $push: { comments: newComment._id } }, { new: true });
        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }
        return res.status(201).json({
            message: 'Comentário adicionado com sucesso',
            comment: newComment,
        });
    }
    catch (error) {
        console.error('Erro ao adicionar comentário:', error);
        return res
            .status(500)
            .json({ error: error.message || 'Erro ao adicionar comentário' });
    }
});
exports.addComment = addComment;
