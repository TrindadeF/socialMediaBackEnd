"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authBody = void 0;
const authBody = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'Empty fields' });
    next();
};
exports.authBody = authBody;
