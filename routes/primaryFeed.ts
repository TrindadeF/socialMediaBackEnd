import { Router } from 'express'
import { getPosts } from '../controllers/primaryFeed/getPosts'
import { validBody } from '../middleware/post/validBody'
import { createPost } from '../controllers/primaryFeed/createPost'
import { authBody } from '../middleware/auth/authBody'
import { uploadSingle } from '../middleware/upload'
import { likePost } from '../controllers/primaryFeed/likePosts'
import { deletePost } from '../controllers/primaryFeed/deletePosts'

const router = Router()

router.get('/', getPosts)
router.delete('/:id', authBody, deletePost)
router.post('/', authBody, uploadSingle, validBody, createPost)
router.put('/:id', validBody)
router.post('/:postId/like', authBody, likePost)

export default router
