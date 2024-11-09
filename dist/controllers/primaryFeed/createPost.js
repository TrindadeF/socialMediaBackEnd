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
exports.createPost = void 0;
const primaryFeed_1 = __importDefault(require("../../models/primaryFeed"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        if (!req.user || !req.user.id) {
            return res
                .status(401)
                .json({ error: 'Usuário não autenticado ou ID ausente' });
        }
        if (!content ||
            typeof content !== 'string' ||
            content.trim().length === 0) {
            return res
                .status(400)
                .json({ error: 'Conteúdo do post ausente ou inválido' });
        }
        const file = req.file;
        const mediaUrl = file ? file.location : null;
        if (!mediaUrl) {
            console.log('Nenhuma mídia foi enviada');
        }
        else {
            console.log('Mídia enviada:', mediaUrl);
        }
        const post = yield primaryFeed_1.default.create({
            content: content.trim(),
            owner: req.user.id,
            media: mediaUrl ? [mediaUrl] : [],
            createdAt: new Date(),
            likes: [],
            comments: [],
        });
        return res
            .status(201)
            .json({ message: 'Post criado com sucesso', post });
    }
    catch (error) {
        console.error('Erro ao criar o post:', error);
        return res
            .status(500)
            .json({ error: error.message || 'Erro ao criar o post' });
    }
});
exports.createPost = createPost;
