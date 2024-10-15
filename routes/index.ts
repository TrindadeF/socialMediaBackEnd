import { Router } from 'express'
import auth from './auth'
import post from './post'
import checkoutRoute from './checkoutRoute'

const router = Router()

router.use('/auth', auth)
router.use('/post', post)
router.use('/checkout', checkoutRoute)

export default router
