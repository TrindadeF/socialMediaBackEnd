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
exports.createUser = void 0;
const users_1 = require("../../models/users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const emailService_1 = require("../../utils/emailService");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, age, gender, email, password, description, nickName, stripeCustomerId, stripeSubscriptionId, stripeSubscriptionStatus, } = req.body;
    try {
        const existingUser = yield users_1.userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield users_1.userModel.create({
            name,
            age,
            gender,
            email,
            password: hashedPassword,
            confirmpassword: hashedPassword,
            description,
            nickName,
            stripeCustomerId,
            stripeSubscriptionId,
            stripeSubscriptionStatus,
        });
        (0, emailService_1.sendWelcomeEmail)(newUser.email);
        return res
            .status(201)
            .json({ message: 'Usuário criado com sucesso', user: newUser });
    }
    catch (error) {
        return res
            .status(400)
            .json({ error: error.message || 'Erro ao criar usuário' });
    }
});
exports.createUser = createUser;
