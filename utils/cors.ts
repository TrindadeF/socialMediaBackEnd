import { CorsOptions } from 'cors'

export const corsOptions: CorsOptions = {
    origin: process.env.URL,

    methods: ['GET', 'POST', 'DELETE', 'PUT'],
}
