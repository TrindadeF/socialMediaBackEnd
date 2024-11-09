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
exports.getUsersWhoLikedProfile = exports.getUsersWhoLikedPost = void 0;
const users_1 = require("../../models/users");
const primaryFeed_1 = __importDefault(require("../../models/primaryFeed"));
const secondFeed_1 = __importDefault(require("../../models/secondFeed"));
const getUsersWhoLikedPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    try {
        let post = yield primaryFeed_1.default.findById(postId).populate('likes', 'name profilePic');
        if (!post) {
            post = yield secondFeed_1.default.findById(postId).populate('likes', 'name profilePic');
        }
        if (!post) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }
        res.json({
            content: post.content,
            likes: post.likes.map((user) => ({
                name: user.name,
                profilePic: user.profilePic,
            })),
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar usuários que deram like no post',
            error,
        });
    }
});
exports.getUsersWhoLikedPost = getUsersWhoLikedPost;
const getUsersWhoLikedProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield users_1.userModel
            .findById(userId)
            .populate('likes', 'name profilePic');
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json(user.likes);
    }
    catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar usuários que deram like no perfil',
            error,
        });
    }
});
exports.getUsersWhoLikedProfile = getUsersWhoLikedProfile;
