import { Router } from 'express'
import { createCheckout } from '../controllers/checkoutController'

const router = Router()

router.get('/checkout', createCheckout)

export default router
