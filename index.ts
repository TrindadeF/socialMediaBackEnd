import express from 'express'
import cors from 'cors'
import { corsOptions } from './utils/cors'
import helmet from 'helmet'
import { limiter } from './utils/limiter'
import 'dotenv/config'

const app = express()

app.use(cors(corsOptions))
app.use(helmet())
app.use(limiter)
app.listen(process.env.PORT, () =>
    console.log(`Running on port ${process.env.PORT}`)
)
