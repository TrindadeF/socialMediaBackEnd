import { Router } from 'express'
import { getPosts } from '../controllers/primaryFeed/getPosts'
import { validBody } from '../middleware/post/validBody'
import { createPost } from '../controllers/primaryFeed/createPost'
import { authBody } from '../middleware/auth/authBody'
import { uploadSingle } from '../middleware/upload'
import { likePost } from '../controllers/primaryFeed/likePosts'
import { deletePostP } from '../controllers/primaryFeed/deletePosts'
import { addComment } from '../controllers/primaryFeed/commentPost'
import { getPostComments } from '../controllers/primaryFeed/getPostComment'
import { deleteComment } from '../controllers/primaryFeed/deleteComments'

const router = Router()

router.get('/', getPosts)
router.delete('/:id', authBody, deletePostP)
router.post('/', authBody, uploadSingle, validBody, createPost)
router.put('/:id', validBody)
router.post('/:postId/like', authBody, likePost)
router.post('/posts/:postId/comments', authBody, addComment)
router.get('/posts/:postId/comments', getPostComments)
router.delete('/comments/:commentId', deleteComment)

export default router
