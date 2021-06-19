import type Bot from '../main';
import { ICommandOptions, ICommandInfosArgs } from '../typescript/interfaces';
export default class Command {
	protected bot;
	public emojis;
	public colors;
	public util;
	protected name: string;
	protected aliases: string[];
	protected args: Array<ICommandInfosArgs>;
	protected category: string;
	protected description: string;
	protected cooldown: number;
	protected userPermissions: string[];
	protected botPermissions: string[];
	protected subCommands: string[];
	constructor(bot: typeof Bot, options: ICommandOptions) {
		this.bot = bot;
		this.emojis = this.bot.emojis;
		this.colors = this.bot.colors;
		this.util = this.bot.util;
		this.name = options.name
		this.aliases = options.aliases
		this.args = options.args
		this.category = options.category
		this.description = options.description
		this.cooldown = options.cooldown
		this.userPermissions = options.userPermissions
		this.botPermissions = options.botPermissions
		this.subCommands = options.subCommands
	}
}