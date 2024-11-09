"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validBody = void 0;
const validBody = (req, res, next) => {
    const { content } = req.body;
    if (!content || content.trim() === '') {
        return res
            .status(400)
            .json({ error: 'Missing props: content is required' });
    }
    next();
};
exports.validBody = validBody;
