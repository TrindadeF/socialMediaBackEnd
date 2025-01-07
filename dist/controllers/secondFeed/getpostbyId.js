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
exports.getPostsByUserId = void 0;
const secondFeed_1 = __importDefault(require("../../models/secondFeed"));
const getPostsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        const filter = userId ? { owner: userId } : {};
        console.log('Filtro aplicado:', filter);
        const posts = yield secondFeed_1.default
            .find(filter)
            .populate({
            path: 'owner',
            select: 'nickName profilePic _id',
            match: { nickName: { $exists: true } },
        })
            .populate('comments.owner', '_id nickName')
            .exec();
        console.log('Posts encontrados (direto do banco):', posts);
        const postsWithDetails = posts.map((post) => {
            if (!post.owner) {
                throw new Error(`Owner não encontrado para o post ${post._id}`);
            }
            const owner = post.owner;
            return {
                _id: post._id,
                owner: {
                    _id: owner._id,
                    nickName: owner.nickName,
                    profilePic: owner.profilePic,
                },
                content: post.content,
                createdAt: post.createdAt,
                media: post.media,
                likesCount: Array.isArray(post.likes) ? post.likes.length : 0,
                comments: post.comments.map((comment) => ({
                    _id: comment._id,
                    text: comment.text,
                    owner: comment.owner
                        ? {
                            _id: comment.owner._id,
                            nickName: comment.owner.nickName,
                        }
                        : null,
                })),
            };
        });
        console.log('Resposta formatada:', postsWithDetails);
        return res.status(200).json(postsWithDetails);
    }
    catch (error) {
        console.error('Erro ao buscar posts:', error.message);
        return res
            .status(500)
            .json({ error: 'Erro ao buscar posts', details: error.message });
    }
});
exports.getPostsByUserId = getPostsByUserId;
