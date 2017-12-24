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

    bot.twentyFourHourTimer = function (msg) {
        setInterval(function () {
            if (new Date().getHours() == 0 && new Date().getMinutes() == 0) {
                for (var key in bot.profiles) {
                    if (bot.profiles.hasOwnProperty(key)) {
                        bot.profiles[key].messageCount = Math.ceil(bot.profiles[key].messageCount * 0.98);
                    }
                }
                bot.log("Deducted 2% from levels!")
                bot.writeProfiles()
            }
        }, 60000)
    }
    bot.resetMessages = function(userID) {
        bot.profiles[userID].messageCount = 0;
        
    }
    bot.incrementMessage = function (msg) {
        if (bot.profiles[msg.author.id]) {
            bot.profiles[msg.author.id].messageCount++;
            var profiles = require('./modules/ranklist.json')
            for (var i = 0; i < profiles.length; i++) {
                if (bot.profiles[msg.author.id].messageCount > profiles[i].points &&
                    bot.profiles[msg.author.id].lastRankAssignment - 1 < i &&
                    profiles[i].points > -1) {
                    var role = msg.channel.guild.roles.get(profiles[i].id)
                    bot.createMessage(msg.channel.id, `Congratulations <@${msg.author.id}>, you have achieved **${role.name}**! 🎉🎉🎉`)
                    bot.profiles[msg.author.id].lastRankAssignment++;
                    msg.addReaction("🎉");
                    msg.member.addRole(role.id);
                    if (i > 0)
                        msg.member.removeRole(msg.channel.guild.roles.get(profiles[i - 1].id).id)
                }
            }
        } else {
            bot.profiles[msg.author.id] = {
                id: msg.author.id,
                inServer: 1,
                messageCount: 1,
                lastRankAssignment: 0,
                warnings: [

                ]
            }
        }
    }

    bot.loadProfiles = function () {
        var profilesJson = fs.readFileSync("./profiles.json")
        bot.profiles = JSON.parse(profilesJson)
        bot.log("[PROFILES] Profiles successfully loaded!")
        return "Profiles successfully loaded!"
    }

    bot.writeProfiles = function () {
        var profilesJson = fs.readFileSync("./profiles.json"),
            profiles = JSON.parse(profilesJson)
        if (JSON.stringify(profiles) == JSON.stringify(bot.profiles)) return; // Only writes if there's a difference

        fs.writeFileSync("./profiles.json", JSON.stringify(bot.profiles, null, 3));
        bot.log("[LEVELS] Profiles successfully saved to file!")
        bot.backupProfiles();
        return "Profiles successfully saved to file!";
    }

    bot.backupProfiles = function () {
        var profilesJson = fs.readFileSync("./profiles.json"),
            profiles = JSON.parse(profilesJson),
            d = new Date().getDate(),
            m = new Date().getMonth() + 1,
            y = new Date().getFullYear();
        fs.writeFileSync(`profiles-${d}-${m}-${y}.json`, JSON.stringify(profiles, null, 3))
        bot.log("[PROFILE] Profiles successfully backed up!")
        return "Profiles successfully backed up!"
    }

    bot.log = function (txt) {
        console.log(this.timestamp() + "  [LOG]  | " + txt)
        bot.createMessage(bot.config.logChannel, txt);
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