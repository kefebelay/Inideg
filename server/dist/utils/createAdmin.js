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
exports.createDefaultAdmin = createDefaultAdmin;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function createDefaultAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        const existingAdmin = yield User_1.default.findOne({ role: "admin" });
        if (!existingAdmin) {
            const hashedPassword = yield bcrypt_1.default.hash(process.env.ADMIN_PASS, 10);
            const adminUser = new User_1.default({
                name: "Admin",
                username: "admin",
                email: "admin@admin.com",
                password: hashedPassword,
                role: "admin",
                age: 30,
            });
            yield adminUser.save();
            console.log("✅ Default admin created");
        }
        else {
            console.log("ℹ️ Admin already exists");
        }
    });
}
