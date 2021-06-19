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
const CommandClass_1 = __importDefault(require("../CommandClass"));
const canvas_1 = __importDefault(require("canvas"));
class default_1 extends CommandClass_1.default {
    constructor(bot) {
        super(bot, {
            name: 'rank',
            aliases: [],
            args: [
                {
                    name: 'user',
                    description: 'User to be banned',
                    type: 'STRING',
                    required: false
                },
            ],
            description: 'View rank of user',
            category: 'Experience',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: [],
        });
    }
    execute(interaction, args, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!settings.expsysteme)
                return interaction.replyErrorMessage(`The experience system is not activated on this server. To activate it use the command \`/config experience\`.`);
            let dbUser;
            let user;
            if (args.get('user')) {
                user = yield this.bot.util.resolveMember(interaction.guild, args.get('user').value);
                user = user.user;
                if (!user)
                    return interaction.replyErrorMessage('User not found.');
                dbUser = yield this.bot.db.getUser(interaction.guild.id, user.id);
                if (!dbUser)
                    return interaction.replyErrorMessage('User not found.');
            }
            else {
                dbUser = yield this.bot.db.getUser(interaction.guild.id, interaction.user.id);
                if (!dbUser)
                    return interaction.replyErrorMessage('User not found');
                user = interaction.user;
            }
            let progress = dbUser.experience;
            progress = 0.1 * Math.sqrt(dbUser.experience);
            progress = progress.toFixed(2);
            progress = progress.split(".");
            progress.shift();
            const applyText = (canvas, text) => {
                const ctx = canvas.getContext('2d');
                let fontSize = 60;
                do {
                    ctx.font = `${fontSize -= 10}px sans-serif`;
                } while (ctx.measureText(text).width > canvas.width - 350);
                return ctx.font;
            };
            const canvas = canvas_1.default.createCanvas(700, 220);
            const ctx = canvas.getContext('2d');
            const background = yield canvas_1.default.loadImage(settings.rankcard);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#74037b';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            ctx.font = '30px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`Level : ${dbUser.level}`, canvas.width / 2.5, canvas.height / 2);
            ctx.fillText(`Experience : ${dbUser.experience}xp`, canvas.width / 2.5, canvas.height / 1.57);
            ctx.fillText(`Votre progression : ${progress}%`, canvas.width / 2.5, canvas.height / 1.27);
            ctx.font = applyText(canvas, `${user.username}!`);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${dbUser.username}!`, canvas.width / 2.5, canvas.height / 3.5);
            ctx.beginPath();
            ctx.arc(106, 106, 83, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.clip();
            const avatar = yield canvas_1.default.loadImage(user.displayAvatarURL({ format: 'jpg' }));
            ctx.drawImage(avatar, 22, 22, 165, 165);
            const attachment = new discord_js_1.MessageAttachment(canvas.toBuffer(), 'rank-image.png');
            return interaction.reply({ files: [attachment] });
        });
    }
}
exports.default = default_1;