"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatModel = void 0;
const chat_1 = require("../schemas/chat");
const mongoose_1 = require("mongoose");
exports.chatModel = (0, mongoose_1.model)('chat', chat_1.chatSchema);
