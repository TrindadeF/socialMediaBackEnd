import { ObjectId } from 'mongoose'

export type Post = {
    content: string
    owner: ObjectId
    createdAt: Date
    likes: number
}
