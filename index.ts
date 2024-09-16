import express from 'express'
import cors from 'cors'
import { corsOptions } from './utils/cors'
import helmet from 'helmet'
import { limiter } from './utils/limiter'

const app = express()

app.use(cors(corsOptions))
app.use(helmet())
app.use(limiter)
