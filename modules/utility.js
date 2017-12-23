const readdir = require("fs").readdir,
    writeFile = require("fs").writeFileSync,
    util = require("util"),
    hastebin = require('hastebin-gen');

module.exports = (bot) => {
    bot.register("ping", (msg, args) => {
        var start = new Date(msg.timestamp).getTime();
        bot.createMessage(msg.channel.id, "Pong!")
            .then(msg => msg.edit("Pong! **" + (new Date(msg.timestamp).getTime() - start) + "ms**"))
            .catch(console.error);
    },
        {
            description: "Pong!",
            fullDescription: "This command is used to check the bot's latency, or if it's up."
        });

    bot.register("eval", (msg, args) => {
        var code = args.join(" ");
        try {
            let evaled = eval(code);
            let type = typeof evaled || 'undefined';
            let insp = util.inspect(evaled, {
                depth: 1
            });

            if (evaled === null) evaled = 'null';

            let toStr = clean(insp.toString().replace(bot.token, 'REDACTED'));

            if (toStr.length > 1500) {
                hastebin(toStr, "js").then(r => {
                    bot.createMessage(msg.channel.id, "Output too large. Posted to " + r);
                });
            } else {
                return "**Result:**\n```js\n" + toStr + "```\n**Type:**\n```js\n" + type + "```"
            }
        } catch (err) {
            return "```js\n" + clean(err.message) + "```"
        }
    },
        {
            requirements: {
                userIDs: bot.config.owners
            },
            description: "Evaluates code",
            fullDescription: "This command is used to evaluate code on the bot."
        });

    bot.register("exec", (msg, args) => {
        try {
            var res = require("child_process").execSync(args.join(" "))
        } catch (err) {
            var res = err
        }
        return "```LIDF\n" + res + "```"
    },
        {
            requirements: {
                userIDs: bot.config.owners
            },
            description: "Executes to command line",
            fullDescription: "This command is used to execute command line commands."
        });

    bot.register("update", function (msg, args) {
        bot.createMessage(msg.channel.id, "Updating...").then(e => {
            var evaled = require("child_process").execSync('git pull').toString()
            bot.createMessage(e.channel.id, "```" + evaled + "```")
            if (evaled.indexOf("Already up-to-date.") < 0) {
                bot.createMessage(e.channel.id, "New code successfully pulled! Restarting...")
                setTimeout(function () {
                    process.exit(0)
                }, 2000);
            }
        })
    },
        {
            requirements: {
                userIDs: bot.config.owners
            },
            description: "Updates the bot's code.",
            fullDescription: "This command is used to update the bot's code on Github."
        });

    bot.register("restart", function (msg, args) {
        bot.createMessage(msg.channel.id, "Restarting...")
        writeFile("../channel.txt", msg.channel.id)
        setTimeout(() => {process.exit(0)}, 2000);
    },
        {
            requirements: {
                userIDs: bot.config.owners
            },
            description: "Restart the bot.",
            fullDescription: "This command is used to restart the bot."
        });

    bot.register("reload", (msg, args) => {
        if (args[0] == "reload") return "Please specify a module name!"
        readdir('./modules/', (err, files) => {
            files.forEach(f => {
                if (args[0] == "all") {
                    delete require.cache[require.resolve(`./${f}`)];
                    require(`./${f}`)(bot)
                    bot.createMessage(msg.channel.id, `Module \`${f}\` successfully reloaded!`)
                } else if (f.indexOf(args[0]) > -1) {
                    delete require.cache[require.resolve(`./${f}`)];
                    require(`./${f}`)(bot)
                    bot.createMessage(msg.channel.id, `Module \`${f}\` successfully reloaded!`);
                    return;
                } else {
                    bot.createMessage(msg.channel.id, "Module does not exist!");
                    return;
                }
            })
        })
    }, {
            requirements: {
                userIDs: bot.config.owners
            },
            description: "Reloads a module",
            fullDescription: "This command is used to reload modules."
        })

    function clean(text) {
        if (typeof (text) === "string") {
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        }
        else {
            return text;
        }
    }
}