import { Router } from 'express'
import { createPost } from '../controllers/secondFeed/createPost'
import { deletePost } from '../controllers/secondFeed/deletePosts'
import { getPosts } from '../controllers/secondFeed/getPosts'
import { likePost } from '../controllers/secondFeed/likePosts'
import { authBody } from '../middleware/auth/authBody'
import { validBody } from '../middleware/post/validBody'
import { uploadSingle } from '../middleware/upload'
import { getPostsByUserId } from '../controllers/secondFeed/getpostbyId'
import { addComment } from '../controllers/secondFeed/commentPost'
import { deleteChat } from '../controllers/chat/deleteChat'

const router = Router()

router.get('/', getPosts)
router.delete('/:id', authBody, deletePost)
router.post('/', authBody, uploadSingle, createPost)
router.put('/:id', validBody)
router.post('/:postId/like', authBody, likePost)
router.get('/posts', getPostsByUserId)
router.post('/posts/:postId/comments', authBody, addComment)
router.delete('/chats/:userId1/:userId2', deleteChat)

export default router
