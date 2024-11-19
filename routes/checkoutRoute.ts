import { Router } from 'express'
import { createCheckout } from '../controllers/stripe/checkoutController'

const router = Router()

router.get('/checkout', createCheckout)

export default router
