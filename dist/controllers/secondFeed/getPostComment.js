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
exports.getPostComments = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const comments_1 = require("../../models/comments");
const secondFeed_1 = __importDefault(require("../../models/secondFeed"));
const getPostComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ error: 'Formato de ID de post inválido' });
    }
    try {
        const postObjectId = new mongoose_1.default.Types.ObjectId(postId);
        const post = yield secondFeed_1.default
            .findById(postObjectId)
            .populate({
            path: 'owner',
            select: 'nickName _id',
        })
            .populate('comments');
        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }
        const postOwner = post.owner;
        const comments = yield comments_1.commentsModel
            .find({ postId: postObjectId })
            .populate({
            path: 'owner',
            select: 'nickName profilePic',
        });
        const formattedComments = comments.map((comment) => {
            const commentOwner = comment.owner;
            return {
                id: comment.id,
                owner: {
                    _id: commentOwner._id.toString(),
                    profilePic: commentOwner.profilePic,
                    nickName: commentOwner.nickName,
                },
                content: comment.content,
                createdAt: comment.createdAt,
            };
        });
        const response = {
            post: {
                ownerId: postOwner._id,
                ownerName: postOwner.nickName,
                createdAt: post.createdAt,
                content: post.content,
                media: post.media,
                likes: post.likes.length,
            },
            comments: formattedComments,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar comentários do post' });
    }
});
exports.getPostComments = getPostComments;
