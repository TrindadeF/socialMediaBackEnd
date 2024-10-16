import { Router, Request, Response } from 'express'
import { uploadSingle } from '../middleware/upload'

const router = Router()

router.post('/profile-picture', uploadSingle, (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' })
    }

    const file = req.file as Express.MulterS3.File
    res.status(200).json({
        message: 'Profile picture uploaded successfully!',
        fileUrl: file.location,
    })
})

router.post('/feed-picture', uploadSingle, (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' })
    }

    const file = req.file as Express.MulterS3.File
    res.status(200).json({
        message: 'Feed image uploaded successfully!',
        fileUrl: file.location,
    })
})

export default router
