var levels = this.loadRanks(),
    ranks = require('./ranks.json');
    
/*{
    id: "",
    inServer: 0,
    messageCount: 0000,
    lastRankAssignment: 124677
}*/

module.exports = (bot) => {
    bot.register("ranks", (msg, args) => {
        var m = "";
        for (var i = 0; i < ranks.length; i++) {
            if (ranks[i].points > -1) {
                m += `**${msg.channel.guild.roles.get(ranks[i].id).name}** - ${ranks[i].points} Messages`
            } else { 
                m += `**${msg.channel.guild.roles.get(ranks[i].id).name}** - Top ${ranks[i].condition}`
            }
        }
        bot.createMessage(msg.channel.id, m);
    },
        {
            description: "Outputs a list of ranks.",
            fullDescription: "This command is used to return a list of the server's ranks.",
            requirements: {
                roleIDs: ['392169263982444546', '392157677184221185', '392150288729112587']
            }
        });
}