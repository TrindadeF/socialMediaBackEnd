import { CorsOptions } from 'cors'

export const corsOptions: CorsOptions = {
    origin: 'https://nakedlove.eu',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}
