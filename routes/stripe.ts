import { Router, Request, Response } from 'express'
import {
    generateCheckout,
    createPortalCustomer,
    generateCheckout2,
    generateCheckout3,
} from '../utils/stripe'

const router = Router()

router.post('/checkout', async (req: Request, res: Response) => {
    const { userId, email } = req.body

    try {
        const { url } = await generateCheckout(userId, email)
        res.status(200).json({ url })
    } catch (error) {
        console.error('Erro ao gerar sessão de checkout:', error)
        res.status(500).json({ error: 'Erro ao gerar sessão de checkout' })
    }
})
router.post('/checkout/plan2', async (req: Request, res: Response) => {
    const { userId, email } = req.body

    try {
        const { url } = await generateCheckout2(userId, email)
        res.status(200).json({ url })
    } catch (error) {
        console.error('Erro ao gerar sessão de checkout:', error)
        res.status(500).json({ error: 'Erro ao gerar sessão de checkout' })
    }
})
router.post('/checkout/plan3', async (req: Request, res: Response) => {
    const { userId, email } = req.body

    try {
        const { url } = await generateCheckout3(userId, email)
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

export default router
