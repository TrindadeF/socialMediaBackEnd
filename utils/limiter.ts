import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
    limit: 100,
    windowMs: 10 * 60 * 1000,
    message: 'Too many requests',
    standardHeaders: true,
    legacyHeaders: false,
})
