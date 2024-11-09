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
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeUser = void 0;
const users_1 = require("../../models/users");
const likeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, likedUserId } = req.body;
        const user = yield users_1.userModel.findById(userId);
        const likedUser = yield users_1.userModel.findById(likedUserId);
        if (!user || !likedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        const userLikes = user.likes;
        const likedUserLikes = likedUser.likes;
        const userMatches = user.matches;
        const likedUserMatches = likedUser.matches;
        if (userLikes.some((likeId) => likeId.toString() === likedUserId.toString())) {
            return res
                .status(400)
                .json({ message: 'Você já curtiu este usuário.' });
        }
        userLikes.push(likedUserId);
        user.likes = userLikes;
        yield user.save();
        if (likedUserLikes.some((likeId) => likeId.toString() === userId.toString())) {
            userMatches.push(likedUserId);
            likedUserMatches.push(userId);
            user.matches = userMatches;
            likedUser.matches = likedUserMatches;
            yield user.save();
            yield likedUser.save();
            return res.status(200).json({ match: true });
        }
        return res.status(200).json({ match: false });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao processar o like.' });
    }
});
exports.likeUser = likeUser;
