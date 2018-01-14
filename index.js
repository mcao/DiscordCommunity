const { CommandClient } = require('eris-additions')(require('eris'));
var fs = require('fs'),
    readdir = require('fs').readdir,
    readFileSync = require('fs').readFileSync,
    hastebin = require('hastebin-gen'),
    HOME_GUILD = `358528040617377792`,
    VOTES = ['bexy:393137089622966272', 'bexn:393137089631354880'],
    TEST_GUILD = `396914522801176577`;
var bot = new CommandClient(require('./config.json').token, {
    disableEvents: ['PRESENCE_UPDATE'],
}, require('./config.json').commandOpts);

require('./funcs.js')(bot);

if (process.argv && process.argv[2] === 'dev') console.log('[DEVELOPER MODE] Starting in Developer Mode...');
else console.log('Starting...');

bot.on('ready', () => {
    bot.log(`Logged in as ${bot.user.username}#${bot.user.discriminator}!`);

    bot.editStatus({
        name: `${bot.config.game} | ${bot.config.commandOpts.prefix[0]}help`,
    });

    readdir('./modules/', (err, files) => {
        if (err) console.log(err);
        bot.log(`Loading ${files.length} modules!`);
        files.forEach(f => {
            if (f.endsWith('.js')) {
                try {
                    require(`./modules/${f}`)(bot);
                } catch (e) {
                    bot.log(`Unable to load module ${f}: ${e}`);
                }
            }
        });
        bot.log(`Modules loaded!`);
    });

    bot.loadProfiles();
    bot.backupProfiles();
    bot.twentyFourHourTimer();

    setInterval(() => {
        bot.writeProfiles();
        bot.topTwenty();
    }, 300000);

    try {
        bot.getMessage(JSON.parse(readFileSync('./channel.json')).channel,
            JSON.parse(readFileSync('./channel.json')).message).then(msg => {
                msg.edit('Restarted!');
            });
    } catch (err) {
        bot.log(err);
    }
});

