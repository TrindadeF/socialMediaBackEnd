import { CorsOptions } from 'cors'

export const corsOptions: CorsOptions = {
    origin: 'http://nakedlove.eu',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
}
