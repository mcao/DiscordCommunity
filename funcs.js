module.exports = bot => {
    const fs = require('fs');
    bot.config = require('./config.json');

    bot.cooldowns = new Set();
    bot.runninggames = new Set();
    bot.randomnumber = 0;
    bot.guesscounter = 0;
    bot.guesstries = 15;

    bot.register = function(name, command, options) {
        if (bot.commands[name]) {
            bot.log(`Reloading command: ${name}`);
            bot.unregisterCommand(name);
            bot.registerCommand(name, command, options);
        } else {
            bot.log(`Registering command: ${name}`);
            bot.registerCommand(name, command, options);
        }
    };

    bot.reactions = [];

    bot.chunkArray = function(myArray, chunk_size) {
        var index = 0;
        var arrayLength = myArray.length;
        var tempArray = [];

        for (index = 0; index < arrayLength; index += chunk_size) {
            var myChunk = myArray.slice(index, index + chunk_size);
            // Do something if you want with the group
            tempArray.push(myChunk);
        }

        return tempArray;
    };

    bot.warn = function(userid, modid, reason, channelid) {
        bot.profiles[userid].warnings.push({ user: userid, mod: modid, reason: reason, channel: channelid });
    };

    bot.twentyFourHourTimer = function() {
        setInterval(() => {
            if (new Date().getHours() === 0 && new Date().getMinutes() === 0) {
                for (var key in bot.profiles) {
                    if (bot.profiles.hasOwnProperty(key)) {
                        bot.profiles[key].messageCount = Math.ceil(bot.profiles[key].messageCount * 0.98);
                    }
                }
                bot.log('Deducted 2% from levels!');
                bot.writeProfiles();
            }
        }, 60000);
    };

    bot.resetMessages = function(userID) {
        bot.profiles[userID].messageCount = 0;
        bot.profiles[userID].lastRoleAssigned = 0;
    };

    bot.getLeaderboard = function() {
        let userIDs = Object.keys(bot.profiles).sort((a, b) => {
            let IDs = bot.profiles[b].messageCount - bot.profiles[a].messageCount;
            return IDs;
        });
        let messageCount = [];
        userIDs.forEach(hi => {
            messageCount.push(bot.profiles[hi].messageCount);
        });
        const result = [userIDs, messageCount];
        return result;
    };

    bot.topTwenty = () => {
        let leaderboard = bot.getLeaderboard();
        let users = leaderboard[0];
        var non_leaderboard = users.splice(20);
        users.forEach(v => {
            if (!bot.guilds.get('358528040617377792').members.get(v)) delete bot.profiles[v]
            else bot.addGuildMemberRole('358528040617377792', v, '393606924433752064', 'User reached top 20');
        });

        non_leaderboard.forEach(v => {
            if (!bot.guilds.get('358528040617377792').members.get(v)) delete bot.profiles[v];
            else bot.removeGuildMemberRole('358528040617377792', v, '393606924433752064', 'Lost Top 20').then(() => {}).catch(() => {});
        });
    };

    bot.incrementMessage = function(msg) {
        if (bot.profiles[msg.author.id]) {
            bot.profiles[msg.author.id].messageCount++;
            var profiles = require('./modules/ranklist.json');
            for (var i = 0; i < profiles.length; i++) {
                if (bot.profiles[msg.author.id].messageCount > profiles[i].points &&
                    bot.profiles[msg.author.id].lastRankAssignment - 1 < i &&
                    profiles[i].points > -1) {
                    var role = msg.channel.guild.roles.get(profiles[i].id);
                    bot.createMessage(msg.channel.id,
                        `Congratulations <@${msg.author.id}>, you have achieved **${role.name}**! 🎉🎉🎉`);
                    bot.profiles[msg.author.id].lastRankAssignment++;
                    msg.addReaction('🎉');
                    msg.member.addRole(role.id).then(
                        /* on succes we log the success! */
                        () => bot.log(`**DEBUG** Added ${role.name} to ${msg.author.username} successfully!`),
                        /* on failure we log the failure! */
                        () => bot.log(`**DEBUG** Failed to add <@&${role.id}> to <@${msg.author.id}>!`)
                    );
                    if (i > 0) msg.member.removeRole(msg.channel.guild.roles.get(profiles[i - 1].id).id);
                }
            }
        } else {
            bot.profiles[msg.author.id] = {
                id: msg.author.id,
                inServer: 1,
                messageCount: 1,
                lastRankAssignment: 0,
                warnings: [

                ],
            };
        }
    };

    bot.sendModLog = (type, user, moderator, reason) => {
        let color;
        let word;
        switch (type) {
            case 'ban':
                color = 14175787;
                word = 'banned';
                break;
            case 'kick':
                color = 15696398;
                word = 'kicked';
                break;
            case 'mute':
                color = 4880836;
                word = 'muted';
                break;
            case 'warn':
                color = 5030984;
                word = 'warned';
                break;
            default:
                color = 7500402;
                word = type;
        }

        let orig_user = user;
        let orig_mod = moderator;

        if (typeof user === require('eris"').Member) user = user.user;
        if (typeof moderator === require('eris').Member) moderator = moderator.user;

        bot.getChannel('401764985153388550').then(channel => {
            channel.createMessage({
                embed: {
                    title: `${user.username} has been ${word}`,
                    color: color,
                    timestamp: (new Date()).toISOString(),
                    footer: {
                        text: orig_user.guild ? orig_user.guild : 'Unknown guild',
                        icon_url: orig_user.guild ? orig_user.guild.iconURL : 'https://cdn.discordapp.com/embed/avatars/0.png',
                    },
                    thumbnail: {
                        url: user.avatarURL
                    },
                    fields: [
                        {
                            name: 'Member',
                            value: `${user.username}#${user.discriminator} - ${user.id}`,
                        },
                        {
                            name: 'Moderator',
                            value: `${moderator.username}#${moderator.discriminator} - ${moderator.id}`,
                        },
                        {
                            name: 'Reason',
                            value: reason,
                        },
                        {
                            name: 'Total Warnings',
                            value: bot.profiles[user.id] ? bot.profiles[user.id].warnings.length ? '0',
                            inline: true,
                        },
                        {
                            name: 'Total Mutes',
                            value: '0',
                            inline: true,
                        },
                    ],
                },
            });
        });
    };

    bot.loadProfiles = function() {
        var profilesJson = fs.readFileSync('./profiles.json');
        bot.profiles = JSON.parse(profilesJson);
        bot.log('[PROFILES] Profiles successfully loaded!');
        return 'Profiles successfully loaded!';
    };

    bot.writeProfiles = function() {
        var profilesJson = fs.readFileSync('./profiles.json'),
            profiles = JSON.parse(profilesJson);

        // Only writes if there's a difference
        if (JSON.stringify(profiles) === JSON.stringify(bot.profiles)) return;

        fs.writeFileSync('./profiles.json', JSON.stringify(bot.profiles, null, 3));
        bot.log('[PROFILES] Profiles successfully saved to file!');
        bot.backupProfiles();
    };

    bot.backupProfiles = function() {
        var profilesJson = fs.readFileSync('./profiles.json'),
            profiles = JSON.parse(profilesJson),
            d = new Date().getDate(),
            m = new Date().getMonth() + 1,
            y = new Date().getFullYear();
        fs.writeFileSync(`profiles-${d}-${m}-${y}.json`, JSON.stringify(profiles, null, 3));
        bot.log('[PROFILES] Profiles successfully backed up!');
        return 'Profiles successfully backed up!';
    };

    bot.log = function(txt) {
        bot.createMessage(bot.config.logChannel, txt);
        console.log(`${this.timestamp()}  [LOG]  | ${txt}`);
    };

    bot.totalMail = 0;

    bot.tickets = {};

    bot.newTicket = function(user, channel) {
        var nextTicket = Object.keys(bot.tickets).length + 1;
        bot.tickets[nextTicket] = {
            userID: user,
            channelID: channel,
            takenBy: null,
            taken: false,
            finished: false,
        };
    };

    bot.timestamp = function() {
        var currentTime = new Date(),
            hours = currentTime.getHours(),
            minutes = currentTime.getMinutes(),
            seconds = currentTime.getSeconds();
        if (minutes < 10) minutes = '0' + minutes;
        if (seconds < 10) seconds = '0' + seconds;
        return `[${hours}:${minutes}:${seconds}]`;
    };
};
