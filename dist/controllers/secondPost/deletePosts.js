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
exports.deletePost = void 0;
const secondPost_1 = __importDefault(require("../../models/secondPost"));
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const post = yield secondPost_1.default.findByIdAndDelete(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }
        return res.status(200).json({ message: 'Post deletado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao deletar o post:', error);
        return res.status(500).json({ error: 'Erro ao deletar o post' });
    }
});
exports.deletePost = deletePost;
