module.exports = bot => {
    bot.register('kick', (msg, args) => {
        if (args.length === 0) return 'Invalid arguments ';
        if (!args[0]) return 'Please provide a user ';
        if (!args[1]) return 'Please provide a reason ';

        var member = args.splice(0, 1);
        // First argument: user mention/id

        var reason = args.splice(1);
        // Second argument and rest of message: reason
        reason = reason.join(' ');
        if (!reason.includes(`- ${msg.author.username}`)) {
            reason = `${reason} - ${msg.author.username}#${msg.author.discriminator}`;
        }
        if (member.length === 18 || member.length === 17) {
            member = msg.channel.guild.members.get(member);
        } else if (msg.mentions[0]) {
            member = msg.channel.guild.members.get(msg.mentions[0].id);
        } else {
            return msg.channel.createMessage('Invalid user ');
        }

        if (member.roles.indexOf('323271790291845120') > -1) return 'User is immune';

        member.kick(reason).then(() => {
            msg.channel.createMessage(`**${msg.member.username}#${msg.member.discriminator}** has been kicked `)
        }).catch(err => {
            if (err.message.toLowerCase().includes('forbidden')) {
                err = 'Invalid permissions!';
            }
            return msg.channel.createMessage(`An error has occured: ${err}`);
        });
        return null;
    }, {
        description: 'Kick a user.',
        fullDescription: 'Kick a user off the server.',
        requirements: {
            roleIDs: ['323271790291845120'],
        },
    });

    bot.register('ban', (msg, args) => {
        if (args.length === 0) return 'Invalid arguments ';
        if (!args[0]) return 'Please provide a user ';
        if (!args[1]) return 'Please provide a reason ';

        var member = args[0];
        // First argument: user mention/id

        var reason = args.splice(1);
        // Second argument and rest of message: reason
        reason = reason.join(' ');
        if (!reason.includes(`- ${msg.author.username}`)) {
            reason = `${reason} - ${msg.author.username}#${msg.author.discriminator}`;
        }

        if (member.length === 18 || member.length === 17) {
                member = msg.channel.guild.members.get(member)
            
        } else if (msg.mentions[0]) {
                member = msg.channel.guild.members.get(msg.mentions[0].id);
        } else {
            return msg.channel.createMessage('Invalid user ');
        }

        if (member.roles.indexOf('323271790291845120') > -1) return 'User is immune ';

        member.ban(1, reason).then(() => {
            msg.channel.createMessage(`Successfully banned **${member.username}#${member.discriminator}**`);
        }).catch((err) => {
            if (err.message.toLowerCase().includes('forbidden')) {
                err = 'Invalid permissions!';
            }
            return msg.channel.createMessage(`An error has occured: ${err}`);
        });
    }, {
        description: 'Ban a user.',
        fullDescription: 'Ban a user off the Hub Network.',
        requirements: {
            roleIDs: ['323271790291845120'],
        },
    });

    bot.register('unban', (msg, args) => {
        if (args.length === 0) return 'Invalid arguments ';
        if (!args[0]) return 'Please provide a user ';

        var member = args[0];
        // First argument: user mention/id
        var reason;
        if(args[1]) {
            reason = args.splice(1);
            // Second argument and rest of message: reason
            reason = reason.join(' ');
            if (!reason.includes(`- ${msg.author.username}`)) {
                reason = `${reason} - ${msg.author.username}#${msg.author.discriminator}`;
            }
        }
        else {
            reason = 'No reason given.';
        }

        if (member.length === 18 || member.length === 17) {
            member = member;
            msg.channel.guild.unbanMember(member, reason).then(() => {
                member = bot.users.get(member);
                msg.channel.createMessage(`Successfully unbanned **${member.username}#${member.discriminator}** `);
            }).catch((err) => {
                if (err.message.toLowerCase().includes('forbidden')) {
                    err = 'Invalid permissions!';
                }
                if (err.message.toLowerCase().includes('unknown ban')) {
                    if (bot.users.get(member)) {
                        err = 'Invalid user ID'
                    }
                    else {
                        err = 'User is not banned';
                    }
                }
                return msg.channel.createMessage(`An error has occured: **${err}** `);
            });
        }
        else if (3 < member.length < 15) {
            member = "" + member;
            member = member.toLowerCase();
            var validUser = true;
            var hmm = 0;
                msg.channel.guild.getBans().then((users) => {
                    while (hmm <= Object.keys(users).length) {
                        users.forEach(function(user) {
                            var bannedUser = user.user.username.toLowerCase();
                            var userID = user.user.id;
                            hmm++;
                            if (member != bannedUser) return;
                            hmm = 1000;
                            msg.channel.guild.unbanMember(userID, reason).then(() => {
                                msg.channel.createMessage(`Successfully unbanned **${user.user.username}#${user.user.discriminator}**`);
                            }).catch((err) => {
                                if (err.message.toLowerCase().includes('forbidden')) {
                                    err = 'Invalid permissions!';
                                }
                                return msg.channel.createMessage(`An error has occured: \`${err}\` `);
                            });
                        });
                    }
                    if (hmm < 1000) {
                        msg.channel.createMessage('Invalid user ');
                    }
                });
        }
        else {
            return msg.channel.createMessage('Invalid user ');
        }
        
        
    }, {
        description: 'Unban.',
        fullDescription: 'Unban a user off the Hub Network.',
        requirements: {
            roleIDs: ['323271790291845120'],
        },
    });
    bot.register('report', (msg, args) => {
        if (args.length === 0) return 'Usage: `!report [staff] @User#1234 <Reason...>`';
        if (msg.channel.type === 1) {
            return 'This command does not work in DMs, sorry about that.';
        }
        var STAFF_ROLE_IDS = [
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
        description: 'Report a user/staff, more info in <#394698464253968394>.',
        fullDescription: 'Report a user/staff that you think is breaking the rules or abusing their permissions.',
        requirements: {
            roleIDs: null,
        },
    });
};
