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
exports.unblockUser = exports.blockUser = void 0;
const users_1 = require("../../models/users");
const mongoose_1 = __importDefault(require("mongoose"));
const blockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }
        const userId = req.user.id;
        const { blockUserId } = req.params;
        console.log(`blockUserId recebido: ${blockUserId}`);
        if (!blockUserId || !mongoose_1.default.Types.ObjectId.isValid(blockUserId)) {
            return res.status(400).json({ message: 'ID inválido.' });
        }
        const blockUserObjectId = new mongoose_1.default.Types.ObjectId(blockUserId);
        const user = yield users_1.userModel.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ message: 'Usuário autenticado não encontrado.' });
        }
        const userToBlock = yield users_1.userModel.findById(blockUserObjectId);
        if (!userToBlock) {
            return res
                .status(404)
                .json({ message: 'Usuário a ser bloqueado não encontrado.' });
        }
        if (user.blockedUsers.some((id) => id.toString() === blockUserId)) {
            return res
                .status(400)
                .json({ message: 'Usuário já está bloqueado.' });
        }
        user.blockedUsers.push(blockUserObjectId);
        yield user.save();
        res.status(200).json({ message: 'Usuário bloqueado com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao bloquear o usuário:', error);
        res.status(500).json({
            message: 'Erro ao bloquear o usuário.',
            error: error.message,
        });
    }
    ;
});
exports.blockUser = blockUser;
const unblockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }
        const userId = req.user.id;
        const { unblockUserId } = req.params;
        console.log(`unblockUserId recebido: ${unblockUserId}`);
        if (!unblockUserId || !mongoose_1.default.Types.ObjectId.isValid(unblockUserId)) {
            return res.status(400).json({ message: 'ID inválido.' });
        }
        const unblockUserObjectId = new mongoose_1.default.Types.ObjectId(unblockUserId);
        const user = yield users_1.userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário autenticado não encontrado.' });
        }
        const userToUnblock = yield users_1.userModel.findById(unblockUserObjectId);
        if (!userToUnblock) {
            return res.status(404).json({ message: 'Usuário a ser desbloqueado não encontrado.' });
        }
        const isBlocked = user.blockedUsers.some((id) => id.toString() === unblockUserId);
        if (!isBlocked) {
            return res.status(400).json({ message: 'Usuário não está bloqueado.' });
        }
        user.blockedUsers = user.blockedUsers.filter((id) => id.toString() !== unblockUserId);
        yield user.save();
        res.status(200).json({ message: 'Usuário desbloqueado com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao desbloquear o usuário:', error);
        res.status(500).json({
            message: 'Erro ao desbloquear o usuário.',
            error: error.message,
        });
    }
});
exports.unblockUser = unblockUser;
