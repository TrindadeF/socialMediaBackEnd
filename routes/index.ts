import { Router } from 'express'
import auth from './auth'
import post from './post'
import stripe from './stripe'

const router = Router()

router.use('/auth', auth)
router.use('/post', post)
router.use('/stripe', stripe)

export default router
