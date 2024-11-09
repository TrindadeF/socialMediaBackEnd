"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const post_1 = require("../schemas/post");
const Post = (0, mongoose_1.model)('Post', post_1.postSchema);
exports.default = Post;
