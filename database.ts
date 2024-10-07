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
    gender: Gender
    password: string
    confirmpassword: string
    description: string
}

type Gender = 'M' | 'F' | 'NB' | 'BI' | 'TR' | 'HOM'
