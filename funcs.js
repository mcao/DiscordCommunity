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

    bot.incrementMessages = function (msg) {
        var ranks = this.loadRanks();
        
    }

    bot.loadRanks = function () {
        var ranksJson = fs.readFileSync("./ranks.json"),
            ranks = JSON.parse(ranksJson)

        bot.log("[LEVELS] Ranks successfully loaded!")
        return ranks;
    }

    bot.writeRanks = function (levels) {
        fs.writeFileSync("./ranks.json", JSON.stringify(levels, null, 3));
        bot.log("[LEVELS] Ranks successfully saved to file!")
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