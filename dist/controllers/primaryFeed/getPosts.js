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
exports.getPosts = void 0;
const primaryFeed_1 = __importDefault(require("../../models/primaryFeed"));
const users_1 = require("../../models/users");
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const user = yield users_1.userModel
            .findById(userId)
            .select('blockedUsers')
            .exec();
        const blockedUsers = (user === null || user === void 0 ? void 0 : user.blockedUsers) || [];
        const posts = yield primaryFeed_1.default.find()
            .populate({
            path: 'owner',
            select: 'nickName profilePic',
            match: {
                _id: { $nin: blockedUsers },
                nickName: { $exists: true },
            },
        })
            .populate({
            path: 'comments',
            populate: {
                path: 'owner',
                select: 'nickName profilePic',
                match: { _id: { $nin: blockedUsers } },
            },
        })
            .exec();
        const postsWithComments = posts
            .filter((post) => post.owner && typeof post.owner !== 'string')
            .map((post) => {
            const owner = post.owner;
            const formattedComments = (post.comments || [])
                .filter((comment) => comment.owner)
                .map((comment) => {
                const commentOwner = comment.owner;
                return {
                    _id: comment._id,
                    content: comment.content,
                    createdAt: comment.createdAt,
                    owner: {
                        nickName: commentOwner.nickName,
                        profilePic: commentOwner.profilePic,
                    },
                };
            });
            return {
                _id: post._id,
                ownerName: owner.nickName,
                ownerProfileImageUrl: owner.profilePic,
                content: post.content,
                createdAt: post.createdAt,
                media: post.media,
                likes: post.likes,
                owner: post.owner,
                comments: formattedComments,
            };
        });
        return res.status(200).json(postsWithComments);
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(400).json({ error: 'Erro ao buscar posts' });
    }
});
exports.getPosts = getPosts;
