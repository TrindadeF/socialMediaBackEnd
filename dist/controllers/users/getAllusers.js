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
exports.getAllUsersWithPosts = void 0;
const users_1 = require("../../models/users");
const primaryFeed_1 = __importDefault(require("../../models/primaryFeed"));
const secondFeed_1 = __importDefault(require("../../models/secondFeed"));
const getAllUsersWithPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield users_1.userModel.find().lean();
        const usersWithPosts = yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const primaryPosts = yield primaryFeed_1.default
                .find({ owner: user._id })
                .lean();
            const secondPosts = yield secondFeed_1.default
                .find({ owner: user._id })
                .lean();
            return Object.assign(Object.assign({}, user), { primaryPosts,
                secondPosts });
        })));
        res.status(200).json(usersWithPosts);
    }
    catch (error) {
        res.status(500).json({
            message: 'Erro ao buscar usuários e posts',
            error,
        });
    }
});
exports.getAllUsersWithPosts = getAllUsersWithPosts;
