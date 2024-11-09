"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const primaryFeed_1 = require("../schemas/primaryFeed");
const primaryFeed = (0, mongoose_1.model)('primaryFeed', primaryFeed_1.postSchema);
exports.default = primaryFeed;
