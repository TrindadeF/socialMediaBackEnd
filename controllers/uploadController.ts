import { S3Client } from '@aws-sdk/client-s3'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { Request } from 'express'
import dotenv from 'dotenv'

dotenv.config()

interface UploadedFile extends Express.Multer.File {
    originalname: string
    fieldname: string
}

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
})

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.AWS_BUCKET_NAME!,
        acl: 'public-read',
        metadata: (
            req: Request,
            file: UploadedFile,
            cb: (error: any, metadata: any) => void
        ) => {
            cb(null, { fieldName: file.fieldname })
        },
        key: (
            req: Request,
            file: UploadedFile,
            cb: (error: any, key: string) => void
        ) => {
            cb(null, Date.now().toString() + '-' + file.originalname)
        },
    }),
})

export default upload
