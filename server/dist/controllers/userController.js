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
exports.createUser = createUser;
exports.deleteUser = deleteUser;
exports.getuser = getuser;
exports.getUsers = getUsers;
exports.updateUser = updateUser;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cloudinary_config_1 = __importDefault(require("../cloudinary.config"));
const streamifier_1 = __importDefault(require("streamifier"));
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password, username, age, role } = req.body;
            if (!name || !email || !password || !username || !age) {
                res.status(400).json({ error: "Missing required fields" });
                return;
            }
            const existing = yield User_1.default.findOne({ $or: [{ email }, { username }] });
            if (existing) {
                res.status(409).json({ error: "Email or username already in use" });
                return;
            }
            let profileUrl;
            if (req.file) {
                const streamUpload = () => new Promise((resolve, reject) => {
                    const stream = cloudinary_config_1.default.uploader.upload_stream({ folder: "user_profiles" }, (error, result) => {
                        if (error)
                            reject(error);
                        else
                            resolve(result);
                    });
                    streamifier_1.default.createReadStream(req.file.buffer).pipe(stream);
                });
                const result = yield streamUpload();
                profileUrl = result.secure_url;
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = new User_1.default({
                name,
                email,
                age,
                password: hashedPassword,
                username,
                role,
                profile: profileUrl,
            });
            const saved = yield user.save();
            res.status(201).json({ message: "User created successfully", user: saved });
        }
        catch (err) {
            console.error("Create user error:", err);
            res.status(500).json({ error: "Server error" });
        }
    });
}
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findByIdAndDelete(req.params.id);
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            res
                .status(200)
                .json({ message: `user ${user === null || user === void 0 ? void 0 : user.name} deleted successfully` });
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
}
function getuser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User_1.default.findById(req.params.id);
        res.status(200).json({ user: user });
    });
}
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield User_1.default.find();
            res.status(200).json({ users: users });
        }
        catch (err) {
            res.json(err);
        }
    });
}
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let profileUrl = req.body.profile;
            if (req.file) {
                const streamUpload = () => new Promise((resolve, reject) => {
                    const stream = cloudinary_config_1.default.uploader.upload_stream({ folder: "user_profiles" }, (error, result) => {
                        if (error)
                            reject(error);
                        else
                            resolve(result);
                    });
                    streamifier_1.default.createReadStream(req.file.buffer).pipe(stream);
                });
                const result = yield streamUpload();
                profileUrl = result.secure_url;
            }
            const updatedUser = yield User_1.default.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, req.body), { profile: profileUrl }), { new: true });
            if (!updatedUser) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            res.status(200).json({
                message: "Profile updated successfully",
                user: updatedUser,
            });
        }
        catch (err) {
            console.error("User update error:", err);
            res.status(500).json({ error: "Update failed" });
        }
    });
}
