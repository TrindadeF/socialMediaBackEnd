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
import { sendMessage } from '../controllers/chat/getMessage'
import {
    getChatByUsers,
    getChatsByUserId,
} from '../controllers/chat/getChatByUsers'
import { deletePost } from '../controllers/secondFeed/deletePosts'
import { deletePostP } from '../controllers/primaryFeed/deletePosts'

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
router.delete('/delete/:postId', deletePostP)
router.delete('/delete/second/:postId', deletePost)
router.get('/chats/:userId1/:userId2', getChatByUsers)
router.get('/chats', authBody, getChatsByUserId)

export default router
