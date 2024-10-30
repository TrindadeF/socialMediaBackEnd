import mongoose, { Schema } from 'mongoose'
import { User } from '../database'

export const userSchema = new Schema<User>({
    name: { type: 'String', required: true },
    age: { type: 'Number', required: true },
    profilePic: { type: 'String', default: 'default' },
    gender: { type: 'String', enum: ['M', 'F', 'NB', 'BI', 'TR', 'HOM'] },
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
    confirmpassword: { type: 'string'},
    nickName: { type: 'string' },
    description: { type: 'string' },
    stripeSubscriptionStatus: {
        type: String,
        enum: [
            'active',
            'canceled',
            'incomplete',
            'past_due',
            'paused',
            'incomplete_expired',
        ],
        default: null,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Number },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
})
