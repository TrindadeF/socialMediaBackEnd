import { Router } from 'express'
import { getPosts } from '../controllers/post/getPosts'
import { validBody } from '../middleware/post/validBody'
import { creatPost } from '../controllers/post/createPost'

const router = Router()

router.get('/', getPosts)
router.delete('/:id')
router.post('/', validBody, creatPost)
router.put('/:id', validBody)

export default router