bot.on('messageCreate', msg => {
    if (msg.channel.type === 1) {
        msg.author.feedback = false;
        if (msg.content.toLowerCase().startsWith('start') || msg.content.toLowerCase().startsWith('begin')) {
            var subject;
            var detailedResponse;
            msg.author.getDMChannel().then(c => c.createMessage('Hi, thanks for contacting me! Would you like to submit some anonymous `feedback`, a `suggestion`, or `message` the mods?'));
            msg.channel.awaitMessages(m => m.content.toLowerCase() === 'message' && m.author.id === msg.author.id, { maxMatches: 1, time: 30000 }).then(responses => {
                if (responses) {
                    if (responses[0].content.toLowerCase() === 'cancel') return msg.channel.createMessage('<:bexn:393137089631354880> Process cancelled.');
                    msg.channel.createMessage('<:bexy:393137089622966272> Sure thing! What\'s the subject/topic of your mail?');
                    msg.channel.awaitMessages(m => m.author.id === msg.author.id || m.content.toLowerCase() === 'cancel', { maxMatches: 1, time: 20000 }).then(responses2 => {
                        if (responses2.length) {
                            subject = responses2[0].content;
                            msg.channel.createMessage('<:bexy:393137089622966272> Alright! Now please type your message and be as detailed as possible.');
                            msg.channel.awaitMessages(m => m.author.id === msg.author.id || m.content.toLowerCase() === 'cancel', { maxMatches: 1, time: 30000 }).then(responses3 => {
                                if (responses3.length) {
                                    if (responses3[0].content.toLowerCase() === 'cancel') return msg.channel.createMessage('<:bexn:393137089631354880> Process cancelled.');
                                    msg.channel.createMessage('<:bexy:393137089622966272> Thanks! We will get back to you as soon as possible.');
                                    detailedResponse = responses3[0].content;
                                    bot.createMessage('392442695756546059', `check devs server, new modmail arrived. i have been smarter, this is the modmail channel: yeah no this part breaks the bot everytime`);
                                    var embedy = {
                                        title: `New mail ${msg.author.username}#${msg.author.discriminator}`,
                                        description: `Ticket #`,
                                        author: {
                                            name: 'Discord Community',
                                            icon_url: 'https://cdn.discordapp.com/avatars/392450607983755264/071e72220fae40698098221d52df3e5f.jpg?size=256',
                                        },
                                        thumbnail: {
                                            url: msg.author.avatarURL.replace('?size=128', ''),
                                        },
                                        color: 0x71368a,
                                        fields: [
                                            {
                                                name: `Subject/topic:`,
                                                value: `${subject}`,
                                            },
                                        ],
                                        footer: {
                                            text: `Do "!claim ${nextTicket}" to claim this ticket.`,
                                        },
                                        timestamp: new Date(),
                                    };
                                    if (detailedResponse.length > 1024) {
                                        // Hastebin it
                                        hastebin(detailedResponse, 'txt').then(r => {
                                            var message = `The message was too long, it was sent to <${r}>`;
                                            embedy.fields.push({ name: 'Message:', value: message });
                                        });
                                    } else { embedy.fields.push({ name: 'Message:', value: `${detailedResponse}` }); }
                                    var nextTicket;
                                    var existingChan = bot.guilds.get(TEST_GUILD).channels.filter(c => c.name.includes(msg.author.username));
                                    // If there's already a channel for that user
                                    if (existingChan[0]) {
                                        nextTicket = existingChan[0].name.replace(`-${msg.author.id}`, ``);
                                        embedy.footer['text'] = `Do "!claim ${nextTicket}" to claim this ticket.`;
                                        embedy.description = `Ticket #${nextTicket}`;
                                        return existingChan[0].createMessage({ embed: embedy });
                                    } else {
                                        bot.newTicket(msg.author.id, msg.channel.id, null);
                                        const ticketsLength = Object.keys(bot.tickets).length;
                                        nextTicket = ticketsLength;
                                        embedy.footer['text'] = `Do "!claim ${nextTicket}" to claim this ticket.`;
                                        embedy.description = `Ticket #${nextTicket}`;
                                        var mailName = `${ticketsLength}-${msg.author.username}`;
                                        bot.createChannel(TEST_GUILD, mailName, 0, 'Mod mail', '398577703399194634').then(channel => {
                                            channel.edit({ topic: `User: ${msg.author.username}#${msg.author.discriminator}` });
                                            bot.createMessage('398565803613749259', { embed: embedy });
                                            channel.createMessage({ embed: embedy });
                                        });
                                    }
                                } else {
                                    return msg.channel.createMessage('<:bexn:393137089631354880> An error has occured. Either you have timed out or the response is below 10 characters long. Please start over again.');
                                }
                                return null;
                            });
                        }
                    });
                    msg.channel.awaitMessages(m => m.author.id === msg.author.id || m.content.toLowerCase() === 'cancel', { maxMatches: 1, time: 30000 }).then();
                }
                return null;
            });
        }
        msg.channel.awaitMessages(m => m.content.toLowerCase() === 'suggestion' && m.author.id === msg.author.id, { maxMatches: 1, time: 30000 }).then(responses => {
            if (responses.length) {
                msg.channel.createMessage('<:bexy:393137089622966272> Alright, what\'s the topic/subject of your suggestion? **Note:** This is not anonymous.');
                msg.channel.awaitMessages(m => m.author.id === msg.author.id || m.content.toLowerCase() === 'cancel', { maxMatches: 1, time: 30000 }).then(responses2 => {
                    if (responses2.length) {
                        if (responses2[0].content.toLowerCase() === 'cancel') return msg.channel.createMessage('<:bexn:393137089631354880> Process cancelled.');
                        subject = responses2[0].content;
                        msg.channel.createMessage('<:bexy:393137089622966272> Sweet! Now, please describe your suggestion and be as detailed as possible.');
                        msg.channel.awaitMessages(m => m.content.toLowerCase() === 'cancel' || m.content.length > 10, { maxMatches: 1, time: 300000 }).then(responses3 => {
                            if (responses3.length) {
                                if (responses3[0].content.toLowerCase() === 'cancel') return msg.channel.createMessage('<:bexn:393137089631354880> Process cancelled.');
                                msg.channel.createMessage('<:bexy:393137089622966272> Thank you so much for submitting your suggestion, we always appreciate suggestions to improve the community!');
                                detailedResponse = responses3[0].content;
                                var embedy = {
                                    title: `New suggestion!`,
                                    thumbnail: {
                                        url: `${msg.author.avatarURL.replace('?size=128', '')}`,
                                    },
                                    color: 0x71368a,
                                    fields: [
                                        {
                                            name: `Subject/topic:`,
                                            value: `${subject}`,
                                        },
                                    ],
                                    footer: {
                                        text: `Suggested by ${msg.author.username}#${msg.author.discriminator}`,
                                    },
                                    timestamp: new Date(),
                                };
                                if (detailedResponse.length > 1024) {
                                    // Hastebin it
                                    hastebin(detailedResponse, 'txt').then(r => {
                                        var message = `The message was too long, it was sent to <${r}>`;
                                        embedy.fields.push({
                                            name: 'Suggestion:',
                                            value: message,
                                        });
                                        bot.createMessage('392442695756546059',
                                            `**New suggestion submitted**\nby ${msg.author.username}#${msg.author.discriminator}\n\n**Subject/Topic:**\n${subject}**\n\nDescription:**\n${detailedResponse}`)
                                            .then(m => VOTES.forEach(vote => m.addReaction(vote)));
                                        // bot.createMessage('392178846306402314', {embed: embedy}).then(m => VOTES.forEach(function(vote) {m.addReaction(vote);}))
                                    });
                                } else {
                                    embedy.fields.push({
                                        name: 'Suggestion:',
                                        value: detailedResponse,
                                    });
                                    bot.createMessage('392442695756546059',
                                        `**New suggestion submitted**\nby ${msg.author.username}#${msg.author.discriminator}\n\n**Subject/Topic:**\n${subject}**\n\nDescription:**\n${detailedResponse}`)
                                        .then(m => VOTES.forEach(vote => m.addReaction(vote)));
                                    // bot.createMessage('392178846306402314', {embed: embedy}).then(m => VOTES.forEach(function(vote) {m.addReaction(vote);}))
                                }
                            } else {
                                return msg.channel.createMessage('<:bexn:393137089631354880> An error has occured. Either you have timed out or the response is below 10 characters long. Please start over again.');
                            }
                            return null;
                        });
                    }
                    return null;
                });
            }
        });
        msg.channel.awaitMessages(m => m.content.toLowerCase() === 'feedback' && m.author.id === msg.author.id, { maxMatches: 1, time: 30000 }).then(responses => {
            if (responses.length) {
                msg.channel.createMessage("<:bexy:393137089622966272> Nice, let's submit some feedback or a nice suggestion! First, what is the subject/topic gonna be?");
                msg.channel.awaitMessages(m => m.author.id === msg.author.id || m.content.toLowerCase() === 'cancel', { maxMatches: 1, time: 30000 }).then(responses2 => {
                    if (responses2.length) {
                        if (responses2[0].content.toLowerCase() === 'cancel') return msg.channel.createMessage('<:bexn:393137089631354880> Process cancelled.');
                        subject = responses2[0].content;
                        msg.channel.createMessage('<:bexy:393137089622966272> Awesome! Please describe as detailed as you can on how we can realize this suggestion or implement the feedback!');
                        msg.channel.awaitMessages(m => m.author.id === msg.author.id || m.content.toLowerCase() === 'cancel', { maxMatches: 1, time: 300000 }).then(responses3 => {
                            detailedResponse = responses3[0].content;
                            if (responses3.length) {
                                if (responses3[0].content.toLowerCase() === 'cancel') return msg.channel.createMessage('<:bexn:393137089631354880> Process cancelled.');
                                msg.channel.createMessage('<:bexy:393137089622966272> Thank you so much for your feedback! We promise to keep this anonymous.');
                                msg.author.feedback = true;
                                var embedy = {
                                    title: `NEW ANONYMOUS FEEDBACK!`,
                                    color: 0x71368a,
                                    fields: [
                                        {
                                            name: `Subject/topic:`,
                                            value: `${subject}`,
                                        },
                                    ],
                                    timestamp: new Date(),
                                };
                                if (detailedResponse.length > 1024) {
                                    hastebin(detailedResponse, 'txt').then(r => {
                                        var message = `The message was too long, it was sent to <${r}>`;
                                        embedy.fields.push({ name: 'Feedback:', value: message });
                                        bot.createMessage('392178846306402314', { embed: embedy }).then(m => VOTES.forEach(vote => { m.addReaction(vote); }));
                                    });
                                } else {
                                    embedy.fields.push({
                                        name: 'Feedback:',
                                        value: detailedResponse,
                                    });
                                    bot.createMessage('392178846306402314', { embed: embedy }).then(m => VOTES.forEach(vote => { m.addReaction(vote); }));
                                }
                            } else {
                                msg.channel.createMessage('<:bexn:393137089631354880> You took too long to reply, please try again.');
                            }
                            return null;
                        });
                    } else {
                        msg.channel.createMessage('<:bexn:393137089631354880> You took too long to reply, please try again.');
                    }
                    return null;
                });
            }
        });
    } else if (msg.channel.type === 0) {
        const reactions = ['#⃣', '🇭', '🇾', '🇵', '🇪', '✨',
            'bexhype:390557755339177994', 'bexlove:390556541717053440',
            'bexhey:390556541360799748', 'bexangry:390557738473881601',
            'hypekey:390416915207815168', 'nitro:390416828272476161',
            'love:390416915194970122', 'HypeMan:390416914826133505', 'wlove:390416915341901826'];
        const voteReactions = ['bexy:393137089622966272', 'bexn:393137089631354880'];
        const channels = ['392407095171088384', '392173071223750656', '392172869154635786', '392173094728630275'];
        //                      #fun-of-the-day
        if (msg.channel.id === '392407095171088384') {
            if (bot.reactions.length === 0) return;
            bot.reactions.forEach(reaction => {
                msg.addReaction(reaction);
            });
        }

        //                      #bot-commands
        if (msg.channel.id === '394698464253968394' && !isNaN(msg.content) && !msg.author.bot) {
            if (!bot.runninggames.has('guessit')) return;
            if (bot.guesstries === 0) {
                msg.channel.createMessage(`Ok you had your last chance. Guessing is over now! You failed to guess ${bot.randomnumber}. Sorry`);
                bot.runninggames.delete('guessit');
                bot.guesstries = 15;
            }
            if (msg.content === bot.randomnumber) {
                msg.channel.createMessage(`Hurray <@${msg.author.id}> you solved it!`);
                bot.runninggames.delete('guessit');
                bot.guesstries = 15;
            } else {
                if (msg.content > bot.randomnumber) {
                    msg.channel.createMessage(`Hmm, i guess you should aim lower than ${msg.content} ${msg.author.username}.`);
                } else if (msg.content < bot.randomnumber) {
                    msg.channel.createMessage(`Hmm, i guess you should aim higher than ${msg.content} ${msg.author.username}.`);
                }
                --bot.guesstries;
            }
        }

        //                      #introductions
        if (msg.channel.id === '392152654505050112') {
            msg.addReaction('bexhey:390556541360799748');
        } else if (channels.indexOf(msg.channel.id) > -1) {
            if (msg.content.toLowerCase().includes('poll')) return;
            for (var reaction in reactions) {
                msg.addReaction(reaction);
            }
        }
        // #staff-feedback
        if (msg.content.toLowerCase().startsWith('suggestion:') && msg.channel.id === '392178846306402314') {
            voteReactions.forEach(vote => {
                msg.addReaction(vote);
            });
        }
        if (!msg.author.bot && msg.channel.guild.id === HOME_GUILD) {
            if (!bot.cooldowns.has(msg.author.id)) {
                bot.cooldowns.add(msg.author.id);
                bot.incrementMessage(msg);
                setTimeout(() => {
                    bot.cooldowns.delete(msg.author.id);
                }, 3 * 1000);
            }
        }
        //                      #bot-commits                                GitHub-Webhook
        if (msg.channel.id === '397522914955755531' && msg.author.id === '392445621165883392') {
            if (!msg.embeds[0].title) return;
            if (process.argv && process.argv[2] === 'dev' && !msg.embeds[0].title.includes('dev')) return;
            else if (!msg.embeds[0].title.includes('master')) return;

            //                  #bot-development
            bot.createMessage('392442695756546059', 'Automatic Code Update Initiated.').then(() => {
                var evaled = require('child_process').execSync('git pull').toString();
                bot.createMessage('392442695756546059', 'Automatic Code Update Successful!');
                var desc = msg.embeds[0].description.toString();
                //                  #bot-development , @Michael ...
                bot.createMessage('392442695756546059',
                    `<@171319044715053057>, the following changes were pushed by **${desc.match(/.+\s-\s([\w\d-_]+)$/)[1] || 'Unknown'}**. Please approve the changes and restart the bot.\n\`\`\`${evaled}\`\`\``);
                return null;
            });
        }
    }
});

