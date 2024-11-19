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
exports.deleteComment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const comments_1 = require("../../models/comments");
const primaryFeed_1 = __importDefault(require("../../models/primaryFeed"));
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    try {
        const commentObjectId = new mongoose_1.default.Types.ObjectId(commentId);
        const comment = yield comments_1.commentsModel.findById(commentObjectId);
        if (!comment) {
            return res.status(404).json({ error: 'Comentário não encontrado' });
        }
        const post = yield primaryFeed_1.default.findById(comment.postId);
        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }
        yield comments_1.commentsModel.findByIdAndDelete(commentObjectId);
        yield primaryFeed_1.default.findByIdAndUpdate(comment.postId, {
            $pull: { comments: commentObjectId },
        });
        return res
            .status(200)
            .json({ message: 'Comentário apagado com sucesso',
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao apagar o comentário' });
    }
});
exports.deleteComment = deleteComment;
