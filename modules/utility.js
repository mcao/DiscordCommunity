module.exports = (bot) => {
    bot.registerCommand("ping", (msg, args) => {
        var start = new Date(msg.timestamp).getTime();
        bot.createMessage(msg.channel.id, "Pong!")
            .then(msg => msg.edit("Pong! **" + (new Date(msg.timestamp).getTime() - start) + "ms**"))
            .catch(console.error);
    },
        {
            description: "Pong!",
            fullDescription: "This command is used to check the bot's latency, or if it's up."
        });

    bot.registerCommand("eval", (msg, args) => {
        try {
            var res = eval(args.join(" "))
        } catch (err) {
            var res = err
        }
        return "```js\n" + res + "```"
    },
        {
            requirements: {
                userIDs: ["112667714530652160", "171319044715053057"]
            },
            description: "Evaluates code",
            fullDescription: "This command is used to evaluate code on the bot."
        });

    bot.registerCommand("exec", (msg, args) => {
        try {
            var res = require("child_process").execSync(args.join(" "))
        } catch (err) {
            var res = err
        }
        return "```LIDF\n" + res + "```"
    },
        {
            requirements: {
                userIDs: ["112667714530652160", "171319044715053057"]
            },
            description: "Executes to command line",
            fullDescription: "This command is used to execute command line commands."
        });
}