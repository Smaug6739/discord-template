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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../models/index");
const mongoose_1 = require("mongoose");
class DbFunctions {
    constructor(bot) {
        this.bot = bot;
    }
    createGuild(guildID, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const merged = Object.assign({ _id: mongoose_1.Types.ObjectId() }, Object.assign({ guildID: guildID }, data));
            const createGuild = new index_1.Guild(merged);
            yield createGuild.save();
            return true;
        });
    }
    getGuild(guildID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!guildID)
                return null;
            const guildDB = yield this.bot.models.Guild.findOne({ guildID: guildID });
            if (guildDB)
                return guildDB;
            yield this.createGuild(guildID);
            return yield this.bot.models.Guild.findOne({ guildID: guildID });
        });
    }
    updateGuild(guildID, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.getGuild(guildID);
            if (typeof data !== "object")
                data = {};
            for (const key in settings) {
                if (data[key] !== settings[key])
                    data[key] = settings[key];
            }
            return data.updateOne(settings);
        });
    }
    deleteGuild(guildID) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.getGuild(guildID);
            if (data)
                return yield data.delete();
        });
    }
    createUser(guildID, userID, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const merged = Object.assign({ _id: mongoose_1.Types.ObjectId() }, Object.assign({ guildID: guildID, userID: userID }, data));
            const createGuild = new index_1.User(merged);
            yield createGuild.save();
            return true;
        });
    }
    getUser(guildID, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!guildID)
                return null;
            if (!userID)
                return null;
            const userDB = yield this.bot.models.User.findOne({ guildID: guildID, userID: userID });
            if (userDB)
                return userDB;
            return null;
        });
    }
    getUsers(guildID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!guildID)
                return null;
            const userDB = yield this.bot.models.User.find({ guildID: guildID });
            if (userDB)
                return userDB;
            return null;
        });
    }
    updateUser(guildID, userID, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.getUser(guildID, userID);
            if (typeof data !== "object")
                data = {};
            for (const key in settings) {
                if (data[key] !== settings[key])
                    data[key] = settings[key];
            }
            return data.updateOne(settings);
        });
    }
    deleteUser(guildID, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.getUser(guildID, userID);
            if (data)
                return data.delete();
        });
    }
}
exports.default = DbFunctions;
