"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "$uper@12345";
class JWTService {
    static generateTokenForUser(user) {
        const payload = {
            id: user === null || user === void 0 ? void 0 : user.id,
            email: user === null || user === void 0 ? void 0 : user.email,
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET);
        console.log('token: ', token);
        return token;
    }
    static decodeToken(token) {
        try {
            console.log('decodetoken: ', token);
            return jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (_a) {
            return null;
        }
    }
}
exports.default = JWTService;
