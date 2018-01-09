module.exports = bot => {
    const fs = require('fs');
    bot.config = require('./config.json');

    bot.cooldowns = new Set();

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
        // let messageCounts = leaderboard[1];
        var non_leaderboard = users.splice(20);
        users.forEach(v => {
            bot.addGuildMemberRole('358528040617377792', v.toString(), '393606924433752064', 'User reached top 20');
        });

        // let d = bot.guilds.find(v => v.id === '358528040617377792');
        // let members = d.members.map(v => v);
        non_leaderboard.forEach(v => {
            bot.removeGuildMemberRole('358528040617377792',
                v.toString(), '393606924433752064', 'Lost Top 20').then().catch();
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
                    msg.member.addRole(role.id);
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

    bot.tickets = {};

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
