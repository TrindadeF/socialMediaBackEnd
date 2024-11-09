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
exports.likePost = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const secondFeed_1 = __importDefault(require("../../models/secondFeed"));
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.postId;
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }
        const userId = new mongoose_1.default.Types.ObjectId(req.user.id);
        const post = yield secondFeed_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }
        if (!Array.isArray(post.likes)) {
            post.likes = [];
        }
        const alreadyLiked = post.likes.includes(userId);
        if (alreadyLiked) {
            post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
        }
        else {
            post.likes.push(userId);
        }
        yield post.save();
        return res.status(200).json(post);
    }
    catch (error) {
        console.error('Erro ao curtir o post:', error);
        return res.status(500).json({ error: 'Erro ao curtir o post' });
    }
});
exports.likePost = likePost;
