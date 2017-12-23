
/*{
    id: "",
    inServer: 0,
    messageCount: 0000,
    lastRankAssignment: 124677
}*/

module.exports = (bot) => {
    var levels = bot.loadRanks()

    bot.register("ranks", (msg, args) => {
        var ranks = require('./ranks.json'),
            m = ""
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
}