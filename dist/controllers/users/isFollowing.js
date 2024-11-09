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
exports.isFollowing = void 0;
const users_1 = require("../../models/users");
const isFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, targetUserId } = req.params;
        const user = yield users_1.userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        const isFollowing = user.following.some((followingId) => followingId.toString() === targetUserId);
        res.json(isFollowing);
    }
    catch (error) {
        console.error('Erro ao verificar o estado de seguir:', error);
        res.status(500).json({
            message: 'Erro ao verificar o estado de seguir',
        });
    }
});
exports.isFollowing = isFollowing;
