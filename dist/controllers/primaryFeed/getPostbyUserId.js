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
        const posts = yield secondFeed_1.default
            .find(filter)
            .populate('owner', 'nickName profilePic')
            .populate('comments.owner', 'nickName')
            .exec();
        const postsWithLikes = posts.map((post) => {
            const owner = post.owner;
            return {
                _id: post._id,
                ownerName: owner.nickName,
                ownerProfileImageUrl: owner.profilePic,
                content: post.content,
                createdAt: post.createdAt,
                media: post.media,
                likes: post.likes.length,
            };
        });
        return res.status(200).json(postsWithLikes);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar posts' });
    }
});
exports.getPostsByUserId = getPostsByUserId;
