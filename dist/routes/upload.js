"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
router.post('/profile-picture', upload_1.uploadSingle, (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    const file = req.file;
    res.status(200).json({
        message: 'Profile picture uploaded successfully!',
        fileUrl: file.location,
    });
});
router.post('/feed-picture', upload_1.uploadSingle, (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    const file = req.file;
    res.status(200).json({
        message: 'Feed image uploaded successfully!',
        fileUrl: file.location,
    });
});
exports.default = router;
