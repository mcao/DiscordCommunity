const readdir = require('fs').readdir,
    util = require('util'),
    hastebin = require('hastebin-gen'),
    NITRO_ROLE = `392169841554882570`,
    HYPESQUAD_ROLE = `392169890955395078`,
    PARTNER_ROLE = `392169937755439106`,
    Cleverbot = require('cleverbot');
let clev = new Cleverbot({
    key: 'CC68v6dd86WetHxwJN-KOjqsMxg',
});
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
    bot.register('clever', (msg, args) => {
        args = args.join(' ');
        if (args.toLowerCase().includes('ur stupid')) {
            return msg.channel.createMessage(`No, I'm not <@${msg.author.id}>. BUT YOU ARE YOU FUCKER`);
        }
        clev.query(args)
            .then(response =>
                msg.channel.createMessage(response.output));
        return null;
    }, {
        description: 'Talk to the bot!',
        fullDescription: "Speak with Discord Hub when you're feeling **very** lonely.",
    });

    bot.register('nitro', (msg, args) => {
        args = args.join(' ');
        var userID = args;
        var member = msg.channel.guild.members.get(userID);
        if (args.length === 18 || args.length === 17) {
            if (member.roles.indexOf(`${NITRO_ROLE}`) > -1) {
                member.removeRole(`${NITRO_ROLE}`, 'User is not nitro');
                return `Removed Nitro from **${member.username}#${member.discriminator}** <:bexy:393137089622966272>`;
            } else {
                member.addRole(`${NITRO_ROLE}`, 'User is nitro');
                return `Gave **${member.username}#${member.discriminator}** Nitro <:bexy:393137089622966272>`;
            }
            // 0 == true, -1 == false
        } else if (msg.mentions[0] && msg.mentions[0].username) {
            userID = msg.mentions[0].id;
            member = msg.channel.guild.members.get(userID);
            if (member.roles.indexOf(`${NITRO_ROLE}`) > -1) {
                member.removeRole(`${NITRO_ROLE}`, 'User is not nitro');
                return `Removed Nitro from **${member.username}#${member.discriminator}** <:bexy:393137089622966272>`;
            } else {
                member.addRole(`${NITRO_ROLE}`, 'User is nitro');
                return `Gave **${member.username}#${member.discriminator}** Nitro <:bexy:393137089622966272>`;
            }
        } else if (!args) {
            member = msg.member;
            if (member.roles.indexOf(`${NITRO_ROLE}`) > -1) {
                member.removeRole(`${NITRO_ROLE}`, 'User is not Nitro');
                return `Removed Nitro from **${member.username}#${member.discriminator}** <:bexy:393137089622966272>`;
            } else {
                member.addRole(`${NITRO_ROLE}`, 'User is nitro');
                return `Gave **${member.username}#${member.discriminator}** Nitro <:bexy:393137089622966272>`;
            }
        } else {
            return 'Please provide a valid user <:bexn:393137089631354880>';
        }
    }, {
        requirements: {
            roleIDs: ['392157971507052554', '392162455717150730', '392161607976878092', '392150288729112587', '392164671664422912'],
        },
        description: 'Give a user the nitro role.',
        fullDescription: 'This is used to give users who have nitro the Nitro role.',
    });

    bot.register('partner', (msg, args) => {
        args = args.join(' ');
        var userID = args;
        var member = msg.channel.guild.members.get(userID);
        if (args.length === 18 || args.length === 17) {
            if (member.roles.indexOf(`${PARTNER_ROLE}`) > -1) {
                member.removeRole(`${PARTNER_ROLE}`, 'User is not a Discord Partner');
                return `Removed Discord Partner from **${member.username}#${member.discriminator}** <:bexy:393137089622966272>`;
            } else {
                member.addRole(`${NITRO_ROLE}`, 'User is is a Discord Partner');
                return `Gave **${member.username}#${member.discriminator}** Discord Partner <:bexy:393137089622966272>`;
            }
            // 0 == true, -1 == false
        } else if (msg.mentions[0] && msg.mentions[0].username) {
            userID = msg.mentions[0].id;
            member = msg.channel.guild.members.get(userID);
            if (member.roles.indexOf(`${PARTNER_ROLE}`) > -1) {
                member.removeRole(`${PARTNER_ROLE}`, 'User is not Discord Partner');
                return `Removed Discord Partner from **${member.username}#${member.discriminator}** <:bexy:393137089622966272>`;
            } else {
                member.addRole(`${PARTNER_ROLE}`, 'User is Discord Partner');
                return `Gave **${member.username}#${member.discriminator}** Discord Partner <:bexy:393137089622966272>`;
            }
        } else if (!args) {
            member = msg.member;
            if (member.roles.indexOf(`${PARTNER_ROLE}`) > -1) {
                member.removeRole(`${PARTNER_ROLE}`, 'User is not Discord Partner');
                return `Removed Discord Partner from **${member.username}#${member.discriminator}** <:bexy:393137089622966272>`;
            } else {
                member.addRole(`${PARTNER_ROLE}`, 'User is Discord Partner');
                return `Gave **${member.username}#${member.discriminator}** Discord Partner <:bexy:393137089622966272>`;
            }
        } else {
            return 'Please provide a valid user <:bexn:393137089631354880>';
        }
    }, {
        requirements: {
            roleIDs: ['392157971507052554', '392162455717150730', '392161607976878092', '392150288729112587', '392164671664422912'],
        },
        description: 'Give a user the Discord Partner role.',
        fullDescription: 'This is used to give users who have the partner badge the Discord Partner role.',
    });

    bot.register('hypesquad', (msg, args) => {
        args = args.join(' ');
        var userID = args;
        var member = msg.channel.guild.members.get(userID);
        if (args.length === 18 || args.length === 17) {
            if (member.roles.indexOf(`${HYPESQUAD_ROLE}`) > -1) {
                member.removeRole(`${HYPESQUAD_ROLE}`, 'User is not a Hypesquad member');
                return `Removed Hypesquad from **${member.username}#${member.discriminator}** <:bexy:393137089622966272>`;
            } else {
                member.addRole(`${HYPESQUAD_ROLE}`, 'User is is a Hypesquad');
                return `Gave **${member.username}#${member.discriminator}** Hypesquad <:bexy:393137089622966272>`;
            }
            // 0 == true, -1 == false
        } else if (msg.mentions[0] && msg.mentions[0].username) {
            userID = msg.mentions[0].id;
            member = msg.channel.guild.members.get(userID);
            if (member.roles.indexOf(`${HYPESQUAD_ROLE}`) > -1) {
                member.removeRole(`${HYPESQUAD_ROLE}`, 'User is not Hypesquad');
                return `Removed Hypesquad from **${member.username}#${member.discriminator}** <:bexy:393137089622966272>`;
            } else {
                member.addRole(`${HYPESQUAD_ROLE}`, 'User is Hypesquad');
                return `Gave **${member.username}#${member.discriminator}** Hypesquad <:bexy:393137089622966272>`;
            }
        } else if (!args) {
            member = msg.member;
            if (member.roles.indexOf(`${HYPESQUAD_ROLE}`) > -1) {
                member.removeRole(`${HYPESQUAD_ROLE}`, 'User is not Hypesquad');
                return `Removed Hypesquad from **${member.username}#${member.discriminator}** <:bexy:393137089622966272>`;
            } else {
                member.addRole(`${HYPESQUAD_ROLE}`, 'User is Hypesquad');
                return `Gave **${member.username}#${member.discriminator}** Hypesquad <:bexy:393137089622966272>`;
            }
        } else {
            return 'Please provide a valid user <:bexn:393137089631354880>';
        }
    }, {
        requirements: {
            roleIDs: ['392157971507052554', '392162455717150730', '392161607976878092', '392150288729112587', '392164671664422912'],
        },
        aliases: ['hype'],
        description: 'Give a user the Hypesquad role.',
        fullDescription: 'This is used to give users who are members of Hypesquad the Hypesquad role.',
    });

    bot.register('reactions', (msg, args) => {
        bot.reactions = [];
        if (args.length === 0) return 'Reset the reactions!';

        args.forEach(arg => {
            if (arg.includes(':')) {
                arg = arg.replace('<:', '');
                arg = arg.replace('>', '');
                bot.reactions.push(arg);
            } else {
                bot.reactions.push(arg);
            }
        });
        return 'Done! <:bexhey:390556541360799748>';
    }, {
        requirements: {
            roleIDs: ['392425936366075905', '392150288729112587', '392164671664422912'],
        },
        description: 'Change the reactions added to the fotd channel.',
        fullDescription: 'Easier & quicker to add reactions.',
    });

    bot.register('nitrousers', msg => {
        var nitro_users = msg.channel.guild.members
            .filter(m => m.avatarURL.includes('.gif'))
            .filter(m => msg.channel.guild.members.get(m.id).roles.indexOf(`${NITRO_ROLE}`) < 0)
            .filter(m => msg.channel.guild.members.get(m.id).roles.indexOf(`${PARTNER_ROLE}`) < 0)
            .filter(m => msg.channel.guild.members.get(m.id).roles.indexOf('392169947511390210') < 0);
        if (nitro_users.length === 0) return bot.createMessage(msg.channel.id, 'Cannot find any potential nitro users without the role.');
        var chunked = bot.chunkArray(nitro_users, 10);
        // split nitro users into groups of ten
        chunked.forEach(() => {
            var embedy = {
                title: `List of potential nitro users`,
                color: 0x71368a,
                author: {
                    name: 'Discord Community',
                    icon_url: 'https://cdn.discordapp.com/avatars/392450607983755264/071e72220fae40698098221d52df3e5f.jpg?size=256',
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
            roleIDs: ['392157971507052554', '392162455717150730', '392161607976878092', '392150288729112587', '392164671664422912'],
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
            roleIDs: ['392425936366075905', '392150288729112587', '392164671664422912'],
        },
        description: 'Say command',
        fullDescription: 'Deletes the original command and the bot will say the arguments.',
    });
    bot.register("invitefever", (msg, args) => {
        var inviteFever = new Object;
        msg.channel.guild.getInvites().then((v) => v.forEach(i => {
            if(i.inviter&& ! i.temporary)
            if (!i.inviter) return;
            if (i.maxAge != 0) return;
            if (i.uses < 15) return;
            inviteFever.users[i.inviter.id] = {
                user: `${i.inviter.username}#${i.inviter.discriminator}`,
                userID: i.inviter.id,
                uses: i.uses
            };
        }));
        var embedy = {
            title: 'List of users who are in need of the Invite Fever role.',
            timestamp: new Date(),
            footer: {
                text: 'Do "!autofever" to give all users the role'
            },
            color: 0x71368a,
            fields: [

            ]
        };
        if (Object.keys(inviteFever).length == 0) return 'No users are in need of the **Invite Fever** role.';
        for (var user in inviteFever) {
            embedy.fields.push({name: `${user.user} - <@${user.userID}> - ${user.userID}`, value: `Uses: **${user.uses}**`});
        }
        bot.createMessage(msg.channel.id, {embed: embedy});
        
    }, {
        requirements: {
            roleIDs: ['392425936366075905', '392150288729112587', '392164671664422912', '392162455717150730', '392161607976878092']
        },
        description: "Check users who are in need of the invite fever role.",
        fullDescription: "Do !autofever to give all users the invite fever role."
    });

    bot.register("autofever", (msg, args) => {
        var inviteFever = new Array;
        msg.channel.guild.getInvites().then((v) => v.forEach(i => {
            if(i.inviter&& ! i.temporary)
            if (!i.inviter) return;
            if (i.maxAge != 0) return;
            if (i.uses < 15) return;
            inviteFever.push(i.inviter.id);
        }));
        if (inviteFever.length == 0) return 'No users are in need of the **Invite Fever** role.'
        inviteFever.forEach(function(user) {
            var member = msg.channel.guild.members.get(user);
            member.addRole('392373664722452490', 'User hit >15 invite uses.');
        }).then(() => {
            bot.createMessage(msg.channel.id, `Gave \`${inviteFever.length}\` the **Invite Fever** role.`);
        })
        
    }, {
        requirements: {
            roleIDs: ['392425936366075905', '392150288729112587', '392164671664422912', '392162455717150730', '392161607976878092']
        },
        description: "Check users who are in need of the invite fever role.",
        fullDescription: "Do !autofever to give all users the invite fever role."
    });

    bot.register('invite', (msg, args) => {
        var users = {};
        msg.channel.guild.getInvites().then(v => v.forEach(i => {
            if (i.inviter && !i.temporary && !i.maxAge) {
                if (!i.inviter) return;
                users[i.inviter.id] = {
                    user: i.inviter.username
                }
                if (i.inviter.username !== msg.author.username) return;
                var leftToGo;
                if (i.uses > 15) {
                    leftToGo = 0;
                    msg.member.addRole('392373664722452490', 'Received for inviting more than 15 people');
                    msg.channel.createMessage(msg.channel.id, 'Well done! You got the role!');
                } else {
                    leftToGo = 15 - i.uses;
                    msg.channel.createMessage('Fetching invite(s)..').then(m => {
                        m.edit(`Your permanent invite (\`discord.gg/${i.code}\`) has been used **${i.uses}** times. You have to invite \`${leftToGo}\` more people to get the **Invite Fever** role!`);
                    });
                }
            }
        }));
        var hey = false;
        for(var user in users) {
            if (users.user == msg.author.username) {
                return 'You don\'t have any permanent invites, go make one in <#392171939101409290>! <:bexhey:390556541360799748>'
            }
        }
    }, {
        requirements: {
            roleIDs: ['392169263982444546', '392425936366075905', '392150288729112587', '392164671664422912', '392162455717150730', '392161607976878092']
        },
        description: 'Check how many uses your invite has.',
        fullDescription: "This is used to check how many times your invite has been used, and check the code you've been using."
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

    bot.register('update', msg => {
        bot.createMessage(msg.channel.id, 'Updating...').then(e => {
            var evaled = require('child_process').execSync('git pull').toString();
            bot.createMessage(e.channel.id, '```' + evaled + '```');
            if (evaled.indexOf('Already up-to-date.') < 0) {
                bot.createMessage(e.channel.id, 'New code successfully pulled! Restarting...');
                setTimeout(() => {
                    process.exit(0);
                }, 2000);
            }
        });
    }, {
        requirements: {
            userIDs: bot.config.owners,
        },
        description: "Updates the bot's code.",
        fullDescription: "This command is used to update the bot's code on Github.",
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

    bot.register('event', (msg, args) => {
        var argsArray = args.slice();
        var countdownTime = argsArray[1];
        var slicedArgs = args.slice(2);
        var eventDescription = slicedArgs.join('');
        var msgSent;

        // subtracts five from the number given as time in minutes
        function countingDown() {
            --countdownTime;
        }
        // loops countingDown() to run every minute
        function countdownFunc() {
            setTimeout(countingDown, 60000);
        }

        function countdownMessage() {
            msgSent = '**' + eventDescription + '**\nstarting in **' + countdownTime + ' minutes!**';
            bot.createMessage('392173094728630275', msgSent).then(it => {
                msgSent = it;
            });
        }

        // edits the sent message conform the altered countdownTime variable
        function editMsg() {
            msgSent.edit('**' + eventDescription + '**\nstarting in **' + countdownTime + ' minutes!**').then(it => {
                msgSent = it;
            });
        }

        // loops the above function every minute
        function sendEdit() {
            setTimeout(editMsg, 60000);
        }

        function stopCountdown() {
            clearTimeout(countdownTime);
            clearTimeout(msgSent);
        }

        function amountBoolean() {
            return countdownTime === 0;
        }

        function getAmount() {
            setTimeout(() => { amountBoolean(); }, 60000);
        }

        if (argsArray[0] === 'start') {
            if (isNaN(argsArray[1])) {
                bot.createMessage(msg.channel.id, 'Time must be a number!');
            } else {
                bot.createMessage(msg.channel.id, 'Event **' + eventDescription + '** started!');
                countdownMessage();
                countdownFunc();
                sendEdit();
                if (getAmount() === true) {
                    stopCountdown();
                    msgSent.edit('**' + eventDescription + ' has begun!**');
                }
            }
        } else {
            bot.createMessage(msg.channel.id, 'The correct usage is: `!event start <time> <description>`!');
        }
    }, {
        requirements: {
            roleIDs: ['392169572863836160'],
        },
        description: 'Start an event.',

        fullDescription: 'This command is used to start a countdown for an event in the events channel.',
    });
};