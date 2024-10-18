import { S3Client } from '@aws-sdk/client-s3'
import multer from 'multer'
import multerS3 from 'multer-s3'
import dotenv from 'dotenv'

dotenv.config()

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
})

const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/mpeg',
    ]
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(
            new Error(
                'Tipo de arquivo não permitido. Apenas imagens e vídeos são aceitos.'
            ),
            false
        )
    }
    cb(null, true)
}

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME!,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname })
        },
        key: (req, file, cb) => {
            const fileKey = `uploads/${Date.now().toString()}-${file.originalname}`
            cb(null, fileKey)
        },
    }),
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
})

export const uploadSingle = (req: any, res: any, next: any) => {
    upload.single('image')(req, res, (err: any) => {
        if (err) {
            return res.status(400).json({
                message: 'Erro ao fazer upload',
                details: err.message,
            })
        }
        next()
    })
}
