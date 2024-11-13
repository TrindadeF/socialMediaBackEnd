import { Router, Request, Response } from 'express'
import { generateCheckoutByPlan, createPortalCustomer } from '../utils/stripe'
import { checkSubscriptionStatus } from '../controllers/checkoutController'

const router = Router()

router.post('/checkout/:plan', async (req: Request, res: Response) => {
    const { userId, email } = req.body
    const plan = req.params.plan

    const planMap: { [key: string]: string | undefined } = {
        plan1: process.env.STRIPE_ID_PLAN,
        plan2: process.env.STRIPE_ID_PLAN_2,
        plan3: process.env.STRIPE_ID_PLAN_3,
    }

    const planId = planMap[plan]

    if (!planId) {
        return res.status(400).json({ error: 'Plano inválido' })
    }

    try {
        const { url } = await generateCheckoutByPlan(userId, email, planId)
        res.status(200).json({ url })
    } catch (error) {
        console.error('Erro ao gerar sessão de checkout:', error)
        res.status(500).json({ error: 'Erro ao gerar sessão de checkout' })
    }
})

router.post('/create-portal', async (req: Request, res: Response) => {
    const { customerId } = req.body

    try {
        const session = await createPortalCustomer(customerId)
        res.status(200).json({ url: session.url })
    } catch (error) {
        console.error('Erro ao criar portal de cliente:', error)
        res.status(500).json({ error: 'Erro ao criar portal de cliente' })
    }
})

router.get('/subscription-status/:userId', checkSubscriptionStatus)

export default router
