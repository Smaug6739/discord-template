import Command from '../CommandClass';
import type { ICommandInteraction, ICommandArgs } from '../../typescript/interfaces';
import { MessageEmbed, TextChannel } from 'discord.js';
import type { Role } from 'discord.js';
import moment from 'moment';

export default class extends Command {

	constructor(bot: any) {
		super(bot, {
			name: 'infos',
			aliases: [],
			options: [],
			description: 'Get informations',
			category: 'Other',
			cooldown: 5,
			userPermissions: [],
			botPermissions: [],
			subCommands: [
				{
					name: 'user',
					description: 'Allows to have information about a user.',
					options: [
						{
							name: 'user',
							description: 'User to get infos',
							type: 'STRING',
							required: true
						},
					],
				},
				{
					name: 'bot',
					description: 'Allows to have information about bot.',
				},
				{
					name: 'server',
					description: 'Allows to have information about server.',
				},
				{
					name: 'role',
					description: 'Allows to have information about role.',
					options: [
						{
							name: 'role',
							description: 'Role to get infos',
							type: 'STRING',
							required: true
						},
					],
				},
				{
					name: 'channel',
					description: 'Allows to have information about channel.',
					options: [
						{
							name: 'channel',
							description: 'Channel to get infos',
							type: 'STRING',
							required: true
						},
					],
				}
			],
		})
	}
	async execute(interaction: ICommandInteraction, args: ICommandArgs) {
		switch (interaction.subcommand) {
			case 'user':
				const argUser = args.get('user').value
				const userInfo = await this.bot.util.resolveMember(interaction.guild!, argUser)
				if (!userInfo) {
					this.bot.client.users.fetch(args.get('user').value)
						.then(u => {
							let BOTSTATUS;
							if (!u) return interaction.replyErrorMessage(`User not found.`)
							if (u.bot) BOTSTATUS = 'yes'
							else BOTSTATUS = 'no'
							const embedUser = new MessageEmbed()
								.setAuthor(`${u.username}#${u.discriminator}`, `${u.displayAvatarURL()}`)
								.setColor(this.colors.embed)
								.setThumbnail(u.displayAvatarURL())
								.addField(`\u200b`, `BOT : ${BOTSTATUS}`)
								.setDescription('This user is no on the server.')
								.setFooter(`User ID : ${u.id}`)
							return interaction.reply({ embeds: [embedUser] })
						})
						.catch(() => interaction.replyErrorMessage(`User not found.`))
					break;

				} else {
					//if (use.user.presence.status === 'online') status = `${this.bot.emojis.ONLINE}Online`  ;
					//if (use.user.presence.status === 'idle') status = `${this.bot.emojis.IDLE}Idle`;
					//if (use.user.presence.status === 'dnd') status = `${this.bot.emojis.DND}Dnd`;
					//if (use.user.presence.status === 'offline') status = `${this.bot.emojis.OFFLINE}Offline`;
					//if (use.user.presence.clientStatus != null && use.user.presence.clientStatus.desktop === 'online') plateforme = '🖥️ Ordinateur'
					//if (use.user.presence.clientStatus != null && use.user.presence.clientStatus.mobile === 'online') plateforme = '📱 Mobile'
					let permissions_arr = userInfo.permissions.toArray().join(', ');
					let permissions = permissions_arr.toString()
					permissions = permissions.replace(/\_/g, ' ');
					const embedMember = new MessageEmbed()
					embedMember.setThumbnail(userInfo.user.displayAvatarURL())
					embedMember.setColor(this.colors.embed)
					embedMember.setTitle(`${userInfo.user.username}`)
					embedMember.addField('ID :', `${userInfo.user.id}`, true)
					embedMember.addField('Tag :', `${userInfo.user.tag}`, true)
					embedMember.addField('Joigned :', `${moment.utc(userInfo.joinedAt).format('DD/MM/YYYY - hh:mm')}`, true)//OK --------- IDLE
					embedMember.addField('Account created :', `${moment.utc(userInfo.user.createdAt).format('DD/MM/YYYY - hh:mm')}`, true)//
					embedMember.addField('Roles :', `${userInfo.roles.cache.map((r: Role) => r.toString()).join('')}`)//OK            
					embedMember.addField('User information:', `** Permissions:** ${userInfo.permissions.toArray().sort().map((permissions: string) => `${permissions.split("_").map(x => x[0] + x.slice(1).toLowerCase()).join(" ")}`).join(", ") || "none"}`)//OK
					embedMember.setTimestamp();
					embedMember.setFooter(`${userInfo.user.username} ID : ${userInfo.user.id}`, userInfo.user.displayAvatarURL()) //OK
					interaction.reply({ embeds: [embedMember] });
					break;
				}
			case 'bot':
				const pck = require('../../package.json')
				const verssionBot = pck.version
				const verssionDjs = pck.dependencies["discord.js"]
				const embedBot = new MessageEmbed()
					.setColor(this.colors.embed)
					.setAuthor(`${this.bot.client.user!.username} Info`, this.bot.client.user!.displayAvatarURL())
					.setThumbnail(this.bot.client.user!.displayAvatarURL())
					.addFields(
						{ name: 'Developer', value: `Smaug#6739`, inline: true },
						{ name: 'Data', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
						{ name: 'Uptime', value: `${Math.floor(this.bot.client.uptime! / 1000 / 60).toString()} minutes`, inline: true },
						{ name: 'Servers', value: `${this.bot.client.guilds.cache.size.toString()}`, inline: true },
						{ name: 'Channels', value: `${this.bot.client.channels.cache.size.toString()}`, inline: true },
						{ name: 'Users', value: `${this.bot.client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)}`, inline: true },
						{ name: 'Version', value: `${verssionBot}`, inline: true },
						{ name: 'Library ', value: `discord.js (javascript)`, inline: true },
						{ name: 'Library verssion', value: `${verssionDjs.replace('^', '')}`, inline: true },
						{ name: 'Support', value: `[Serveur support ](https://discord.gg/TC7Qjfs)`, inline: true },
						{ name: 'Invite :', value: `[Invite](https://discord.com/oauth2/authorize?client_id=689210215488684044&scope=bot&permissions=1946446974%20applications.commands)`, inline: true },
						{ name: 'Top.gg :', value: `[Site](https://top.gg/bot/689210215488684044)`, inline: true })
					.setTimestamp()
					.setFooter(`Infos of ${this.bot.client.user!.username}. BOT ID : ${this.bot.client.user!.id}`)
				interaction.reply({ embeds: [embedBot] });
				break;
			case 'server':
				const guild_name = interaction.guild!.name;
				const owner = `<@${interaction.guild!.ownerId}>`;
				const boost = interaction.guild!.premiumSubscriptionCount;
				let boostMsg = '';
				if (!boost) boostMsg = "This server no have boost"
				else boostMsg = `Server have ${boost} boost${boost > 1 ? "s" : ""}`
				const members = interaction.guild!.memberCount;
				// interaction.guild.members.fetch().then(fetchedMembers => {     
				// const online = fetchedMembers.filter(member => member.presence.status === 'online').size;
				// const idle = fetchedMembers.filter(member => member.presence.status === 'idle').size;
				// const dnd = fetchedMembers.filter(member => member.presence.status === 'dnd').size;
				// const off = fetchedMembers.filter(member => member.presence.status === 'offline').size;
				const channel_t = interaction.guild!.channels.cache.filter(channel => channel.type === "GUILD_TEXT").size;
				const channel_v = interaction.guild!.channels.cache.filter(channel => channel.type === "GUILD_VOICE").size;
				const channel_c = interaction.guild!.channels.cache.filter(channel => channel.type === "GUILD_CATEGORY").size;
				const roles = interaction.guild!.roles.cache.size;
				const salons = interaction.guild!.channels.cache.size;
				const embedInfoGuild = new MessageEmbed()
				if (interaction.guild!.iconURL()) {
					embedInfoGuild.setAuthor(`${guild_name}`, `${interaction.guild!.iconURL() ? interaction.guild!.iconURL() : ''}`)
					embedInfoGuild.setThumbnail(`${interaction.guild!.iconURL()}`)
					embedInfoGuild.setFooter(`BOT ID : ${this.bot.client.user!.id}`, `${interaction.guild!.iconURL()}`);
				} else {
					embedInfoGuild.setAuthor(`${guild_name}`)
					embedInfoGuild.setFooter(`BOT ID : ${this.bot.client.user!.id}`);
				}
				embedInfoGuild.setTitle(`**Informations sur le serveur :**`)
				embedInfoGuild.setColor(this.bot.colors.embed)
				embedInfoGuild.addFields(
					{ name: 'Name', value: `${guild_name}`, inline: true },
					{ name: 'Owner', value: `${owner}`, inline: true },
					{ name: 'Members', value: `${members}`, inline: true },
					{ name: 'Channels', value: `${salons}`, inline: true },
					{ name: 'Roles', value: `${roles}`, inline: true },
					{ name: 'Chanels', value: `${this.bot.emojis.channel}Texte : ${channel_t}\n${this.bot.emojis.voice}Voice : ${channel_v}\n${this.bot.emojis.info}Categories : ${channel_c}`, inline: true },
					{ name: 'Verification level', value: `${interaction.guild!.verificationLevel}`, inline: true },
					{ name: `${this.bot.emojis.boost}Nitro(s) of server`, value: `${boostMsg}`, inline: true },
					//{ name: 'Status des membres', value: `${this.bot.emojis.ONLINE}Online : ${online}\n${this.bot.emojis.IDLE}Idle : ${idle}\n${this.bot.emojis.DND}Dnd : ${dnd}\n${this.bot.emojis.OFFLINE}Offline : ${off}`, inline: true }
				)
				embedInfoGuild.setTimestamp()
				interaction.reply({ embeds: [embedInfoGuild] })
				//});
				break;
			case 'role':
				const argRole = args.get('role').value;
				const role = this.bot.util.resolveRole(interaction.guild!, argRole);
				if (!role) return interaction.replyErrorMessage(`Role not found.`);
				let mention = '';
				let manager = '';
				let separation = '';
				if (role.mentionable) mention = 'yes'
				else mention = 'no'
				if (role.managed) manager = 'yes'
				else manager = 'no'
				const membersWithRole = interaction.guild!.roles.cache.get(role.id)?.members.size;
				if (role.hoist) separation = 'yes'
				else separation = 'no'
				const embedRole = new MessageEmbed()
					.setColor(this.colors.embed)
					.setThumbnail(`${interaction.guild!.iconURL() ? interaction.guild!.iconURL() : ''}`)
					.setAuthor(`Information of role :`, `${interaction.guild!.iconURL() ? interaction.guild!.iconURL() : ''}`)
					.setTitle(`${role.name}`)
					.addFields(
						{ name: 'Role', value: `${role}`, inline: true },
						{ name: 'Color', value: `${role.hexColor}`, inline: true },
						{ name: 'Position', value: `${role.position}`, inline: true },
						{ name: 'ID', value: `${role.id}`, inline: true },
						{ name: 'Manager :', value: `${manager}`, inline: true },
						{ name: 'Mention :', value: `${mention}`, inline: true },
						{ name: 'Members :', value: `${membersWithRole}`, inline: true },
						{ name: 'Separation :', value: `${separation}`, inline: true },
						{ name: 'Created at  :', value: `${moment.utc(role.createdTimestamp).format('DD/MM/YYYY - hh:mm')}`, inline: true },
						{ name: 'Permissions :', value: `${role.permissions.toArray().sort().map((permissions: string) => `${permissions.split("_").map(x => x[0] + x.slice(1).toLowerCase()).join(" ")}`).join(", ") || "none"}`, inline: true })
					.setTimestamp()
					.setFooter('Command module: Fun')
				interaction.reply({ embeds: [embedRole] })
				break;
			case 'channel':
				const channel = this.bot.util.resolveChannel(interaction.guild!, args.get('channel').value);
				if (!channel) return interaction.replyErrorMessage(`Channel not found.`);
				let type = '';
				let nsfw;
				if (channel.type === 'GUILD_TEXT') { type = `${this.bot.emojis.channel}Text`; if ((channel as TextChannel).nsfw) nsfw = `${this.bot.emojis.CHANNELNSFW} Yes`; }
				if (channel.type === 'GUILD_VOICE') type = `${this.bot.emojis.voice}Voice`
				if (channel.type === 'GUILD_CATEGORY') type = `Categrory`
				if (!type) type = `Other`

				else nsfw = `${this.bot.emojis.CHANNELNSFW} No`;
				const embedChannel = new MessageEmbed()
					.setAuthor(`Information of a channel :`, `${interaction.guild!.iconURL()}`)
					.setThumbnail(`${interaction.guild!.iconURL() ? interaction.guild!.iconURL() : ''}`)
					.setColor(this.colors.embed)
					.setTitle(`Channel : ${channel.name}`)
					.addFields(
						{ name: 'Channel id :', value: `${channel.id}`, inline: true },
						{ name: 'Category :', value: `${channel.parent ? channel.parent : 'none'}`, inline: true },
						{ name: 'Topic :', value: `${(channel as TextChannel).topic || 'No topic'}`, inline: false },
						{ name: 'Category ID :', value: `${channel.parentId}`, inline: true },
						{ name: 'Position :', value: `${channel.position}`, inline: true },
						{ name: '\u200b', value: `\u200b`, inline: true },
						{ name: 'Created at  :', value: `${moment.utc(channel.createdTimestamp).format('DD/MM/YYYY - hh:mm')}`, inline: true },
						{ name: 'Type channel:', value: `${type}`, inline: true },
						{ name: 'Channel NSFW :', value: `${nsfw}`, inline: true })
					.setTimestamp()
					.setFooter('Command module: Fun')
				interaction.reply({ embeds: [embedChannel] })
				break;
		}
	}
}