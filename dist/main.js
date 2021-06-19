"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const config_1 = __importDefault(require("./config"));
const config_private_1 = __importDefault(require("./config.private"));
const discord_resolve_1 = require("discord-resolve");
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
discord_js_1.CommandInteraction.prototype.replySuccessMessage = function (content) {
    return this.reply(`${config_1.default.emojis.success} ${content}`);
};
discord_js_1.CommandInteraction.prototype.replyErrorMessage = function (content) {
    return this.reply(`${config_1.default.emojis.error} ${content}`);
};
class Bot {
    constructor() {
        this.client = new discord_js_1.Client({
            intents: discord_js_1.Intents.ALL,
            partials: ['CHANNEL', 'REACTION', 'USER', 'MESSAGE']
        });
        this.util = new discord_resolve_1.DiscordResolve(this.client);
        this.config = config_1.default;
        this.privateConfig = config_private_1.default;
        this.token = config_private_1.default.tokens.discord;
        this.errorHook = new discord_js_1.WebhookClient(this.privateConfig.logs.error.id, this.privateConfig.logs.error.token);
        this.owner = config_1.default.owner.username;
        this.commands = new Map();
        this.cooldowns = new Map();
        this.emojis = config_1.default.emojis;
        this.colors = config_1.default.colors;
        this.admins = config_1.default.admins;
        this.loadCommands();
        this.loadEvents();
        this.handleErrors();
        this.client.login(this.privateConfig.tokens.discord);
    }
    loadCommands(dir = './commands') {
        return __awaiter(this, void 0, void 0, function* () {
            fs_1.readdirSync(dir).filter(f => !f.endsWith('.js')).forEach((dirs) => __awaiter(this, void 0, void 0, function* () {
                const commands = fs_1.readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
                for (const file of commands) {
                    const importFile = yield Promise.resolve().then(() => __importStar(require(`./${dir}/${dirs}/${file}`)));
                    const CommandClass = importFile.default;
                    const command = new CommandClass(this);
                    this.commands.set(command.name, command);
                    console.log(`Command loaded: ${command.name}`);
                }
                ;
            }));
        });
    }
    loadEvents(dir = "./events") {
        return __awaiter(this, void 0, void 0, function* () {
            fs_1.readdirSync(dir).forEach((file) => __awaiter(this, void 0, void 0, function* () {
                const getFile = yield Promise.resolve().then(() => __importStar(require(`${dir}/${file}`))).then(e => e.default);
                const evt = new getFile(this);
                const evtName = file.split(".")[0];
                this.client.on(evtName, (...args) => evt.run(...args));
                console.log(`Event loaded: ${evtName}`);
            }));
        });
    }
    ;
    handleErrors() {
        process.on('uncaughtException', (error) => {
            console.warn(error);
            if (!this.client)
                return;
            this.errorHook.send({ content: error.toString(), code: 'js' });
        });
        process.on('unhandledRejection', (listener) => {
            console.warn(listener);
            if (!this.client)
                return;
            this.errorHook.send({ content: listener.toString(), code: 'js' });
        });
        process.on('rejectionHandled', (listener) => {
            console.warn(listener);
            if (!this.client)
                return;
            this.errorHook.send({ content: listener.toString(), code: 'js' });
        });
        process.on('warning', (warning) => {
            console.warn(warning);
            if (!this.client)
                return;
            this.errorHook.send({ content: warning.toString(), code: 'js' });
        });
    }
    log(type, options) {
        let id;
        let token;
        if (type === 'error') {
            id = this.privateConfig.logs.error.id;
            token = this.privateConfig.logs.error.token;
        }
        else {
            id = this.privateConfig.logs.info.id;
            token = this.privateConfig.logs.info.token;
        }
        const webhook = new discord_js_1.WebhookClient(id, token);
        webhook.send(options);
    }
}
const bot = new Bot();
exports.default = bot;
