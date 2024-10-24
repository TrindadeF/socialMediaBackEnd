import { ObjectId } from 'mongoose'

export type primaryFeed = {
    content: string
    owner: ObjectId
    createdAt: Date
    likes: string[]
    ownerName: string
    media: string
    id: string
}

export type secondFeed = {
    content: string
    owner: ObjectId
    createdAt: Date
    likes: string[]
    ownerName: string
    media: string
    id: string
}

export type User = {
    name: string
    age: number
    profilePic: string
    email: string
    gender: Gender
    password: string
    confirmpassword: string
    description: string
    nickName: string
    stripeCustomerId: string
    stripeSubscriptionId: string
    stripeSubscriptionStatus: StripeSubscriptionStatus | null
    resetPasswordToken: String
    resetPasswordExpires: Number
    likes: ObjectId
    matches: ObjectId
}

type Gender = 'M' | 'F' | 'NB' | 'BI' | 'TR' | 'HOM'
type StripeSubscriptionStatus =
    | 'active'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'past_due'
    | 'paused'
    | 'unpaid'
    | 'trialing'
