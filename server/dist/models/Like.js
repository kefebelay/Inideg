"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LikeSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    businessId: { type: String, required: true },
    liked: { type: Boolean, default: true },
}, { timestamps: true });
const Like = (0, mongoose_1.model)("like", LikeSchema);
exports.default = Like;
