"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const secondFeed_1 = require("../schemas/secondFeed");
const secondFeed = (0, mongoose_1.model)('secondFeed', secondFeed_1.secondPost);
exports.default = secondFeed;
