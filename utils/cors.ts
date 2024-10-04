import { CorsOptions } from 'cors'

export const corsOptions: CorsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
}
