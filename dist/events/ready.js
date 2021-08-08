"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor(bot) {
        this.bot = bot;
    }
    run() {
        var _a, _b;
        const data = [];
        const commandsCategories = [];
        this.bot.commands.forEach((c) => commandsCategories.push(c.category));
        const categories = [...new Set(commandsCategories)];
        for (const category of categories) {
            const commandsCategory = [...this.bot.commands].filter(([_, c]) => c.category === category);
            for (const c of commandsCategory) {
                if ((_a = c[1].subCommands) === null || _a === void 0 ? void 0 : _a.length) {
                    const commandOptions = [];
                    c[1].subCommands.forEach((sc) => {
                        commandOptions.push({
                            type: 'SUB_COMMAND',
                            name: sc.name,
                            description: sc.description,
                            required: sc.required,
                            choices: sc.choices,
                            options: sc.options
                        });
                    });
                    data.push({
                        type: 'SUB_COMMAND_GROUP',
                        name: c[1].name,
                        description: c[1].description,
                        options: commandOptions
                    });
                }
                else if (c[1].options && c[1].options.length) {
                    const commandOptions = [];
                    c[1].options.forEach((a) => {
                        commandOptions.push({
                            type: 'STRING',
                            name: a.name,
                            description: a.description,
                            required: a.required,
                            choices: a.choices,
                            options: a.options
                        });
                    });
                    data.push({
                        name: c[1].name,
                        description: c[1].description,
                        options: commandOptions
                    });
                }
                else {
                    // No commands args and no subcommands
                    data.push({
                        name: c[1].name,
                        description: c[1].description,
                    });
                }
            }
        }
        this.bot.client.application.commands.set(data, '809702809196560405');
        console.log(`Logged in as ${(_b = this.bot.client.user) === null || _b === void 0 ? void 0 : _b.tag}!`);
    }
}
exports.default = default_1;
