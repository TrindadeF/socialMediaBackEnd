import { Schema } from 'mongoose'
import { User } from '../database'

export const userSchema = new Schema<User>({
    name: { type: 'String', required: true },
    age: { type: 'Number', required: true },
    profilePic: { type: 'String', required: true, default: 'default' },
    gender: { type: 'String', required: true, enum: ['M', 'F', 'NB', 'NONE'] },
    email: {
        type: 'String',
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[a-z0-9.]+@[a-z0-9]+.[a-z]+.([a-z]+)?$/i,
            'please, use valid email ',
        ],
    },
    password: { type: 'string', required: true },
})
