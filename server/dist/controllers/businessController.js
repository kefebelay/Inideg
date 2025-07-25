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
exports.verifyBusiness = void 0;
exports.createBusiness = createBusiness;
exports.getBusinesses = getBusinesses;
exports.getBusiness = getBusiness;
exports.getBusinessAndIncrementViews = getBusinessAndIncrementViews;
exports.deleteBusiness = deleteBusiness;
exports.getMyBusiness = getMyBusiness;
exports.getMostViewedBusinesses = getMostViewedBusinesses;
exports.getMostLikedBusinesses = getMostLikedBusinesses;
exports.getMostCommentedBusinesses = getMostCommentedBusinesses;
exports.getBusinessByCategory = getBusinessByCategory;
exports.searchBusinesses = searchBusinesses;
exports.getBusinessByOwner = getBusinessByOwner;
exports.toggleBusinessLike = toggleBusinessLike;
exports.getBusinessesUserLikes = getBusinessesUserLikes;
const decorateBusiness_1 = require("../utils/decorateBusiness");
const Business_1 = __importDefault(require("../models/Business"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_config_1 = __importDefault(require("../cloudinary.config"));
function createBusiness(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingBusiness = yield Business_1.default.findOne({
                name: req.body.name,
            });
            if (existingBusiness) {
                res.status(400).json({ error: "Business already exists" });
                return;
            }
            const files = req.files;
            const uploadedImages = [];
            for (const file of files) {
                const result = yield cloudinary_config_1.default.uploader.upload(file.path, {
                    folder: "business_profiles",
                });
                uploadedImages.push(result.secure_url);
                fs_1.default.unlink(file.path, (err) => {
                    if (err) {
                        console.error("Failed to delete local file:", file.path, err);
                    }
                });
            }
            const business = new Business_1.default(Object.assign(Object.assign({}, req.body), { profile: uploadedImages, likes: [] }));
            const savedBusiness = yield business.save();
            if (!savedBusiness) {
                res.status(500).json({ error: "Failed to create business" });
                return;
            }
            res
                .status(201)
                .json({ message: "Business created", business: savedBusiness });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });
}
function getBusinesses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.query.userId;
            const businesses = yield Business_1.default.find()
                .populate("owner")
                .populate("category")
                .lean();
            const decorated = (0, decorateBusiness_1.decorateBusinesses)(businesses, userId);
            res.status(200).json({
                message: "Businesses fetched",
                businesses: decorated,
            });
        }
        catch (err) {
            console.error("getBusinesses error:", err);
            res.status(500).json({ error: err.message });
        }
    });
}
function getBusiness(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const { userId } = req.query;
            const business = yield Business_1.default.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
                .populate("owner")
                .populate("category")
                .lean();
            if (!business) {
                res.status(404).json({ error: "Business not found" });
                return;
            }
            const isLiked = Boolean(userId && ((_a = business.likes) === null || _a === void 0 ? void 0 : _a.some((id) => id.toString() === userId)));
            res.status(200).json({
                message: "Business fetched",
                business: Object.assign(Object.assign({}, business), { isLiked, likes: ((_b = business.likes) === null || _b === void 0 ? void 0 : _b.map((id) => id.toString())) || [] }),
            });
        }
        catch (err) {
            console.error("GetBusiness error:", err);
            res.status(500).json({ error: err.message });
        }
    });
}
function getBusinessAndIncrementViews(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { userId } = req.query;
            const business = yield Business_1.default.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
                .populate("owner")
                .populate("category")
                .lean();
            if (!business) {
                res.status(404).json({ error: "Business not found" });
                return;
            }
            const isLiked = userId && ((_a = business.likes) === null || _a === void 0 ? void 0 : _a.some((id) => id.toString() === userId));
            res.status(200).json({
                message: "Business fetched",
                business: Object.assign(Object.assign({}, business), { isLiked: Boolean(isLiked), likes: business.likes.map((id) => id.toString()) }),
            });
        }
        catch (err) {
            console.error("Error:", err);
            res.status(500).json({ error: err.message });
        }
    });
}
function deleteBusiness(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const business = yield Business_1.default.findByIdAndDelete(req.params.id);
            if (!business) {
                res.status(404).json({ error: "Business not found" });
                return;
            }
            res
                .status(200)
                .json({ message: `Business ${business.name} deleted successfully` });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function getMyBusiness(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const businesses = yield Business_1.default.find({ owner: req.params.ownerId })
                .populate("owner")
                .populate("category")
                .populate("likes");
            if (!businesses || businesses.length === 0) {
                res.status(404).json({ error: "No businesses found" });
                return;
            }
            res.status(200).json({ message: "Businesses fetched", businesses });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function getMostViewedBusinesses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const businesses = yield Business_1.default.find()
                .sort({ views: -1 })
                .populate("owner")
                .populate("category")
                .populate("likes");
            res.status(200).json({ message: "Most viewed businesses", businesses });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function getMostLikedBusinesses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const businesses = yield Business_1.default.aggregate([
                {
                    $addFields: {
                        likesCount: { $size: "$likes" },
                    },
                },
                {
                    $sort: { likesCount: -1 },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                    },
                },
                { $unwind: "$owner" },
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category",
                    },
                },
                { $unwind: "$category" },
            ]);
            res.status(200).json({ message: "Most liked businesses", businesses });
        }
        catch (err) {
            console.error("Most Liked Businesses Error:", err);
            res.status(500).json({ error: err.message });
        }
    });
}
function getMostCommentedBusinesses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const businesses = yield Business_1.default.find()
                .sort({ comments: -1 })
                .populate("owner")
                .populate("category")
                .populate("likes");
            res.status(200).json({ message: "Most commented businesses", businesses });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function getBusinessByCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.query;
            const { categoryId } = req.params;
            const items = yield Business_1.default.find({ category: categoryId })
                .populate("owner")
                .populate("category")
                .lean();
            if (!items || items.length === 0) {
                res.status(404).json({ error: "No items found in this category" });
                return;
            }
            const decorated = items.map((item) => {
                var _a;
                const likeIds = ((_a = item.likes) === null || _a === void 0 ? void 0 : _a.map((id) => id.toString())) || [];
                return Object.assign(Object.assign({}, item), { isLiked: userId ? likeIds.includes(userId.toString()) : false, likes: likeIds });
            });
            res.status(200).json({
                message: "Items fetched",
                businesses: decorated,
            });
        }
        catch (err) {
            console.error("getBusinessByCategory error:", err);
            res.status(500).json({ error: err.message });
        }
    });
}
function searchBusinesses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { query } = req.query;
            if (!query || typeof query !== "string") {
                res.status(400).json({ error: "Invalid search query" });
                return;
            }
            const businesses = yield Business_1.default.find({
                name: { $regex: query, $options: "i" },
            })
                .populate("owner")
                .populate("category")
                .populate("likes");
            res.status(200).json({ message: "Search results", businesses });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function getBusinessByOwner(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.query.userId;
            const ownerId = req.params.ownerId;
            const businesses = yield Business_1.default.find({ owner: ownerId })
                .populate("owner")
                .populate("category")
                .populate("likes")
                .lean();
            const decorated = (0, decorateBusiness_1.decorateBusinesses)(businesses, userId);
            res
                .status(200)
                .json({ message: "Owner's businesses", businesses: decorated });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
const mongoose_1 = __importDefault(require("mongoose"));
function toggleBusinessLike(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { businessId, userId } = req.body;
            const business = yield Business_1.default.findById(businessId);
            if (!business) {
                res.status(404).json({ error: "Business not found" });
                return;
            }
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId); //
            const alreadyLiked = business.likes.some((id) => id.toString() === userId);
            if (alreadyLiked) {
                business.likes = business.likes.filter((id) => id.toString() !== userId);
            }
            else {
                business.likes.push(userObjectId);
            }
            yield business.save();
            res.status(200).json({
                message: alreadyLiked ? "Unliked" : "Liked",
            });
        }
        catch (err) {
            console.error("Toggle Like Error:", err);
            res.status(500).json({ error: err.message });
        }
    });
}
function getBusinessesUserLikes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.params.userId;
            const businesses = yield Business_1.default.find({ likes: userId })
                .populate("owner")
                .populate("category")
                .populate("likes");
            res.status(200).json({ message: "User's liked businesses", businesses });
        }
        catch (err) {
            console.error("Get User Liked Businesses Error:", err);
            res.status(500).json({ error: err.message });
        }
    });
}
const verifyBusiness = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { isVerified } = req.body;
    try {
        const business = yield Business_1.default.findByIdAndUpdate(id, { isVerified }, { new: true });
        if (!business) {
            res.status(404).json({ message: "Business not found" });
            return;
        }
        res.status(200).json({
            message: "Business verification status updated",
            business,
        });
    }
    catch (error) {
        console.error("Verification update error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.verifyBusiness = verifyBusiness;
