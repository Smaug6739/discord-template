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
            name: 'admin-shop',
            aliases: [],
            args: [],
            description: 'Give coins to a user.',
            category: 'Economy',
            cooldown: 5,
            userPermissions: [],
            botPermissions: [],
            subCommands: [
                {
                    name: 'add',
                    description: 'Add item to the shop.',
                    args: [
                        {
                            name: 'name',
                            description: 'Name of object',
                            type: 'STRING',
                            required: true
                        },
                        {
                            name: 'price',
                            description: 'Price of object',
                            type: 'STRING',
                            required: true
                        },
                        {
                            name: 'description',
                            description: 'Description of object',
                            type: 'STRING',
                            required: true
                        },
                    ],
                },
                {
                    name: 'rem',
                    description: 'Remove item to the shop or remove all items.',
                    args: [
                        {
                            name: 'item',
                            description: 'Remove object of shop',
                            type: 'STRING',
                            required: true
                        }
                    ],
                },
            ],
        });
    }
    execute(interaction, args, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (interaction.subcommand) {
                case 'add':
                    if (settings.shop.length > 19)
                        return interaction.replyErrorMessage(`Your guild has reached the maximum number of items that can be contained in the shop (20).`);
                    const objetName = args.get('name').value;
                    const itemPrice = parseInt(args.get('price').value);
                    const objetDescription = args.get('description').value;
                    if (objetName.length > 30)
                        return interaction.replyErrorMessage(`You cannot choose a name longer than 30 characters.`);
                    if (objetDescription.length > 300)
                        return interaction.replyErrorMessage(`You cannot choose a description longer than 300 characters.`);
                    if (isNaN(itemPrice))
                        return interaction.replyErrorMessage(`The price must be a number. No \`${itemPrice}\` .`);
                    if (itemPrice > 10000)
                        return interaction.replyErrorMessage(`You cannot choose a price longer than 10000 ${this.emojis.coins}.`);
                    if (settings.shop) {
                        let existObj = settings.shop.find(e => e.name == objetName);
                        if (existObj)
                            return interaction.replyErrorMessage(`An item with this name already exist.`);
                        let arr = [];
                        arr = settings.shop;
                        arr.push({
                            name: objetName,
                            price: itemPrice,
                            description: objetDescription,
                            redwareRole: '',
                            redwareMemberID: ''
                        });
                        yield this.db.updateGuild(interaction.guild, { shop: arr });
                        interaction.replySuccessMessage(`The item \`${objetName}\` has been created.`);
                    }
                    break;
                case 'rem':
                    if (settings.shop) {
                        if (args.get('item').value === 'all') {
                            yield this.db.updateGuild(interaction.guildID, { shop: [] });
                            return interaction.replySuccessMessage(`Every items have been deleted.`);
                        }
                        else {
                            const title = args.get('item').value;
                            let objet = settings.shop.find(e => e.name === title);
                            if (objet) {
                                this.db.updateGuild(interaction.guildID, { $pull: { shop: { name: title } } });
                                interaction.replySuccessMessage(`Item deleted.`);
                            }
                            else
                                return interaction.replyErrorMessage(`Item not found.`);
                        }
                    }
                    else
                        return interaction.replyErrorMessage(`No item found.`);
                    break;
            }
        });
    }
}
exports.default = default_1;
