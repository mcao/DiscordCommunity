var ranks = require('./ranklist.json')

module.exports = (bot) => {
    bot.register("ranks", (msg, args) => {
        var m = ""
        for (var i = 0; i < ranks.length; i++) {
            var role = msg.channel.guild.roles.get(ranks[i].id)
            if (ranks[i].points > -1) {
                m += `**${role.name}** - ${ranks[i].points} Messages\n`
            } else {
                m += `**${role.name}** - Top ${ranks[i].condition}\n`
            }
        }
        return m;
    }, {
        description: "Outputs a list of ranks for the server.",
        fullDescription: "This command is used to return a list of the server's ranks."
    });

    bot.register("leaderboard", (msg, args) => {
        var start = 0,
            end = 20
        var leaderboard = bot.getLeaderboard();
        var userIDs = leaderboard[0];
        var messageCount = leaderboard[1];
        var str = `\`\`\`Leaderboard for ${msg.channel.guild.name} | Page 1`
        for (let i = start; i < end; i++) {
            if (bot.users.get(userIDs[i]))
                var user = bot.users.get(userIDs[i]).username
            else
                var user = "Unknown"
            str += `\n#${i + 1}: ${user} - ${messageCount[i]} messages`
        }
        str += "\`\`\`"

        return str
    }, {
        aliases: ["lb"],
        reactionButtons: [{
                emoji: "◀",
                type: "edit",
                response: (msg, args) => {
                    if (msg.reactions["◀"].count == 1) {
                        return msg.content
                    }
                    msg.getReaction("◀").then((users) => { users.forEach((v) => { if (v.id != bot.user.id) { msg.removeReaction("◀", v.id) } }) });
                    var i = (msg.content.substring(msg.content.indexOf("Page") + 5, msg.content.indexOf("Page") + 6) * 1)
                    if (i - 1 < 1) return null;
                    var start = ((i - 2) * 20);
                    var end = start + 20;
                    var leaderboard = bot.getLeaderboard();
                    var userIDs = leaderboard[0];
                    var messageCount = leaderboard[1];
                    var str = `\`\`\`Leaderboard for ${msg.channel.guild.name} | Page ${i - 1}`
                    while (start < end && userIDs[start]) {
                        if (bot.users.get(userIDs[start]))
                            var user = bot.users.get(userIDs[start]).username
                        else
                            var user = "Unknown"
                        str += `\n#${start + 1}: ${user} - ${messageCount[start]} messages`
                        start++;
                    }
                    str += `\`\`\``
                    return str;
                }
            },
            {
                emoji: "🔵",
                type: "cancel"
            },
            {
                emoji: "▶",
                type: "edit",
                response: (msg, args) => {
                    if (msg.reactions["▶"].count == 1) {
                        return msg.content
                    }
                    msg.getReaction("▶").then((users) => { users.forEach((v) => { if (v.id != bot.user.id) { msg.removeReaction("▶", v.id) } }) });
                    var i = (msg.content.substring(msg.content.indexOf("Page") + 5, msg.content.indexOf("Page") + 6) * 1)
                    var start = i * 20;
                    var end = start + 20;
                    var leaderboard = bot.getLeaderboard();
                    var userIDs = leaderboard[0];
                    var messageCount = leaderboard[1];
                    var str = `\`\`\`Leaderboard for ${msg.channel.guild.name} | Page ${i + 1}`
                    while (start < end && userIDs[start]) {
                        if (bot.users.get(userIDs[start]))
                            var user = bot.users.get(userIDs[start]).username
                        else
                            var user = "Unknown"
                        str += `\n#${start + 1}: ${user} - ${messageCount[start]} messages`
                        start++;
                    }
                    str += `\`\`\``
                    return str;
                }
            }
        ],
        reactionButtonTimeout: 30000,
        description: "Shows the leaderboard.",
        fullDescription: "Shows the top 10 users with the most message count."
    });

    bot.register("rank", (msg, args) => {
        if (msg.mentions[0] && msg.mentions[0].username || args.length == 18 || args.length == 17) {
            if (args.length == 18 && msg.channel.guild.members.get(args).bot) return "Bots don't have ranks!";
            if (msg.mentions[0].bot) return "Bots don't have ranks!"
            if (bot.profiles[msg.mentions[0].id] || bot.profiles[args]) {
                var id;
                var user;
                if (bot.profiles[args]) {
                    id = args;
                    user = msg.channel.guild.members.get(args);
                }
                if (bot.profiles[msg.mentions[0].id]) {
                    id = msg.mentions[0].id;
                    user = msg.mentions[0]
                }
                if (bot.profiles[id].lastRankAssignment - 1 > -1)
                    var rank = msg.channel.guild.roles.get(ranks[bot.profiles[id].lastRankAssignment - 1].id).name
                else
                    var rank = "None"


                bot.createMessage(msg.channel.id, {
                    embed: {
                        title: `${user.username}#${user.discriminator}`,
                        author: {
                            name: "Discord Community",
                            icon_url: "https://cdn.discordapp.com/avatars/392450607983755264/071e72220fae40698098221d52df3e5f.jpg?size=256"
                        },
                        timestamp: new Date(),
                        fields: [{
                                name: "Message count",
                                value: `${bot.profiles[id].messageCount}`,
                                inline: true
                            },
                            {
                                name: "Highest rank",
                                value: `${rank}`,
                                inline: true
                            }
                        ],
                        thumbnail: {
                            url: user.avatarURL.replace("?size=128", "")
                        }
                    }
                });
            } else {
                return "It looks like this person has no ranking yet <:bexcry:397690294990143488>"
            }
        } else if (bot.profiles[msg.author.id]) {
            if (bot.profiles[msg.author.id]) {
                if (bot.profiles[msg.author.id].lastRankAssignment - 1 > -1)
                    var rank = msg.channel.guild.roles.get(ranks[bot.profiles[msg.author.id].lastRankAssignment - 1].id).name
                else
                    var rank = "None"

                let user = msg.author;
                bot.createMessage(msg.channel.id, {
                    embed: {
                        title: `${user.username}#${user.discriminator}`,
                        author: {
                            name: "Discord Community",
                            icon_url: "https://cdn.discordapp.com/avatars/392450607983755264/071e72220fae40698098221d52df3e5f.jpg?size=256"
                        },
                        fields: [{
                                name: "Message count",
                                value: `${bot.profiles[user.id].messageCount}`,
                                inline: true
                            },
                            {
                                name: "Highest rank",
                                value: `${rank}`,
                                inline: true
                            }
                        ],
                        thumbnail: {
                            url: user.avatarURL.replace("?size=128", "")
                        }
                    }
                });
            } else {
                return "It looks like you have no ranking yet <:bexcry:397690294990143488>"
            }
        }
    }, {
        description: "Checks a user's rank on the server.",
        fullDescription: "This command is used to check a user's rank."
    });
}