import { Router } from 'express'
import { getPosts } from '../controllers/post/getPosts'
import { validBody } from '../middleware/post/validBody'
import { createPost } from '../controllers/post/createPost'
import { authBody } from '../middleware/auth/authBody'
import { uploadSingle } from '../middleware/upload'
import { likePost } from '../controllers/post/likePosts'
import { deletePost } from '../controllers/post/deletePosts'

const router = Router()

router.get('/', getPosts)
router.delete('/:id', authBody, deletePost)
router.post('/', authBody, uploadSingle, validBody, createPost)
router.put('/:id', validBody)
router.post('/:postId/like', authBody, likePost)

export default router