bot.on('guildMemberAdd', (guild, member) => {
    if (guild.id === HOME_GUILD) {
        bot.createMessage('392152516596465664', `Welcome to the official Discord Hub Community, <@${member.user.id}>! :tada::tada: Please remember to read the <#392171939101409290>.` +
            `\n\nYou will receive your Humans role in 2 minutes. Don't forget to post something in <#392152654505050112> if you'd like! <:bexlove:390556541717053440>.`);
        setTimeout(() => {
            member.addRole('392169263982444546', 'Autorole').catch();
        }, 2 * 60 * 1000);
    //     member.user.getDMChannel().then(channel => {
    //         // Community banner
    //         channel.createMessage(null, { file: fs.readFileSync('./images/community.png'), name: 'welcome.png' }).then(msg => {
    //             // Introduction text
    //             msg.channel.createMessage('Welcome to the **Discord Hub community!**\n\nThis server has the goal of being the biggest community server in all of Discord, ' +
    //                 'and is a project owned and moderated by the **Discord Hub Network**. <:bexnice:390556541591486464>').then(() => {
    //                     // Information banner
    //                     msg.channel.createMessage(null, { file: fs.readFileSync('./images/information.png'), name: 'info.png' }).then(() => {
    //                         // Information text
    //                         msg.channel.createMessage('**-**Events - we host large events from time to time and do some small fun daily events in <#392407095171088384>.\n\n' +
    //                             '**-**A Community - we are made **for you**, the community. Suggest features and updates in <#394720234684284948>.\n\n' +
    //                             '**-**Active and suits everyone - we make a great deal of making everyone feel a home, and hope you will help us and take part.\n\n' +
    //                             '**-**A custom super swag private bot that gives you roles depending on your activity! Do `!help` in <#394698464253968394> to see more.\n\n' +
    //                             '**-**A dedicated and active staff team - we do our very best to make this community the best and to make cool updates for you guys. \n\n' +
    //                             '**-**Do you love moderating communities? Do you love Discord? If so, apply to become staff here: <https://discord.guide/staff-application>.\n\n' +
    //                             '**-**Are you a content creator or community owner? Do you wanna partner with the hub? If yes, apply here: <https://discord.guide/partner-application>.\n' +
    //                             '**-**If you have any questions, concerns and private matters you wanna discuss, feel free to DM me (this bot) back or message one of the admins.\n\n\n' +
    //                             'Interested in seeing the role list of the **Hub Network** and how you can climb the ladder and become the master? Check it out!').then(() => {
    //                                 // Role list image
    //                                 msg.channel.createMessage('', { file: fs.readFileSync('./images/roles.png'), name: 'roles.png' }).then(() => {
    //                                     // Rules banner
    //                                     msg.channel.createMessage('', { file: fs.readFileSync('./images/rules.png'), name: 'rules.png' }).then(() => {
    //                                         // Rules text
    //                                         msg.channel.createMessage('**-**Be considerate for others and be responsible/respectful in all you say and do.\n\n' +
    //                                             '**-**Listen and cooperate with staff; refusing to do so may result in you being warned, kicked, and/or banned from the server.\n\n' +
    //                                             '**-**Please keep all posts and/or conversations in their respective text channels. Please also read the pinned tabs in the channels.\n\n' +
    //                                             '**-**This server is completely SFW. All NSFW will be deleted and a punishment will be issued depending on severity.\n\n' +
    //                                             '**-**Keep it cool - stick to the community guidelines at all time.\n\n' +
    //                                             '**NOTE:** Don’t forget to please <#392152654505050112>! We love to get to know new people! ' +
    //                                             'If you are a Discord Nitro, HypeSquad or Partner member, then ask to have a cool role assigned to you in your introduction!\n\n' +
    //                                             'Also, note that you, as a new members, will be restricted to the information channels, <#392152654505050112> and <#392152516596465664> for 2 minutes upon joining.\n' +
    //                                             'Please note that **we are not Discord Staff** and are **not associated with Discord in any way.** This server is purely a community for Discord Hub Network.\n\n' +
    //                                             'Invite your friends to join us via this link (**Although if you make your own invite and get 15 friends to join it, you will get a custom role!**)\n\nhttps://discord.gg/ATUtmyu');
    //                                     });
    //                                 });
    //                             });
    //                     });
    //                 });
    //         });
    //     });
    }
});

