<<<<<<< HEAD
import {
    generateCheckout,
    createPortalCustomer,
    getStripeCustomerByEmail,
} from '../utils/stripe'
import { Request, Response } from 'express'
=======
import { generateCheckout, createPortalCustomer } from '../utils/stripe'
import { NextFunction, Request, response, Response } from 'express'
>>>>>>> 6c0a4cdf4e461cd42a31474aef19d9ced8097464
import { userModel } from '../models/users'
import { error } from 'console'

export const createCheckout = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const user = await userModel.findById(id)

        if (!user) {
            return res.status(404).json('Usuário não encontrado')
        }
        const checkout = await generateCheckout(user.id, user.email)

        return res.status(200).json(checkout)
    } catch (e: any) {
        return error(e)
    }
}

export const createPortal = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const user = await userModel.findById(id)

        if (!user) {
            return res.status(404).json('Usuário não encontrado')
        }
<<<<<<< HEAD
        const costumerUser = await getStripeCustomerByEmail(user.email)

        if (!costumerUser) {
            return res.status(404).json('Usuário não encontrado')
        }
        const portal = await createPortalCustomer(costumerUser.id)
=======
        const portal = await createPortalCustomer(user.stripeCustomerId)
>>>>>>> 6c0a4cdf4e461cd42a31474aef19d9ced8097464

        return res.status(200).json(portal)
    } catch (e) {
        return error(e)
    }
}
