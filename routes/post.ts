import { Router } from 'express'
import { getPosts } from '../controllers/post/getPosts'

const router = Router()

router.get('/', getPosts)
router.delete('/:id')
router.post('/')
router.put('/:id')
