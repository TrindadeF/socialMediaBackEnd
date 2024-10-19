import { Router } from 'express'
import { getPosts } from '../controllers/post/getPosts'
import { validBody } from '../middleware/post/validBody'
import { createPost } from '../controllers/post/createPost'
import { authBody } from '../middleware/auth/authBody'
import { uploadSingle } from '../middleware/upload'
import { likePost } from '../controllers/post/likePosts'

const router = Router()

router.get('/', getPosts)
router.delete('/:id')
router.post('/', authBody, uploadSingle, validBody, createPost)
router.put('/:id', validBody)
router.post('/:postId/like', likePost)

export default router
