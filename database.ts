import { ObjectId } from 'mongoose'

export type Post = {
    content: string
    owner: ObjectId
    createdAt: Date
    likes: number
}

export type User = {
    name: string
    age: number
    profilePic: string
    email: string
    bornedAt: Date
    gender: Gender
    password: string
}

type Gender = 'M' | 'F' | 'NB' | 'NONE'
