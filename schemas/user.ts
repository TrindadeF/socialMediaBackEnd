import mongoose, { Schema } from 'mongoose'
import { User } from '../database'

export const userSchema = new Schema<User>(
    {
        name: { type: 'String', required: true },
        age: { type: 'Number', required: true },
        profilePic: { type: 'String', default: 'default' },
        media: { type: [String], default: [] },

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
        confirmpassword: { type: 'string' },
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
        stripeCustomerId: { type: String, default: null },
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpires: { type: Number, default: null },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

        matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        isAnonymous: { type: Boolean, default: false },
        blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        reports: [
            {
                reportedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
                reason: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        primaryPosts: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'PrimaryFeed' },
        ],
        secondPosts: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'SecondFeed' },
        ],
    },
    {
        timestamps: true,
    }
)
