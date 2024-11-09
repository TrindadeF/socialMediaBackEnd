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
exports.checkMutualLike = void 0;
const users_1 = require("../../models/users");
const checkMutualLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        const otherUserId = req.query.otherUserId;
        if (!userId || !otherUserId) {
            res.status(400).json({
                error: 'Both userId and otherUserId are required',
            });
            return;
        }
        const user = yield users_1.userModel.findById(userId).exec();
        const hasLiked = user &&
            Array.isArray(user.likes) &&
            user.likes.map(String).includes(otherUserId);
        const otherUser = yield users_1.userModel.findById(otherUserId).exec();
        const hasMutualLike = hasLiked &&
            otherUser &&
            Array.isArray(otherUser.likes) &&
            otherUser.likes.map(String).includes(userId);
        res.status(200).json({ mutualLike: hasMutualLike });
    }
    catch (error) {
        console.error('Erro ao verificar o match entre os usuarios:', error);
        res.status(500).json({
            error: 'Erro ao verificar o match entre os usuarios',
        });
    }
});
exports.checkMutualLike = checkMutualLike;
