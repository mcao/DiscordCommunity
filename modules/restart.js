const writeFile = require("fs").writeFileSync;

module.exports = (bot) => {
    bot.register("restart", function(msg, args) {
        bot.createMessage(msg.channel.id, "Restarting...").then(m => {
            writeFile("./channel.json", `{ "channel" : "${m.channel.id}", "message": "${m.id}" }`)
        })
        bot.writeProfiles()
        setTimeout(() => { process.exit(0) }, 1000);
    }, {
        requirements: {
            userIDs: bot.config.owners
        },
        description: "Restart the bot.",
        fullDescription: "This command is used to restart the bot."
    });
}