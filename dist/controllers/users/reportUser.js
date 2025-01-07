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
exports.reportUser = void 0;
const users_1 = require("../../models/users");
const mongoose_1 = __importDefault(require("mongoose"));
const reportUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }
        const userId = req.user;
        const { reportUserId } = req.params;
        const { reason } = req.body;
        if (userId.id === reportUserId) {
            return res
                .status(400)
                .json({ message: 'Você não pode se reportar.' });
        }
        if (!reason || reason.trim() === '') {
            return res
                .status(400)
                .json({ message: 'O motivo do reporte é obrigatório.' });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(reportUserId)) {
            return res.status(400).json({ message: 'ID do usuário inválido.' });
        }
        const userToReport = yield users_1.userModel.findById(reportUserId);
        if (!userToReport) {
            return res
                .status(404)
                .json({ message: 'Usuário a ser reportado não encontrado.' });
        }
        const alreadyReported = userToReport.reports.some((report) => report.reportedBy.toString() === userId.id);
        if (alreadyReported) {
            return res
                .status(400)
                .json({ message: 'Você já reportou este usuário.' });
        }
        userToReport.reports.push({
            reportedBy: new mongoose_1.default.Types.ObjectId(userId.id),
            reason,
            createdAt: new Date(),
        });
        yield userToReport.save();
        res.status(200).json({ message: 'Usuário reportado com sucesso.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erro ao reportar o usuário.',
            error: error.message,
        });
    }
});
exports.reportUser = reportUser;
