import { CorsOptions } from 'cors'

export const corsOptions: CorsOptions = {
    origin: 'nakedlove.eu',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
}
