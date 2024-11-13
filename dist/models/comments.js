"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const comments_1 = require("../schemas/comments");
exports.commentsModel = mongoose_1.default.model('Comment', comments_1.commentSchema);
