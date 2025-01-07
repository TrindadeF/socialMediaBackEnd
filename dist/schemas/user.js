"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.userSchema = new mongoose_1.Schema({
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
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    matches: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    isAnonymous: { type: Boolean, default: false },
    blockedUsers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    reports: [
        {
            reportedBy: { type: mongoose_1.default.Types.ObjectId, ref: 'User' },
            reason: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    primaryPosts: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'PrimaryFeed' },
    ],
    secondPosts: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'SecondFeed' },
    ],
}, {
    timestamps: true,
});
