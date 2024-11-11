import { CorsOptions } from 'cors'

export const corsOptions: CorsOptions = {
    origin: [
        'http://nakedlove.eu',
        'http://www.nakedlove.eu',
        'https://nakedlove.eu',
        'https://www.nakedlove.eu',
    ],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}
