"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
};