bot.on('guildBanAdd', (guild, user) => {
    setTimeout(() => {
        guild.getAuditLogs(2, null, 22).then(logs => {
            if (logs.entries[0].user.id === bot.user.id) return;

            bot.getChannel('401764985153388550').createMessage({
                embed: {
                    color: 8919211,
                    footer: {
                        icon_url: bot.users.get(logs.entries[0].user.id).avatarURL.replace('?size=128', ''),
                        text: 'Banned by ' + logs.entries[0].user.username + '#' + logs.entries[0].user.discriminator + ' | Banned User ID: ' + logs.entries[0].targetID,
                    },
                    thumbnail: {
                        url: bot.users.get(logs.entries[0].targetID).avatarURL.replace('?size=128', ''),
                    },
                    fields: [{
                        name: 'User Banned',
                        value: bot.users.get(logs.entries[0].targetID).username + '#' + bot.users.get(logs.entries[0].targetID).discriminator,
                        inline: true,
                    }, {
                        name: 'Banned In',
                        value: guild.name,
                        inline: true,
                    }, {
                        name: 'Ban Reason',
                        value: decodeURIComponent(logs.entries[0].reason) || 'Not Specified',
                        inline: true,
                    }],
                },
            });

            bot.getChannel('398936742532743188').createMessage({
                embed: {
                    color: 8919211,
                    footer: {
                        icon_url: bot.users.get(logs.entries[0].user.id).avatarURL.replace('?size=128', ''),
                        text: 'Banned by ' + logs.entries[0].user.username + '#' + logs.entries[0].user.discriminator + ' | Banned User ID: ' + logs.entries[0].targetID,
                    },
                    thumbnail: {
                        url: bot.users.get(logs.entries[0].targetID).avatarURL.replace('?size=128', ''),
                    },
                    fields: [{
                        name: 'User Banned',
                        value: bot.users.get(logs.entries[0].targetID).username + '#' + bot.users.get(logs.entries[0].targetID).discriminator,
                        inline: true,
                    }, {
                        name: 'Banned In',
                        value: guild.name,
                        inline: true,
                    }, {
                        name: 'Ban Reason',
                        value: decodeURIComponent(logs.entries[0].reason) || 'Not Specified',
                        inline: true,
                    }],
                },
            });

            var guilds = bot.guilds.map(g => { return g; });
            for (var i = 0; i < guilds.length; i++) {
                try {
                    if (guilds[i].id !== guild.id) {
                        bot.log(`Banning ${user.username} on ${guilds[i].name}!`);
                        guilds[i].banMember(user.id, 0, 'Automated Ban Sync - User banned on ' + guild.name + ' for ' + decodeURIComponent(logs.entries[0].reason));
                    }
                } catch (err) {
                    bot.getChannel('392897329721507850').createMessage(`Error: ${err.stack}`);
                }
            }
        });
    }, 5000);
});

bot.on('guildBanRemove', (guild, user) => {
    var guilds = bot.guilds.map(g => { return g; });
    for (var i = 0; i < guilds.length; i++) {
        try {
            if (guilds[i].id !== guild.id) {
                bot.log(`Unbanning ${user.username} on ${guilds[i].name}!`);
                guilds[i].unbanMember(user.id, 0, 'Automated Unban Sync - User unbanned on ' + guild.name);
            }
        } catch (err) {
            bot.getChannel('392897329721507850').createMessage(`Error: ${err.stack}`);
        }
    }
});

bot.on('messageReactionAdd', (message, emoji, user) => {
    if(message.id != '402221527854088194') return;
    message.channel.createMessage('AAAAAAAAAAAAA' + emoji.name);
});

bot.on('messageReactionAdd', (message, emoji, userID) => {
    if (message.id !== '399412466460655637') return;
    if (emoji.id !== '393137089622966272') return;
    var user = message.channel.guild.members.get(userID);
    if (!user.roles.indexOf('392169263982444546') > -1) user.addRole('392169263982444546', 'Verified');
});

process.on('uncaughtException', err => {
    console.error(err.stack);
});

process.on('unhandledRejection', err => {
    console.error(err.stack);
});

bot.connect();
