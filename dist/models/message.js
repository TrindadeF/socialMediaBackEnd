"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageModel = void 0;
const mongoose_1 = require("mongoose");
const message_1 = require("../schemas/message");
exports.messageModel = (0, mongoose_1.model)('message', message_1.messageSchema);
