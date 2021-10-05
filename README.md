# Discord bot template

## Commands

### Admin

| Name    | Description                 | Usage      | Cd    |
| ------- | --------------------------- | ---------- | ----- |
| eval    | Execute javascript code     | <js_code>  | 5secs |
| exe     | Execute command in terminal | \<command> | 5secs |
| restart | Restart the bot             | none       | 5secs |

### Moderation

| Name   | Description                    | Usage                        | Cd     |
| ------ | ------------------------------ | ---------------------------- | ------ |
| ban    | Ban a user.                    | \<@​user> \<reason>          | 10secs |
| filter | Forbidden words on the server. | \<word>                      | 10secs |
| kick   | Kick a user.                   | \<@​user> \<raison>          | 10secs |
| lock   | Lock a channel.                | \<#channel> or \<channel_id> | 10secs |
| mute   | Mute a user.                   | \<@​user> \<time>            | 10secs |
| purge  | Delete messages.               | \<nb_messages>               | 10secs |
| rename | Change nickname of user.       | \<user> \<new_name>          | 10secs |
| unban  | Unban a user.                  | \<user_id>                   | 10secs |
| unlock | Unlock a channel.              | \<channel>                   | 5secs  |
| unmute | Unmute a user.                 | \<@​user>                    | 10secs |
| warn   | Warn a user.                   | \<user> \<reason>            | 10secs |

## How to install

### Prerequisites

- You need nodejs >= 16.6.0 for start the bot.
- You need typescript complier `npm i -g typescript`

1. Clone the repo
2. Clone `config.template.ts` from src directory into the src directory and rename it to `config.ts`
3. Install the dependencies: `npm install`
4. Compile typescript : `npm run build`
5. Start the bot: `npm run start`

## Contributions/Licence

This project has an MIT license. And you are welcome to contribute.

## Need help

If you have question or need help, please open an issue.
