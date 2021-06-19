import Command from '../CommandClass';
import type { ICommandInteraction } from '../../typescript/interfaces';



export default class extends Command {

	constructor(bot: any) {
		super(bot, {
			name: 'restart',
			aliases: [],
			args: [],
			description: 'Restart the bot.',
			category: 'Admin',
			cooldown: 5,
			userPermissions: ['BOT_ADMIN'],
			botPermissions: [],
			subCommands: [],
		})
	}
	async execute(interaction: ICommandInteraction) {
		await interaction.replySuccessMessage(`OK .`)
		process.exit();

	}
}