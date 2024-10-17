import { Request, Response } from 'express'
import { userModel } from '../../models/users'
import * as AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

const s3 = new AWS.S3()
const BUCKET_NAME = 'your-bucket-name'

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif']

export const uploadProfilePicture = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum arquivo enviado.' })
        }

        const file = req.file

        if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
            return res
                .status(400)
                .json({
                    message:
                        'Tipo de arquivo inválido. Apenas imagens JPEG, PNG ou GIF são permitidas.',
                })
        }

        const fileName = `${uuidv4()}_${file.originalname}`
        const filePath = `profile_pics/${fileName}`

        const s3Params = {
            Bucket: BUCKET_NAME,
            Key: filePath,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        }

        const s3Result = await s3.upload(s3Params).promise()
        const imageUrl = s3Result.Location

        const userId = req.params.id
        const updateData = { profilePic: imageUrl }

        const updatedUser = await userModel.updateOne(
            { _id: userId },
            { $set: updateData }
        )

        if (updatedUser.modifiedCount === 0) {
            return res
                .status(404)
                .json({ message: 'Usuário não encontrado ou não alterado.' })
        }

        return res.status(200).json({
            message: 'Foto de perfil atualizada com sucesso!',
            imageUrl,
        })
    } catch (error) {
        console.error('Erro ao atualizar foto de perfil:', error)
        return res
            .status(500)
            .json({ error: 'Erro ao salvar a foto de perfil no S3.' })
    }
}
