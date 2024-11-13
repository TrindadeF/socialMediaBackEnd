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
exports.getUser = void 0;
const users_1 = require("../../models/users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield users_1.userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.SECURITY_KEY || 'defaultSecret', { expiresIn: '3h' });
        console.log('Token gerado:', token);
        return res.status(200).json({
            message: 'Login bem-sucedido',
            token,
            userId: user._id,
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'Erro no servidor' });
    }
});
exports.getUser = getUser;
