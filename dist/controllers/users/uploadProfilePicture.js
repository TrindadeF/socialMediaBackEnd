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
exports.uploadProfilePicture = void 0;
const users_1 = require("../../models/users");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uploadProfilePicture = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mediaUrls = req.body.mediaUrls;
        if (!mediaUrls || !mediaUrls.length) {
            return res
                .status(400)
                .json({ message: 'Nenhuma imagem de perfil foi enviada.' });
        }
        const userId = req.params.id;
        if (!userId) {
            return res
                .status(400)
                .json({ message: 'ID do usuário não encontrado.' });
        }
        const updateData = { profilePic: mediaUrls[0] };
        const updatedUser = yield users_1.userModel.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        next();
    }
    catch (error) {
        console.error('Erro ao fazer upload:', error);
        return res.status(500).json({
            message: 'Erro ao fazer upload do perfil',
            details: error.message,
        });
    }
});
exports.uploadProfilePicture = uploadProfilePicture;
