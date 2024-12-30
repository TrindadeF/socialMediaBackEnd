import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
    limit: 1000,
    windowMs: 15 * 60 * 1000,
    message: 'Too many requests',
    standardHeaders: true,
    legacyHeaders: false,
})
