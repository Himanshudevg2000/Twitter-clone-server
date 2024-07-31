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
exports.resolvers = void 0;
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../../clients/db");
const jwt_1 = __importDefault(require("../../services/jwt"));
const queries = {
    verifyGoogleToken: (parent_1, _a) => __awaiter(void 0, [parent_1, _a], void 0, function* (parent, { token }) {
        var _b, _c, _d;
        const googleToken = token;
        // console.log('googleToken: ', googleToken);
        const googleOAuthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
        googleOAuthURL.searchParams.set("id_token", googleToken);
        const { data } = yield axios_1.default.get(googleOAuthURL.toString(), {
            responseType: "json",
        });
        const user = yield db_1.prismaClient.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            yield db_1.prismaClient.user.create({
                data: {
                    email: (_b = data.email) !== null && _b !== void 0 ? _b : "",
                    firstName: (_c = data.given_name) !== null && _c !== void 0 ? _c : "",
                    lastName: (_d = data.family_name) !== null && _d !== void 0 ? _d : "",
                    profileImageURL: data.picture,
                },
            });
        }
        const userInDb = yield db_1.prismaClient.user.findUnique({
            where: { email: data.email },
        });
        if (!userInDb)
            throw new Error("User with email not found");
        const userToken = yield jwt_1.default.generateTokenForUser(userInDb);
        // console.log('userToken: ', userToken);
        return userToken;
    }),
    getCurrentUser: (parent, arg, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // return ctx.user;
        const id = (_a = ctx.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            return null;
        const user = yield db_1.prismaClient.user.findUnique({ where: { id } });
        return user;
    }),
};
exports.resolvers = { queries };
