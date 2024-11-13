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
exports.AuthService = void 0;
const users_1 = require("../models/users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../.env' });
exports.AuthService = {
    login: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield users_1.userModel.findOne({ email });
        if (!user)
            throw new Error('Usuário ou senha inválido');
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match)
            throw new Error('Usuário ou senha inválida');
        const token = jsonwebtoken_1.default.sign({ _id: user._id.toString(), name: user.name }, process.env.SECURITY_KEY, { expiresIn: '1h' });
        return token;
    }),
    register: (email, password, name) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield users_1.userModel.findOne({ email });
        if (existingUser) {
            throw new Error('Já existe um usuario com este email');
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new users_1.userModel({
            email,
            password: hashedPassword,
            name,
        });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ _id: newUser._id.toString(), name: newUser.name }, process.env.SECURITY_KEY, { expiresIn: '7d' });
        return token;
    }),
};
