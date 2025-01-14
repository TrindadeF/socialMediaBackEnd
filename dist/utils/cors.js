"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://nakedlove.eu',
            'http://www.nakedlove.eu',
            'https://nakedlove.eu',
            'https://www.nakedlove.eu',
            'http://localhost:4200',
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Origin not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
};
