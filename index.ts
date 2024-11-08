import express from 'express'
import cors from 'cors'
import { corsOptions } from './utils/cors'
import helmet from 'helmet'
import { limiter } from './utils/limiter'
import 'dotenv/config'
import router from './routes'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import http from 'http'
import { messageModel } from './models/message'

const userSockets: { [key: string]: string } = {}
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: corsOptions,
})
const MONGO_URI = process.env.MONGO_URI

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected')
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err)
    })

app.use(cors(corsOptions))
app.use(helmet())
app.use(limiter)
app.use(express.json())
app.set('trust proxy', true)

app.use(router)

io.on('connection', (socket) => {
    console.log('Um usuário conectado:', socket.id)

    socket.on('registerUser', (userId) => {
        userSockets[userId] = socket.id
        console.log(`Usuário registrado: ${userId} com socket ID ${socket.id}`)
    })

    socket.on('sendMessage', (messageData) => {
        messageModel
            .create(messageData)
            .then((message) => {
                const receiverSocketId = userSockets[messageData.receiver]

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('newMessage', message)
                    console.log(
                        `Mensagem enviada para o usuário ${messageData.receiver}:`,
                        message
                    )
                } else {
                    console.log(
                        `Usuário ${messageData.receiver} não está conectado.`
                    )
                }
            })
            .catch((err) => {
                console.error('Erro ao salvar mensagem:', err)
            })
    })
})

server.listen(process.env.PORT, () =>
    console.log(`Running on port ${process.env.PORT}`)
)
