
/*{
    id: "",
    inServer: 0,
    messageCount: 0000,
    lastRankAssignment: 124677
}*/

module.exports = (bot) => {

}bot.register("ranks", (msg, args) => {
    var ranks = require('./ranklist.json'),
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

bot.register("rank", (msg, args) => {
    var ranks = require('./ranklist.json'),
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
        description: "Checks a user's rank on the server.",
        fullDescription: "This command is used to check a user's rank.",
        requirements: {
            roleIDs: ['392169263982444546', '392157677184221185', '392150288729112587']
        }
    });