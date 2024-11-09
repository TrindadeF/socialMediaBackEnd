"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cors_2 = require("./utils/cors");
const helmet_1 = __importDefault(require("helmet"));
const limiter_1 = require("./utils/limiter");
require("dotenv/config");
const routes_1 = __importDefault(require("./routes"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const message_1 = require("./models/message");
const userSockets = {};
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: cors_2.corsOptions,
});
const MONGO_URI = process.env.MONGO_URI;
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.log('MongoDB connected');
})
    .catch((err) => {
    console.error('MongoDB connection error:', err);
});
app.use((0, cors_1.default)(cors_2.corsOptions));
app.use((0, helmet_1.default)());
app.use(limiter_1.limiter);
app.use(express_1.default.json());
app.use(routes_1.default);
io.on('connection', (socket) => {
    console.log('Um usuário conectado:', socket.id);
    socket.on('registerUser', (userId) => {
        userSockets[userId] = socket.id;
        console.log(`Usuário registrado: ${userId} com socket ID ${socket.id}`);
    });
    socket.on('sendMessage', (messageData) => {
        message_1.messageModel
            .create(messageData)
            .then((message) => {
            const receiverSocketId = userSockets[messageData.receiver];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('newMessage', message);
                console.log(`Mensagem enviada para o usuário ${messageData.receiver}:`, message);
            }
            else {
                console.log(`Usuário ${messageData.receiver} não está conectado.`);
            }
        })
            .catch((err) => {
            console.error('Erro ao salvar mensagem:', err);
        });
    });
});
server.listen(process.env.PORT, () => console.log(`Running on port ${process.env.PORT}`));
