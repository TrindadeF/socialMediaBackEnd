import { Router } from 'express'
import { createPost } from '../controllers/secondFeed/createPost'
import { deletePost } from '../controllers/secondFeed/deletePosts'
import { getPosts } from '../controllers/secondFeed/getPosts'
import { likePost } from '../controllers/secondFeed/likePosts'
import { authBody } from '../middleware/auth/authBody'
import { validBody } from '../middleware/post/validBody'
import { uploadSingle } from '../middleware/upload'
import { getPostsByUserId } from '../controllers/secondFeed/getpostbyId'

const router = Router()

router.get('/', getPosts)
router.delete('/:id', authBody, deletePost)
router.post('/', authBody, uploadSingle, validBody, createPost)
router.put('/:id', validBody)
router.post('/:postId/like', authBody, likePost)
router.get('/posts', getPostsByUserId)

export default router
