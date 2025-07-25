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
exports.createCategory = createCategory;
exports.getCategories = getCategories;
exports.getCategory = getCategory;
exports.deleteCategory = deleteCategory;
const Category_1 = __importDefault(require("../models/Category"));
const cloudinary_config_1 = __importDefault(require("../cloudinary.config"));
const streamifier_1 = __importDefault(require("streamifier"));
function createCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            console.log(process.env.API_KEY);
            if (!name) {
                res.status(400).json({ error: "Category name is required" });
                return;
            }
            const existing = yield Category_1.default.findOne({ name: name.trim() });
            if (existing) {
                res.status(409).json({ error: "Category already exists" });
                return;
            }
            let imageUrl;
            if (req.file) {
                const streamUpload = () => new Promise((resolve, reject) => {
                    const stream = cloudinary_config_1.default.uploader.upload_stream({ folder: "categories" }, (error, result) => {
                        if (error)
                            reject(error);
                        else
                            resolve(result);
                    });
                    streamifier_1.default.createReadStream(req.file.buffer).pipe(stream);
                });
                const result = yield streamUpload();
                imageUrl = result.secure_url;
            }
            const category = new Category_1.default({ name: name.trim(), image: imageUrl });
            const saved = yield category.save();
            res.status(201).json({ message: "Category created", category: saved });
        }
        catch (err) {
            console.error("Create category error:", err);
            res.status(500).json({ error: "Server error" });
        }
    });
}
function getCategories(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const category = yield Category_1.default.find();
            res
                .status(200)
                .json({ message: "Categories fetched", categories: category });
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    });
}
function getCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const category = yield Category_1.default.findById(req.params.id);
            if (!category) {
                res.status(404).json({ error: "Category not found" });
                return;
            }
            res.status(200).json({ message: "Category fetched", category: category });
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    });
}
function deleteCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const category = yield Category_1.default.findById(req.params.id);
            if (!category) {
                res.status(404).json({ error: "Category not found" });
                return;
            }
            if (category.image) {
                const urlSegments = category.image.split("/");
                const publicIdWithExtension = urlSegments.slice(-2).join("/");
                const publicId = publicIdWithExtension.split(".")[0];
                if (publicId) {
                    yield cloudinary_config_1.default.uploader.destroy(publicId);
                }
            }
            yield Category_1.default.findByIdAndDelete(req.params.id);
            res.status(200).json({
                message: `Category '${category.name}' and its image have been deleted.`,
            });
        }
        catch (err) {
            console.error("Delete category error:", err);
            res.status(500).json({ error: "Server error during deletion." });
        }
    });
}
