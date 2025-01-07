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
exports.getNotifications = void 0;
const users_1 = require("../../models/users");
const primaryFeed_1 = __importDefault(require("../../models/primaryFeed"));
const secondFeed_1 = __importDefault(require("../../models/secondFeed"));
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const user = yield users_1.userModel.findById(userId).lean();
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        const primaryPosts = yield primaryFeed_1.default.find({ owner: userId }).lean();
        const likesOnPrimaryPosts = yield Promise.all(primaryPosts.map((post) => __awaiter(void 0, void 0, void 0, function* () {
            const usersWhoLiked = yield users_1.userModel
                .find({ _id: { $in: post.likes } })
                .select('_id name profilePic')
                .lean();
            return {
                postId: post._id,
                content: post.content,
                likedBy: usersWhoLiked,
            };
        })));
        const secondPosts = yield secondFeed_1.default.find({ owner: userId }).lean();
        const likesOnSecondPosts = yield Promise.all(secondPosts.map((post) => __awaiter(void 0, void 0, void 0, function* () {
            const usersWhoLiked = yield users_1.userModel
                .find({ _id: { $in: post.likes } })
                .select('_id name profilePic')
                .lean();
            return {
                postId: post._id,
                content: post.content,
                likedBy: usersWhoLiked,
            };
        })));
        const profileLikes = yield users_1.userModel
            .find({ _id: { $in: user.likes } })
            .select('_id name profilePic')
            .lean();
        const followers = yield users_1.userModel
            .find({ _id: { $in: user.followers } })
            .select('_id name profilePic')
            .lean();
        const notifications = {
            profileLikes,
            likesOnPrimaryPosts,
            likesOnSecondPosts,
            followers,
        };
        return res.status(200).json(notifications);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Erro ao buscar notificações do usuário',
            error,
        });
    }
});
exports.getNotifications = getNotifications;
