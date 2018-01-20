module.exports = bot => {
    bot.register('warnings', (msg, args) => {
        var user;
        args = args.join(' ');
        if (args.length === 0) return 'Please provide a user.';
        if (args.length === 18) {
            if (bot.users.get(args).bot) return "Bots don't have warnings! <:bexn:393137089631354880>";
            user = msg.channel.guild.members.get(args);
        }
        if (msg.mentions[0]) {
            if (msg.mentions[0].bot) return "Bots don't have warnings! <:bexn:393137089631354880>";
            user = msg.mentions[0];
        }
        var embedy = {
            title: `Warnings for ${user.username}#${user.discriminator}`,
            color: 0x71368a,
            author: {
                name: 'Discord Community',
                icon_url: 'https://cdn.discordapp.com/avatars/392450607983755264/071e72220fae40698098221d52df3e5f.jpg?size=256',
            },
            fields: [

            ],
            thumbnail: {
                url: user.avatarURL.replace('?size=128', ''),
            },
        };

        if (bot.profiles[user.id].warnings.length === 0) return "This user doesn't have any warnings! <:bexn:393137089631354880>";

        var moderator;
        var reason;
        var channel;
        var warningNum = 0;
        bot.profiles[user.id].warnings.forEach(warning => {
            warningNum += 1;
            moderator = warning.mod;
            reason = warning.reason;
            channel = warning.channel;
            embedy.fields.push({
                name: `Warning #${warningNum}`,
                value: `Moderator: <@${moderator}>\nReason: ${reason}\nChannel: ${channel}`,
            });
        });
        bot.createMessage(msg.channel.id, {
            embed: embedy,
        });
        return null;
    }, {
        description: "Check a user's warnings.",
        fullDescription: 'Check the warnings for a given user.',
        requirements: {
            roleIDs: ['392425936366075905', '392150288729112587'],
        },
    });

    bot.register('warn', (msg, args) => {
        if (args.length === 0) return 'Please provide a user.';
        var reason = args.slice(1).join(' ');
        var user = args[0];
        if (!args[0]) return 'Please provide a user.';
        if (user.length === 18) {
            if (bot.users.get(user).bot) return 'Bots can\'t have warnings! <:bexn:393137089631354880>';
        }
        if (msg.mentions[0]) {
            if (msg.mentions[0].bot) return 'Bots can\'t have warnings! <:bexn:393137089631354880>';
            user = msg.mentions[0].id;
        }
        if (!reason) return 'Please provide a reason.';

        if (msg.mentions[0]) {
            user = msg.mentions[0].id;
        }
        var member = msg.channel.guild.members.get(user);
        bot.sendModLog('warn', member, msg.member, reason);
        bot.warn(user, msg.author.id, reason, `#${msg.channel.guild.channels.get(msg.channel.id).name}`);

        if (bot.profiles[user].warnings.length === 4) {
            msg.channel.createMessage('This user has a total of 4 warns. Would you like to throw them in detention? [yes/no]').then(m => {
                m.addReaction('bexn:393137089631354880').then(() => {
                    m.addReaction('bexy:393137089622966272').then(() => {
                        var reacted = false;
                        bot.on('messageReactionAdd', (message, emoji, usr) => {
                            if (message.id === m.id && usr === msg.author.id) {
                                switch (emoji.id) {
                                    // Yes emote
                                    case '393137089622966272':
                                        msg.channel.createMessage('Putting user in detention');
                                        member.addRole('392360679706853387', 'Auto-detention from warnings');
                                        break;
                                    // No emote
                                    case '393137089631354880':
                                        msg.channel.createMessage('Okay, user will not be put in detention');
                                        break;
                                    default:
                                    // just nothing
                                }
                                reacted = true;
                                bot._events.messageReactionAdd.splice(-1, 1);
                            }
                        });
                        setTimeout(() => {
                            if (reacted === false) {
                                bot._events.messageReactionAdd.splice(-1, 1);
                                msg.channel.createMessage('Reactions timed out, user not thrown in detention');
                            }
                        }, 15 * 1000);
                    });
                });
            });
        } else {
            return 'Warning recorded <:bexy:393137089622966272>';
        }
        return null;
    }, {
        description: 'Warns a user.',
        fullDescription: 'A command used to store a warning for a user who has violated a rule..',
        requirements: {
            roleIDs: ['392425936366075905', '392157971507052554', '392162455717150730', '392161607976878092', '392150288729112587'],
            userIDs: bot.config.owners,
        },
    });

    bot.register('report', (msg, args) => {
        if (args.length === 0) return 'Usage: `!report [staff] @User#1234 <Reason...>`';
        if (msg.channel.type === 1) {
            return 'This command does not work in DMs, sorry about that.';
        }
        var STAFF_ROLE_IDS = [
            // Hub staff from Discord Community
            '392157677184221185',
            // Admin from Discord Community
            '392150288729112587',
            // Community Staff from Discord Community
            '392425936366075905',
            // Global Mod from Discord Community
            '392161607976878092',
            // Break
            // Hub Staff from Discord Hub
            '323271893186510849',
            // Support Team from Discord Hub
            '223661000929443840',
            // Management from Discord Hub
            '387862020063494145',
            // Global Moderator from Discord Hub
            '323271790291845120',
            // Break
            // Admin from ProCord
            '392471690170335232',
            // Management from ProCord
            '392471717978701825',
            // ProCord Staff from ProCord
            '397507548896428034',
            // Hub Staff from ProCord
            '292435797162852352',
        ];
        if (args[0] === 'staff') {
            // Handle staff report
            var user = args[1];
            if (user.length === 18 || user.length === 17) {
                user = msg.channel.guild.members.get(user);
            } else {
                user = msg.channel.guild.members.get(msg.mentions[0].id);
            }
            let is_staff = false;
            user.roles.forEach(e => {
                if (STAFF_ROLE_IDS.indexOf(e) !== -1) {
                    is_staff = true;
                }
            });
            if (!is_staff) return 'That user is not a staff member so can not be reported using the staff option!';
            let r = [];
           /* let staff_roles = user.roles.forEach(e => {
                if (STAFF_ROLE_IDS.indexOf(e) != -1) {
                    r.push(msg.channel.guild.roles.get(e).name);
                }
            }); */
            bot.getChannel('398936792910397451').createMessage({
                embed: {
                    color: 2719211,
                    footer: {
                        icon_url: msg.author.avatarURL,
                        text: `Reported by ${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
                    },

                    fields: [{
                        name: 'Reported Staff',
                        value: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
                        inline: true,
                    },
                    {
                        name: 'Reported in',
                        value: msg.channel.guild.name,
                        inline: true,
                    },
                    {
                        name: 'Reason for being reported',
                        value: args.splice(1).join(' '),
                        inline: false,
                    },
                    {
                        name: 'Current Staff Positions',
                        value: r.join(', '),
                        inline: false,
                    },
                    ],
                },
            });
            msg.author.getDMChannel().then(channel => channel.createMessage(`Okay! That user has been reported! Thank you for making ${msg.channel.guild.name} a better place!`));
        } else {
            user = args[0];
            if (user.length === 18 || user.length === 17) {
                user = msg.channel.guild.members.get(user);
            } else {
                user = msg.channel.guild.members.get(msg.mentions[0].id);
            }
            let is_staff = false;
            user.roles.forEach(e => {
                if (STAFF_ROLE_IDS.indexOf(e) !== -1) {
                    is_staff = true;
                }
            });
            if (is_staff) {
                let r = [];
                /* let staff_roles = user.roles.forEach(e => {
                    if (STAFF_ROLE_IDS.indexOf(e) !== -1) {
                        r.push(msg.channel.guild.roles.get(e).name);
                    }
                });*/
                bot.getChannel('398936792910397451').createMessage({
                    embed: {
                        color: 2719211,
                        footer: {
                            icon_url: msg.author.avatarURL,
                            text: `Reported by ${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
                        },

                        fields: [{
                            name: 'Reported Staff',
                            value: `${user.user.username}#${user.user.discriminator} (${user.user.id})`,
                            inline: true,
                        },
                        {
                            name: 'Reported in',
                            value: msg.channel.guild.name,
                            inline: true,
                        },
                        {
                            name: 'Reason for being reported',
                            value: args.splice(1).join(' '),
                            inline: false,
                        },
                        {
                            name: 'Current Staff Positions',
                            value: r.join(', '),
                            inline: false,
                        },
                        ],
                    },
                });
            } else {
                bot.getChannel('398936792910397451').createMessage({
                    embed: {
                        color: 2919211,
                        footer: {
                            icon_url: msg.author.avatarURL,
                            text: `Reported by ${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
                        },
                        fields: [{
                            name: 'Reported User',
                            value: `${user.user.username}#${user.user.discriminator} (${user.user.id})`,
                            inline: true,
                        },
                        {
                            name: 'Reported in',
                            value: msg.channel.guild.name,
                            inline: true,
                        },
                        {
                            name: 'Reason for being reported',
                            value: args.splice(1).join(' '),
                            inline: false,
                        },
                        ],
                    },
                });
            }
            msg.author.getDMChannel().then(channel => channel.createMessage(`Okay! That user has been reported! Thank you for making ${msg.channel.guild.name} a better place!`));
        }
        msg.delete();
        return null;
    }, {
        requirements: {
            roleIDs: null,
        },
    });

    bot.register('claim', msg => {
        // if (!args.length) return msg.channel.createMessage('Please provide an ID <:bexn:393137089631354880>');
        // if (!bot.tickets[args]) return msg.channel.createMessage('Invalid ID <:bexn:393137089631354880>')
        // msg.channel.createMessage(`<@${msg.author.id}>, you have claimed ticket \`${args}\``);
        msg.channel.createMessage("Listen. I don't work, stop hecking using me <:bexangry:390557738473881601> 😠");
    }, {
        description: 'Claim a modmail ticket.',
        fullDescription: 'Claim a ticket for mod mail, to respond to a user.',
        requirements: {
            roleIDs: ['392157971507052554', '392162455717150730', '392161607976878092', '392150288729112587', '397192363031789578'],
        },
    });

    bot.register('resetwarns', (msg, args) => {
        if (args.length === 0) return 'Please provide a user.';
        var user = args[0];
        if (!args[0]) return 'Please provide a user.';
        if (user.length === 18) {
            if (bot.users.get(user).bot) return "Bots don't have warnings! <:bexn:393137089631354880>";
            if (bot.profiles[user].warnings.length === 0) return "This user doesn't have any warnings! <:bexn:393137089631354880>";
            bot.profiles[user].warnings = [];
            return 'Warnings reset! <:bexy:393137089622966272>';
        } else if (msg.mentions[0]) {
            if (msg.mentions[0].bot) return "Bots don't have warnings! <:bexn:393137089631354880>";
            user = msg.mentions[0].id;
            if (bot.profiles[user].warnings.length === 0) return "This user doesn't have any warnings! <:bexn:393137089631354880>";
            bot.profiles[user].warnings = [];
            return 'Warnings reset! <:bexy:393137089622966272>';
        } else {
            return 'Invalid user! <:bexn:393137089631354880>';
        }
    }, {
        aliases: ['clearwarns', 'clearwarnings', 'resetwarnings'],
        description: 'Reset warnings for a user.',
        fullDescription: 'Resets the warnings for a user.',
        requirements: {
            roleIDs: ['392157971507052554', '392162455717150730', '392161607976878092', '392150288729112587'],
            userIDs: bot.config.owners,
        },
    });

    bot.register('kick', (msg, args) => {
        if (args.length === 0) return 'Invalid arguments <:bexn:393137089631354880>';
        if (!args[0]) return 'Please provide a user <:bexn:393137089631354880>';
        if (!args[1]) return 'Please provide a reason <:bexn:393137089631354880>';

        var member = args.splice(0, 1);
        // First argument: user mention/id

        var reason = args.splice(1);
        // Second argument and rest of message: reason
        reason = args.join(' ');

        if (member.length === 18 || member.length === 17) {
            member = msg.channel.guild.members.get(member);
        } else if (msg.mentions[0]) {
            member = msg.channel.guild.members.get(msg.mentions[0].id);
        } else {
            return msg.channel.createMessage('Invalid user <:bexn:393137089631354880>');
        }

        if (member.roles.has('392157971507052554') || member.roles.has('392162455717150730')) return 'User is immune <:bexn:393137089631354880>';

        member.kick(reason).then(() => msg.channel.createMessage(`**${msg.member.username}#${msg.member.discriminator}** has been kicked <:bexy:393137089622966272>`)).catch(err => {
            console.log(err);
        });
        bot.sendModLog('kick', member, msg.member, reason);
        return null;
    }, {
        description: 'Kick a user.',
        fullDescription: 'Kick a user off the server.',
        requirements: {
            roleIDs: ['392157971507052554', '392162455717150730', '392161607976878092', '392150288729112587'],
        },
    });

    bot.register('blacklistChan', (msg, args) => {
        args = args.join(' ');
        if (args.length == 0) return 'Please provide a channel <:bexn:393137089631354880>';
        var chan = msg.channel.guild.channels.filter(c => c.name.toLowerCase().includes(args))[0]
        if (chan) {
            bot.addBlacklistChan(args);
            return `<#${chan.id}> (**${chan.name}**) is now blacklisted for XP.`;
        }
        return 'Invalid channel <:bexn:393137089631354880>'
    }, {
        description: 'Blacklist a channel from the bot, so it won\'t give XP on messages..',
        fullDescription: 'Once a channel is blacklisted, all messages in the channel will be ignores for XP by the bot.',
        requirements: {
            roleIDs: ['392150288729112587', '392162455717150730', '392161607976878092', '392150288729112587'],
        },
    });

    bot.register('ban', (msg, args) => {
        if (args.length === 0) return 'Invalid arguments <:bexn:393137089631354880>';
        if (!args[0]) return 'Please provide a user <:bexn:393137089631354880>';
        if (!args[1]) return 'Please provide a reason <:bexn:393137089631354880>';

        var member = args.splice(0, 1);
        // First argument: user mention/id

        var reason = args.splice(1);
        // Second argument and rest of message: reason
        reason = args.join(' ');

        if (member.length === 18 || member.length === 17) {
            member = msg.channel.guild.members.get(member);
        } else if (msg.mentions[0]) {
            member = msg.channel.guild.members.get(msg.mentions[0].id);
        } else {
            return msg.channel.createMessage('Invalid user <:bexn:393137089631354880>');
        }

        if (member.roles.indexOf('392157971507052554') > -1|| member.roles.indexOf('392162455717150730') > -1) return 'User is immune <:bexn:393137089631354880>';

        member.ban(1, reason).then(() => {
            msg.channel.createMessage(`Successfully banned **${member.username}#${member.discriminator}**`);
        }).catch((err) => {
             if (err.message.toLowerCase().includes('forbidden')) {
                  err = 'Invalid permissions!';
            }
            return msg.channel.createMessage(`An error has occured: ${err}`);
        });
        bot.sendModLog('ban', member, msg.member, reason);
    }, {
        description: 'Ban a user.',
        fullDescription: 'Ban a user off the Hub Network.',
        requirements: {
            roleIDs: ['392157971507052554', '392162455717150730', '392161607976878092', '392150288729112587'],
        },
    });
    bot.register('reset', (msg, args) => {
        var user = msg.mentions[0].id;
        if (args.length === 0) return bot.createMessage(msg.channel.id, 'Please provide a user. <:bexn:393137089631354880>');
        if (msg.mentions[0].bot) return bot.createMessage(msg.channel.id, 'Bots don\'t have ranks! <:bexn:393137089631354880>');
        if (!msg.mentions[0] && args.length !== 18) return bot.createMessage(msg.channel.id, 'Invalid user.');
        if (args.length === 18 && typeof args === 'number') user = args;
        const levelRoles = ['393606932608450561', '393606931014746113', '393606929068589057', '393606926467989507', '393606924433752064'];
        levelRoles.forEach(role => {
            const person = msg.channel.guild.members.get(user);
            if (!person.roles.includes(role)) return;
            person.removeRole(role, `Rank resetted | Done by: ${msg.author.username}#${msg.author.discriminator}`);
        });
        bot.resetMessages(user);
        return `Reset the level for <@${user}>.`;
    }, {
        description: 'Resets a level.',
        fullDescription: 'Resets the message count for the given user.',
        requirements: {
            roleIDs: ['392157971507052554', '392162455717150730', '392161607976878092', '392150288729112587'],
        },
    });
};
