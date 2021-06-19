import type { IConfig, IEmojis, IColors, IWebhookSend } from './typescript/interfaces';
import config from './config';
import privateConfig from './config.private';
import { DiscordResolve } from 'discord-resolve';
import { Client, Intents, WebhookClient, CommandInteraction } from 'discord.js';
import { readdirSync } from 'fs';

declare module 'discord.js' {
	interface CommandInteraction {
		replySuccessMessage(content: string): any
		replyErrorMessage(content: string): any
	}
}

CommandInteraction.prototype.replySuccessMessage = function (content: string) {
	return this.reply(`${config.emojis.success} ${content}`);
};
CommandInteraction.prototype.replyErrorMessage = function (content: string) {
	return this.reply(`${config.emojis.error} ${content}`);
};

class Bot {
	public client: Client;
	private errorHook: WebhookClient;
	public owner: string;
	public admins: string[];
	public commands: Map<string, any>;
	public cooldowns: Map<string, any>;
	protected config: IConfig;
	private privateConfig: IConfig;
	public token: string;
	public models: any;
	public util: DiscordResolve;
	public emojis: IEmojis;
	public colors: IColors;
	constructor() {
		this.client = new Client({
			intents: Intents.ALL,
			partials: ['CHANNEL', 'REACTION', 'USER', 'MESSAGE']
		})
		this.util = new DiscordResolve(this.client);
		this.config = config;
		this.privateConfig = privateConfig;
		this.token = privateConfig.tokens.discord;
		this.errorHook = new WebhookClient(this.privateConfig.logs.error.id, this.privateConfig.logs.error.token);
		this.owner = config.owner.username;
		this.commands = new Map();
		this.cooldowns = new Map();
		this.emojis = config.emojis;
		this.colors = config.colors;
		this.admins = config.admins;
		this.loadCommands();
		this.loadEvents();
		this.handleErrors();
		this.client.login(this.privateConfig.tokens.discord)
	}
	private async loadCommands(dir = './commands') {
		readdirSync(dir).filter(f => !f.endsWith('.js')).forEach(async dirs => {
			const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
			for (const file of commands) {
				const importFile = await import(`./${dir}/${dirs}/${file}`);
				const CommandClass = importFile.default;
				const command = new CommandClass(this);
				this.commands.set(command.name, command);
				console.log(`Command loaded: ${command.name}`);
			};
		});
	}
	private async loadEvents(dir = "./events") {
		readdirSync(dir).forEach(async file => {
			const getFile = await import(`${dir}/${file}`).then(e => e.default)
			const evt = new getFile(this);
			const evtName = file.split(".")[0];
			this.client.on(evtName, (...args: any) => evt.run(...args));
			console.log(`Event loaded: ${evtName}`);
		});
	};

	private handleErrors() {
		process.on('uncaughtException', (error) => {
			console.warn(error);
			if (!this.client) return;
			this.errorHook.send({ content: error.toString(), code: 'js' });
		});
		process.on('unhandledRejection', (listener) => {
			console.warn(listener);
			if (!this.client) return;
			this.errorHook.send({ content: listener!.toString(), code: 'js' });
		});
		process.on('rejectionHandled', (listener) => {
			console.warn(listener);
			if (!this.client) return;
			this.errorHook.send({ content: listener.toString(), code: 'js' });
		});
		process.on('warning', (warning) => {
			console.warn(warning);
			if (!this.client) return;
			this.errorHook.send({ content: warning.toString(), code: 'js' });
		});
	}
	public log(type: string, options: IWebhookSend) {
		let id;
		let token;
		if (type === 'error') {
			id = this.privateConfig.logs.error.id
			token = this.privateConfig.logs.error.token
		} else {
			id = this.privateConfig.logs.info.id
			token = this.privateConfig.logs.info.token
		}
		const webhook = new WebhookClient(id, token);
		webhook.send(options)
	}

}
const bot = new Bot();
export default bot;