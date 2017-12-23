module.exports = (bot) => {
    const fs = require("fs");
    bot.config = require("./config.json")

    bot.register = function (name, command, options) {
        if (bot.commands[name]) {
            bot.log(`Reloading command: ${name}`)
            bot.unregisterCommand(name)
            bot.registerCommand(name, command, options)
        } else {
            bot.log(`Registering command: ${name}`)
            bot.registerCommand(name, command, options)
        }
    }

    bot.incrementMessage = function (msg) {
        if (bot.ranks[msg.author.id]) {
            bot.ranks[msg.author.id].messageCount++;
            var ranks = require('./modules/ranklist.json')
            for (var i = 0; i < ranks.length; i++) {
                if (bot.ranks[msg.author.id].messageCount > ranks[i].points && 
                    bot.ranks[msg.author.id].lastRankAssignment - 1 < i &&
                    ranks[i].points > -1) {
                        var role = msg.channel.guild.roles.get(ranks[i].id)
                        bot.createMessage(msg.channel.id, "YOU HAVE GOTTEN TO " + role.name + "!!!!")
                    }
            }
        } else {
            bot.ranks[msg.author.id] = {
                id: msg.author.id,
                inServer: 1,
                messageCount: 1,
                lastRankAssignment: 0
            }
        }
    }

    bot.loadRanks = function () {
        var ranksJson = fs.readFileSync("./ranks.json")
        bot.ranks = JSON.parse(ranksJson)

        bot.log("[LEVELS] Ranks successfully loaded!")
    }

    bot.writeRanks = function () {
        fs.writeFileSync("./ranks.json", JSON.stringify(bot.ranks, null, 3));
        bot.log("[LEVELS] Ranks successfully saved to file!")
        bot.backupRanks();
    }

    bot.backupRanks = function () {
        var ranksJson = fs.readFileSync("./ranks.json"),
            ranks = JSON.parse(ranksJson),
            d = new Date().getDate(),
            m = new Date().getMonth() + 1,
            y = new Date().getFullYear();
        fs.writeFileSync(`ranks-${d}-${m}-${y}.json`, JSON.stringify(ranks, null, 3))
        bot.log("[LEVELS] Ranks successfully backed up!")
    }

    bot.log = function (txt) {
        console.log(this.timestamp() + "  [LOG]  | " + txt)
    }

    bot.timestamp = function () {
        var currentTime = new Date(),
            hours = currentTime.getHours(),
            minutes = currentTime.getMinutes(),
            seconds = currentTime.getSeconds()
        if (minutes < 10)
            minutes = "0" + minutes;
        if (seconds < 10)
            seconds = "0" + seconds;
        return '[' + hours + ':' + minutes + ':' + seconds + ']';
    }
}