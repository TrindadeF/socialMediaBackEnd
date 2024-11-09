"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const secondPost_1 = require("../schemas/secondPost");
const Post = (0, mongoose_1.model)('Post', secondPost_1.postSchema);
exports.default = Post;
