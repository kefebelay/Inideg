"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeBusiness = likeBusiness;
exports.getLikedBusinesses = getLikedBusinesses;
const Like_1 = __importDefault(require("../models/Like"));
function likeBusiness(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, businessId } = req.body;
        try {
            const existingLike = yield Like_1.default.findOne({ userId, businessId });
            if (existingLike) {
                existingLike.liked = !existingLike.liked;
                yield existingLike.save();
                res
                    .status(200)
                    .json({ message: "Like status toggled", like: existingLike });
                return;
            }
            else {
                const newLike = new Like_1.default({ userId, businessId });
                yield newLike.save();
                res.status(201).json({ message: "Business liked", like: newLike });
                return;
            }
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    });
}
function getLikedBusinesses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const likes = yield Like_1.default.find({ userId, liked: true }).populate("businessId");
            res.status(200).json(likes);
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    });
}
