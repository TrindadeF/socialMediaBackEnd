import { Router } from 'express'
import { getPosts } from '../controllers/primaryFeed/getPosts'
import { validBody } from '../middleware/post/validBody'
import { createPost } from '../controllers/primaryFeed/createPost'
import { authBody } from '../middleware/auth/authBody'
import { uploadSingle } from '../middleware/upload'
import { likePost } from '../controllers/primaryFeed/likePosts'
import { deletePostP } from '../controllers/primaryFeed/deletePosts'
import { addComment } from '../controllers/primaryFeed/commentPost'

const router = Router()

router.get('/', getPosts)
router.delete('/:id', authBody, deletePostP)
router.post('/', authBody, uploadSingle, validBody, createPost)
router.put('/:id', validBody)
router.post('/:postId/like', authBody, likePost)
router.post('/posts/:postId/comments', authBody, addComment)

export default router
