"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.corsOptions = {
    origin: [
        'http://nakedlove.eu',
        'http://www.nakedlove.eu',
        'https://nakedlove.eu',
        'https://www.nakedlove.eu',
    ],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
};
