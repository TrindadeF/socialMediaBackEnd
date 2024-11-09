"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingle = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/mpeg',
        'image/WEBP',
    ];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Tipo de arquivo não permitido. Apenas imagens e vídeos são aceitos.'), false);
    }
    cb(null, true);
};
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const fileKey = `uploads/${Date.now().toString()}-${file.originalname}`;
            cb(null, fileKey);
        },
    }),
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
});
const uploadSingle = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                message: 'Erro ao fazer upload',
                details: err.message,
            });
        }
        next();
    });
};
exports.uploadSingle = uploadSingle;
