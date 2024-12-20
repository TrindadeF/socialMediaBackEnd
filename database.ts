import { ObjectId } from 'mongoose'

export type primaryFeed = {
    content: string
    owner: ObjectId
    createdAt: Date
    likes: string[]
    ownerName: string
    media: string
    id: string
    comments: Comments[]
}

export type secondFeed = {
    content: string
    owner: ObjectId
    postOwnerId: string
    createdAt: Date
    likes: string[]
    ownerName: string
    media: string
    id: string
    comments: Comments[]
}

export type User = {
    _id: ObjectId
    name: string
    age: number
    profilePic: string
    media: [string]
    email: string
    gender: Gender
    password: string
    confirmpassword: string
    description: string
    nickName: string
    stripeCustomerId: string
    stripeSubscriptionId: string
    stripeSubscriptionStatus: StripeSubscriptionStatus | null
    resetPasswordToken: string | null
    resetPasswordExpires: number | null
    likes: ObjectId[]
    matches: ObjectId[]
    followers: ObjectId[]
    following: ObjectId[]
    isAnonymous?: boolean
    blockedUsers: ObjectId[]
    unblockedUsers: ObjectId[]
    reports: {
        reportedBy: ObjectId
        reason: string
        createdAt: Date
    }[]
    primaryPosts: ObjectId[]
    secondPosts: ObjectId[]
}

export type Message = {
    sender: ObjectId
    receiver: ObjectId
    content: string
    createdAt: Date
    chatId: ObjectId
    read: boolean
}

export type Comments = {
    content: string
    cretedAt: Date
    owner: ObjectId
    postId: ObjectId
}

export type Chat = {
    participants: ObjectId[]
    messages: Message[]
    lastMessage: Message | null
    createdAt: Date
    updatedAt: Date
    isAnonymous?: boolean
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
