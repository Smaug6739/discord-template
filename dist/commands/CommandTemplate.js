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
const discord_js_1 = require("discord.js");
const CommandClass_1 = __importDefault(require("./CommandClass"));
class default_1 extends CommandClass_1.default {
    constructor(bot) {
        super(bot, {
            name: 'NAME',
            aliases: [],
            args: [
                {
                    name: 'NAME_ARG',
                    description: 'DESCRIPTION_ARG',
                    type: 'STRING',
                    required: true
                },
            ],
            description: 'DESCRIPTION',
            category: 'CATEGORY',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: [],
        });
    }
    execute(interaction, args, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(interaction);
            console.log(args);
            console.log(settings);
            console.log(discord_js_1.MessageEmbed);
        });
    }
}
exports.default = default_1;
