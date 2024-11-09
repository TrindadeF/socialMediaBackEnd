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
exports.followUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = require("../../models/users");
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { targetUserId } = req.params;
        const currentUser = yield users_1.userModel.findById(currentUserId);
        const targetUser = yield users_1.userModel.findById(targetUserId);
        if (!currentUser || !targetUser) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }
        const isFollowing = currentUser.following.some((id) => id.toString() === targetUserId);
        if (isFollowing) {
            currentUser.following = currentUser.following.filter((id) => id.toString() !== targetUserId);
            targetUser.followers = targetUser.followers.filter((id) => id.toString() !== currentUserId);
            yield currentUser.save();
            yield targetUser.save();
            res.status(200).json({
                message: 'Você deixou de seguir este usuário',
            });
        }
        else {
            currentUser.following.push(new mongoose_1.default.Types.ObjectId(targetUserId));
            targetUser.followers.push(new mongoose_1.default.Types.ObjectId(currentUserId));
            yield currentUser.save();
            yield targetUser.save();
            res.status(200).json({
                message: 'Você agora está seguindo este usuário',
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Erro ao seguir/deixar de seguir o usuário',
        });
    }
});
exports.followUser = followUser;
