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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const users_1 = require("../../models/users");
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { name, age, gender, email, nickName, description } = req.body;
    const file = req.file;
    const profilePicUrl = (file === null || file === void 0 ? void 0 : file.location) || req.body.profilePicUrl;
    const userIdFromToken = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (userIdFromToken !== id) {
        return res.status(403).json({
            message: 'Você não tem permissão para editar este perfil.',
        });
    }
    const updateData = {};
    if (name)
        updateData.name = name;
    if (age)
        updateData.age = age;
    if (gender)
        updateData.gender = gender;
    if (email)
        updateData.email = email;
    if (nickName)
        updateData.nickName = nickName;
    if (description)
        updateData.description = description;
    if (profilePicUrl) {
        updateData.profilePic = profilePicUrl;
    }
    try {
        if (Object.keys(updateData).length === 0) {
            return res
                .status(400)
                .json({ message: 'Nenhuma alteração foi enviada.' });
        }
        const result = yield users_1.userModel.updateOne({ _id: id }, { $set: updateData });
        if (result.modifiedCount === 0) {
            return res.status(404).json({
                message: 'Usuário não encontrado ou nenhum dado alterado.',
            });
        }
        return res.status(200).json({
            message: 'Perfil atualizado com sucesso!',
            updatedData: updateData,
        });
    }
    catch (error) {
        console.error('Erro durante a atualização:', error);
        return res
            .status(500)
            .json({ error: 'Erro ao atualizar perfil', details: error });
    }
});
exports.updateUser = updateUser;
