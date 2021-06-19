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
const CommandClass_1 = __importDefault(require("../CommandClass"));
class default_1 extends CommandClass_1.default {
    constructor(bot) {
        super(bot, {
            name: 'pay',
            aliases: [],
            args: [
                {
                    name: 'user',
                    description: 'User to pay',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'money',
                    description: 'Money to give.',
                    type: 'STRING',
                    required: true
                },
            ],
            description: 'Give coins to a user.',
            category: 'Economy',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: [],
        });
    }
    execute(interaction, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbUserInteraction = yield this.db.getUser(interaction.user, interaction.guild.id);
            if (!dbUserInteraction)
                return interaction.replyErrorMessage('User not found.');
            const userMention = yield this.util.resolveMember(interaction.guild, args.get('user').value);
            if (!userMention)
                return interaction.replyErrorMessage('User not found.');
            const dbUserMention = yield this.db.getUser(interaction.user, interaction.guild.id);
            const moneyToGive = parseInt(args.get('money').value);
            if (isNaN(moneyToGive))
                return interaction.replyErrorMessage('Please enter a valid number.');
            if (userMention.id === interaction.user.id)
                return interaction.replyErrorMessage(`You can't give coins to you.`);
            if (dbUserInteraction.coins < moneyToGive)
                return interaction.replyErrorMessage(`You don't have enough coins for this. You can have coins with the command \`daily\` `);
            if (!dbUserMention) {
                yield this.db.createUser({
                    guildID: userMention.guild.id,
                    guildName: userMention.guild.name,
                    userID: userMention.id,
                    username: userMention.user.tag,
                    coins: moneyToGive,
                    daily: Date.now(),
                });
                yield this.db.updateUser(interaction.guild.id, interaction.user.id, {
                    coins: (dbUserInteraction.coins - moneyToGive)
                });
                interaction.replySuccessMessage(`You have give **${moneyToGive}** ${this.emojis.coins} to ${userMention.user.username}`);
            }
            else {
                yield this.db.updateUser(interaction.guild.id, interaction.user.id, {
                    coins: (dbUserInteraction.coins - moneyToGive)
                });
                yield this.db.updateUser(interaction.guild.id, userMention.id, {
                    coins: (dbUserMention.coins + moneyToGive)
                });
                interaction.replySuccessMessage(`You have give **${moneyToGive}** ${this.emojis.coins} to ${userMention.user.username} !`);
            }
        });
    }
}
exports.default = default_1;