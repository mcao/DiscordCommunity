
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
        bot.register("leaderboard", (msg, args) => {
            let embed = {
                title: "Leaderboard",
                color: 0xffffff,
                fields: []
            }
            var leaderboard = bot.getLeaderboard();
            var userIDs = leaderboard[0];
            var messageCount = leaderboard[1];
            for(let i = 0; i < 20; i++) {
                embed.fields.push({name: `#${i + 1}`, value: `<@${userIDs[i]}> - ${messageCount[i]} messages`});
            }
                
            bot.createMessage(msg.channel.id, {embed: embed});
        },
        {
            reactionButtons: [ // Add reaction buttons to the command
                {
                    emoji: "⬅",
                    type: "edit",
                    response: (msg) => { // Reverse the message content
                        return msg.content.split().reverse().join();
                    }
                },
                {
                    emoji: "🔁",
                    type: "edit", // Pick a new pong variation
                    response: ["Pang!", "Peng!", "Ping!", "Pong!", "Pung!"]
                },
                {
                    emoji: "⏹",
                    type: "cancel" // Stop listening for reactions
                }
            ],
            reactionButtonTimeout: 30000,
            description: "Shows the leaderboard.",
            fullDescription: "Shows the top 10 users with the most message count.",
        });
        bot.register("reset", (msg, args) => {
            var user = msg.mentions[0].id;
            if (args.length === 0) return bot.createMessage(msg.channel.id, 'Please provide a user.');
            if (msg.mentions[0].bot) return bot.createMessage(msg.channel.id, 'Bots don\'t have ranks!');
            if (!msg.mentions[0] && args.length !== 18) return bot.createMessage(msg.channel.id, 'Invalid user.')
            if (args.length === 18 && typeof args === 'number') user = args;
            const levelRoles = ['393606932608450561', '393606931014746113', '393606929068589057', '393606926467989507', '393606924433752064'];
            levelRoles.forEach(function(role) {
                const person = msg.channel.guild.members.get(user);
                if (!person.roles.includes(role)) return;
                person.removeRole(role, `Rank resetted | Done by: ${msg.author.username}#${msg.author.discriminator}`);
            });
            bot.resetMessages(user);
            bot.createMessage(msg.channel.id, `Reset the level for <@${user}>.`);
        },
        {
            description: "Resets a level.",
            fullDescription: "Resets the message count for the given user.",
            requirements: {
                roleIDs: ['392157971507052554']
            }
    });
    bot.register("rank", (msg, args) => {
        if (msg.mentions[0] && msg.mentions[0].username) {
            if (msg.mentions[0].bot) return bot.createMessage(msg.channel.id, "Bots don't have ranks!");
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