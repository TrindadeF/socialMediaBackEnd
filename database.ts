import { ObjectId } from 'mongoose'

export type Post = {
    content: string
    owner: ObjectId
    createdAt: Date
    likes: number
    ownerName: string
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
}

type Gender = 'M' | 'F' | 'NB' | 'BI' | 'TR' | 'HOM'
