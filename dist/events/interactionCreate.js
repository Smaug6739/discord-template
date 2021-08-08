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
class default_1 {
    constructor(bot) {
        this.bot = bot;
    }
    run(interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isCommand())
                return;
            let member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member)
                member = yield interaction.guild.members.fetch(interaction.user.id);
            /* -----------------COMMAND----------------- */
            const command = this.bot.commands.get(interaction.commandName);
            if (!command)
                return;
            if (command.userPermissions.includes('BOT_ADMIN') && !this.bot.admins.includes(interaction.user.id)) {
                return interaction.replyErrorMessage(`You don't have permissions for use this command.`);
            }
            if (command.userPermissions.length) {
                for (const permission of command.userPermissions) {
                    if (!((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(interaction.user.id).permissions.has(permission)))
                        return interaction.replyErrorMessage(`You need the \`${command.userPermissions.map((command) => command.split("_").map(x => x[0] + x.slice(1).toLowerCase()).join(" ")).join(', ')}\` permission(s) for use this command.`);
                }
            }
            if (command.botPermissions.length) {
                for (const permission of command.botPermissions) {
                    if (!interaction.guild.me.permissions.has(permission))
                        return interaction.replyErrorMessage(`I need the \`${command.botPermissions.map((command) => command.split("_").map(x => x[0] + x.slice(1).toLowerCase()).join(" ")).join(', ')}\` permission(s) for this command.`);
                }
            }
            /* ---------------COOLDOWNS--------------- */
            if (!this.bot.admins.includes(interaction.user.id)) {
                if (!this.bot.cooldowns.has(command.help.name)) {
                    this.bot.cooldowns.set(command.help.name, new Map());
                }
                ;
                const timeNow = Date.now();
                const tStamps = this.bot.cooldowns.get(command.help.name);
                const cdAmount = (command.help.cooldown || 5) * 1000;
                if (tStamps.has(interaction.user.id)) {
                    const cdExpirationTime = tStamps.get(interaction.user.id) + cdAmount;
                    if (timeNow < cdExpirationTime) {
                        const timeLeft = (cdExpirationTime - timeNow) / 1000;
                        return interaction.replyErrorMessage(`Please wait ${timeLeft.toFixed(0)} second(s) before using the command \`${command.help.name}\` again .`);
                    }
                }
                tStamps.set(interaction.user.id, timeNow);
                setTimeout(() => tStamps.delete(interaction.user.id), cdAmount);
            }
            /* ---------------SUB-COMMAND--------------- */
            interaction.subcommand = interaction.options.getSubcommand(false);
            //interaction.subcommand = interaction.options
            /* ---------------OPTIONS--------------- */
            let args = interaction.options;
            // if (interaction.subcommand) args = interaction.options.get(interaction.subcommand)?.options;
            /* ---------------COMMAND--------------- */
            try {
                yield command.execute(interaction, args);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
exports.default = default_1;
