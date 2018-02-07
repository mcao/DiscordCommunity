const readdir = require('fs').readdir,
    util = require('util'),
    hastebin = require('hastebin-gen'),
    NITRO_ROLE = `nitro`,
    HYPESQUAD_ROLE = `hypesquad`,
    PARTNER_ROLE = `discord partner`
module.exports = bot => {
    bot.register('ping', msg => {
        var start = new Date(msg.timestamp).getTime();
        bot.createMessage(msg.channel.id, 'Pong!')
            .then(sentMsg => sentMsg.edit('Pong! **' + (new Date(sentMsg.timestamp).getTime() - start) + 'ms**'))
            .catch(console.error);
    }, {
        description: 'Pong!',
        fullDescription: "This command is used to check the bot's latency, or if it's up.",
    });

    bot.register('nitro', (msg, args) => {
        NITRO_ROLE = msg.channel.guild.roles.filter(r => r.name.toLowerCase().includes(NITRO_ROLE.toLowerCase()))[0].id;
        args = args.join(' ');
        var userID = args;
        var member = msg.channel.guild.members.get(userID);
        if (args.length === 18 || args.length === 17) {
            if (member.roles.indexOf(`${NITRO_ROLE}`) > -1) {
                member.removeRole(`${NITRO_ROLE}`, 'User is not nitro');
                return `Removed Nitro from **${member.username}#${member.discriminator}** `;
            } else {
                member.addRole(`${NITRO_ROLE}`, 'User is nitro');
                return `Gave **${member.username}#${member.discriminator}** Nitro `;
            }
            // 0 == true, -1 == false
        } else if (msg.mentions[0] && msg.mentions[0].username) {
            userID = msg.mentions[0].id;
            member = msg.channel.guild.members.get(userID);
            if (member.roles.indexOf(`${NITRO_ROLE}`) > -1) {
                member.removeRole(`${NITRO_ROLE}`, 'User is not nitro');
                return `Removed Nitro from **${member.username}#${member.discriminator}** `;
            } else {
                member.addRole(`${NITRO_ROLE}`, 'User is nitro');
                return `Gave **${member.username}#${member.discriminator}** Nitro `;
            }
        } else if (!args) {
            member = msg.member;
            if (member.roles.indexOf(`${NITRO_ROLE}`) > -1) {
                member.removeRole(`${NITRO_ROLE}`, 'User is not Nitro');
                return `Removed Nitro from **${member.username}#${member.discriminator}** `;
            } else {
                member.addRole(`${NITRO_ROLE}`, 'User is nitro');
                return `Gave **${member.username}#${member.discriminator}** Nitro `;
            }
        } else {
            return 'Please provide a valid user ';
        }
    }, {
        requirements: {
            roleIDs: ['323271893186510849'],
        },
        description: 'Give a user the nitro role.',
        fullDescription: 'This is used to give users who have nitro the Nitro role.',
    });

    bot.register('partner', (msg, args) => {
        PARTNER_ROLE = msg.channel.guild.roles.filter(r => r.name.toLowerCase().includes(PARTNER_ROLE.toLowerCase()))[0].id;
        args = args.join(' ');
        var userID = args;
        var member = msg.channel.guild.members.get(userID);
        if (args.length === 18 || args.length === 17) {
            if (member.roles.indexOf(`${PARTNER_ROLE}`) > -1) {
                member.removeRole(`${PARTNER_ROLE}`, 'User is not a Discord Partner');
                return `Removed Discord Partner from **${member.username}#${member.discriminator}** `;
            } else {
                member.addRole(`${NITRO_ROLE}`, 'User is is a Discord Partner');
                return `Gave **${member.username}#${member.discriminator}** Discord Partner `;
            }
            // 0 == true, -1 == false
        } else if (msg.mentions[0] && msg.mentions[0].username) {
            userID = msg.mentions[0].id;
            member = msg.channel.guild.members.get(userID);
            if (member.roles.indexOf(`${PARTNER_ROLE}`) > -1) {
                member.removeRole(`${PARTNER_ROLE}`, 'User is not Discord Partner');
                return `Removed Discord Partner from **${member.username}#${member.discriminator}** `;
            } else {
                member.addRole(`${PARTNER_ROLE}`, 'User is Discord Partner');
                return `Gave **${member.username}#${member.discriminator}** Discord Partner `;
            }
        } else if (!args) {
            member = msg.member;
            if (member.roles.indexOf(`${PARTNER_ROLE}`) > -1) {
                member.removeRole(`${PARTNER_ROLE}`, 'User is not Discord Partner');
                return `Removed Discord Partner from **${member.username}#${member.discriminator}** `;
            } else {
                member.addRole(`${PARTNER_ROLE}`, 'User is Discord Partner');
                return `Gave **${member.username}#${member.discriminator}** Discord Partner `;
            }
        } else {
            return 'Please provide a valid user ';
        }
    }, {
        requirements: {
            roleIDs: ['323271893186510849'],
        },
        description: 'Give a user the Discord Partner role.',
        fullDescription: 'This is used to give users who have the partner badge the Discord Partner role.',
    });

    bot.register('hypesquad', (msg, args) => {
        HYPESQUAD_ROLE = msg.channel.guild.roles.filter(r => r.name.toLowerCase().includes(HYPESQUAD_ROLE))[0].id;
        args = args.join(' ');
        var userID = args;
        var member = msg.channel.guild.members.get(userID);
        if (args.length === 18 || args.length === 17) {
            if (member.roles.indexOf(`${HYPESQUAD_ROLE}`) > -1) {
                member.removeRole(`${HYPESQUAD_ROLE}`, 'User is not a Hypesquad member');
                return `Removed Hypesquad from **${member.username}#${member.discriminator}** `;
            } else {
                member.addRole(`${HYPESQUAD_ROLE}`, 'User is is a Hypesquad');
                return `Gave **${member.username}#${member.discriminator}** Hypesquad `;
            }
            // 0 == true, -1 == false
        } else if (msg.mentions[0] && msg.mentions[0].username) {
            userID = msg.mentions[0].id;
            member = msg.channel.guild.members.get(userID);
            if (member.roles.indexOf(`${HYPESQUAD_ROLE}`) > -1) {
                member.removeRole(`${HYPESQUAD_ROLE}`, 'User is not Hypesquad');
                return `Removed Hypesquad from **${member.username}#${member.discriminator}** `;
            } else {
                member.addRole(`${HYPESQUAD_ROLE}`, 'User is Hypesquad');
                return `Gave **${member.username}#${member.discriminator}** Hypesquad `;
            }
        } else if (!args) {
            member = msg.member;
            if (member.roles.indexOf(`${HYPESQUAD_ROLE}`) > -1) {
                member.removeRole(`${HYPESQUAD_ROLE}`, 'User is not Hypesquad');
                return `Removed Hypesquad from **${member.username}#${member.discriminator}** `;
            } else {
                member.addRole(`${HYPESQUAD_ROLE}`, 'User is Hypesquad');
                return `Gave **${member.username}#${member.discriminator}** Hypesquad `;
            }
        } else {
            return 'Please provide a valid user ';
        }
    }, {
        requirements: {
            roleIDs: ['323271893186510849'],
        },
        aliases: ['hype'],
        description: 'Give a user the Hypesquad role.',
        fullDescription: 'This is used to give users who are members of Hypesquad the Hypesquad role.',
    });

    bot.register('nitrousers', msg => {
        HYPESQUAD_ROLE = msg.channel.guild.roles.filter(r => r.name.toLowerCase().includes(HYPESQUAD_ROLE))[0].id;
        NITRO_ROLE = msg.channel.guild.roles.filter(r => r.name.toLowerCase().includes(NITRO_ROLE.toLowerCase()))[0].id;
        PARTNER_ROLE = msg.channel.guild.roles.filter(r => r.name.toLowerCase().includes(PARTNER_ROLE.toLowerCase()))[0].id;
        var nitro_users = msg.channel.guild.members
            .filter(m => m.avatarURL.includes('.gif'))
            .filter(m => msg.channel.guild.members.get(m.id).roles.indexOf(`${NITRO_ROLE}`) < 0)
            .filter(m => msg.channel.guild.members.get(m.id).roles.indexOf(`${PARTNER_ROLE}`) < 0)
        if (nitro_users.length === 0) return bot.createMessage(msg.channel.id, 'Cannot find any potential nitro users without the role.');
        var chunked = bot.chunkArray(nitro_users, 10);
        // split nitro users into groups of ten
        chunked.forEach(() => {
            var embedy = {
                title: `List of potential nitro users`,
                color: 0x71368a,
                author: {
                    name: `${msg.channel.guild.name}`,
                    icon_url: `${bot.user.avatarURL}`,
                },
                timestamp: new Date(),
                fields: [

                ],
                footer: {
                    text: `Note: This is not 100% accurate. Length: ${nitro_users.length} users`,
                },
            };
            nitro_users.map(u => embedy.fields.push({ name: `Potentially nitro:`, value: `<@${u.id}> - ${u.id}` }));
            bot.createMessage(msg.channel.id, { embed: embedy });
        });
        return null;
    }, {
        requirements: {
            roleIDs: ['323271893186510849'],
        },
        description: 'Check potential nitro users who dont have the role.',
        fullDescription: "Check potential nitro users who don't have the nitro role, used by mods.",
    });

    bot.register('eval', (msg, args) => {
        var code = args.join(' ');
        try {
            let evaled = eval(code);
            let type = typeof evaled || 'undefined';
            let insp = util.inspect(evaled, {
                depth: 1,
            });

            if (evaled === null) evaled = 'null';

            let toStr = clean(insp.toString().replace(bot.token, 'REDACTED'));

            if (toStr.length > 1500) {
                hastebin(toStr, 'js').then(r => {
                    bot.createMessage(msg.channel.id, 'Output too large. Posted to ' + r);
                });
            } else {
                return '**Result:**\n```js\n' + toStr + '```\n**Type:**\n```js\n' + type + '```';
            }
        } catch (err) {
            return '```js\n' + clean(err.message) + '```';
        }
        return 'failure?';
    }, {
        requirements: {
            userIDs: bot.config.owners,
        },
        description: 'Evaluates code',
        fullDescription: 'This command is used to evaluate code on the bot.',
    });

    bot.register('say', (msg, args) => {
        args = args.join(' ');
        msg.delete();
        return args;
    }, {
        requirements: {
            roleIDs: ['323271893186510849'],
        },
        description: 'Say command',
        fullDescription: 'Deletes the original command and the bot will say the arguments.',
    });

    bot.register('exec', (msg, args) => {
        try {
            var res = require('child_process').execSync(args.join(' '));
        } catch (err) {
            res = err;
        }
        return '```LIDF\n' + res + '```';
    }, {
        requirements: {
            userIDs: bot.config.owners,
        },
        description: 'Executes to command line',
        fullDescription: 'This command is used to execute command line commands.',
    });

    bot.register('reload', (msg, args) => {
        if (args[0] === 'reload') return 'Please specify a module name!';
        readdir('./modules/', (err, files) => {
            err = null;
            files.forEach(f => {
                if (args[0] === 'all') {
                    delete require.cache[require.resolve(`./${f}`)];
                    require(`./${f}`)(bot);
                    bot.createMessage(msg.channel.id, `Module \`${f}\` successfully reloaded!`);
                } else if (f.indexOf(args[0]) > -1) {
                    delete require.cache[require.resolve(`./${f}`)];
                    require(`./${f}`)(bot);
                    bot.createMessage(msg.channel.id, `Module \`${f}\` successfully reloaded!`);
                } else {
                    bot.createMessage(msg.channel.id, 'Module does not exist!');
                }
            });
        });
        return null;
    }, {
        requirements: {
            userIDs: bot.config.owners,
        },
        description: 'Reloads a module',
        fullDescription: 'This command is used to reload modules.',
    });

    function clean(text) {
        if (typeof text === 'string') {
            return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
        } else {
            return text;
        }
    }
};
