
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
        bot.createMessage(msg.channel.id, m);
    },
        {
            description: "Outputs a list of ranks for the server.",
            fullDescription: "This command is used to return a list of the server's ranks.",
            requirements: {
                roleIDs: ['392169263982444546', '392157677184221185', '392150288729112587']
            }
        });

    bot.register("rank", (msg, args) => {
        if (msg.mentions[0] && msg.mentions[0].username) {
            if (bot.profiles[msg.mentions[0].id]) {
                if (bot.profiles[msg.mentions[0].id].lastRankAssignment - 1 > -1)
                    var rank = msg.channel.guild.roles.get(ranks[bot.profiles[msg.mentions[0].id].lastRankAssignment].id).name
                else
                    var rank = "None"

                bot.createMessage(msg.channel.id,
                    `**${msg.mentions[0].username}#${msg.mentions[0].discriminator}**
**Messages:** ${bot.profiles[msg.mentions[0].id].messageCount}
**Rank:** ${rank}`)
            } else {
                bot.createMessage(msg.channel.id, "It looks like this person has no ranking yet :cry:")
            }
        } else if (bot.profiles[msg.author.id]) {
            if (bot.profiles[msg.author.id]) {
                if (bot.profiles[msg.author.id].lastRankAssignment - 1 > -1)
                    var rank = msg.channel.guild.roles.get(ranks[bot.profiles[msg.author.id].lastRankAssignment].id).name
                else
                    var rank = "None"
                bot.createMessage(msg.channel.id,
                    `**${msg.author.username}#${msg.author.discriminator}**
**Messages:** ${bot.profiles[msg.author.id].messageCount}
**Rank:** ${rank}`)
            } else {
                bot.createMessage(msg.channel.id, "It looks like you have no ranking yet :cry:")
            }
        }
    },
        {
            description: "Checks a user's rank on the server.",
            fullDescription: "This command is used to check a user's rank.",
            requirements: {
                roleIDs: ['392169263982444546', '392157677184221185', '392150288729112587']
            }
        });
}