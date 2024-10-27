import { Router } from 'express'
import { createUser } from '../controllers/users/createUser'
import { getUser } from '../controllers/users/getUser'
import { deleteUser } from '../controllers/users/deleteUser'
import { authBody } from '../middleware/auth/authBody'
import { updateUser } from '../controllers/users/updateUser'
import { uploadSingle } from '../middleware/upload'
import { getUserProfile } from '../controllers/users/getUserProfile'
import { likeUser } from '../controllers/users/likeUser'
import {
    getUsersWhoLikedPost,
    getUsersWhoLikedProfile,
} from '../controllers/users/getUsersWhoLiked'
import { checkMutualLike } from '../controllers/users/checkmatch'
import { getMessages, sendMessage } from '../controllers/users/message'
import { getChatsByUserId } from '../controllers/users/userChats'

const router = Router()

router.post('/register', createUser)
router.post('/login', getUser)
router.get('/profile', authBody, getUserProfile)
router.put('/profile/edit/:id', authBody, uploadSingle, updateUser)
router.delete('/profile/:id', deleteUser)
router.post('/like-user', likeUser)
router.get('/profile/:userId/likes', getUsersWhoLikedProfile)
router.get('/:postId/likes', getUsersWhoLikedPost)
router.get('/profile/check-mutual-like', checkMutualLike)
router.post('/send-message', authBody, sendMessage)
router.get('/messages', authBody, getMessages)
router.get('/chats/:userId', getChatsByUserId)

export default router
