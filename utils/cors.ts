import { CorsOptions } from 'cors'

export const corsOptions: CorsOptions = {
<<<<<<< HEAD
    origin: ['http://nakedlove.eu',
             'http://www.nakedlove.eu',
             'https://nakedlove.eu',
             'https://www.nakedlove.eu'],
=======
    origin: [
        'http://nakedlove.eu',
        'http://www.nakedlove.eu',
        'https://nakedlove.eu',
        'https://www.nakedlove.eu',
    ],
>>>>>>> 263f617df41823cce6a83eff6418abf4f07f3f17
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}
