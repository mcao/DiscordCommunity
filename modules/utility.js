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
    }, {
        description: "Pong!",
        fullDescription: "This command is used to check the bot's latency, or if it's up."
    });

    bot.register("nitro", (msg, args) => {
        if (args[0].length == 18) {
            var userID = args[0];
            var member = msg.channel.guild.members.get(userID);
            if (member.roles.indexOf('279991210356113408') == 0) {
                member.removeRole('279991210356113408', 'User is not nitro.');
                return `Removed Nitro from ${member.username}#${member.discriminator} <:bexy:393137089622966272>`;
            }
            else {
                member.addRole("392169841554882570", "User is nitro.");
                return `Gave ${member.username}#${member.discriminator} Nitro <:bexy:393137089622966272>`;
            }
        }
        else if(msg.mentions[0] && msg.mentions[0].username) { // 0 == true, -1 == false
            var userID = msg.mentions[0].id;
            var member = msg.channel.guild.members.get(user);
            if (member.roles.indexOf('279991210356113408') == 0) {
                member.removeRole('279991210356113408', 'User is not nitro.');
                return `Removed Nitro from ${member.username}#${member.discriminator} <:bexy:393137089622966272>`;
            }
            else {
                member.addRole("279991210356113408", "User is nitro.");
                return `Gave ${member.username}#${member.discriminator} Nitro <:bexy:393137089622966272>`;
            }
        }
        else if (!args[0]) {
            var member = msg.member;
            if (member.roles.indexOf('279991210356113408') == 0) {
                member.removeRole('279991210356113408', 'User is not Nitro.');
                return `Removed Nitro from ${member.username}#${member.discriminator} <:bexy:393137089622966272>`;
            }
            else {
                member.addRole("279991210356113408", "User is nitro.");
                return `Gave ${member.username}#${member.discriminator} Nitro <:bexy:393137089622966272>`;
            }
        }
        else {
            return "Please provide a valid user <:bexn:393137089631354880>"
        }
    }, 
    {
        requirements: {
            roleIDs: ['392157971507052554', '392150288729112587']
        },
        description: "Give a user the nitro role.",
        fullDescription: "This is used to give users who have nitro the Nitro role."
    });

    bot.register("partner", (msg, args) => {
        if (args[0].length == 18) {
            var userID = args[0];
            var member = msg.channel.guild.members.get(userID);
            if (member.roles.indexOf('392169937755439106') == 0) {
                member.removeRole('392169937755439106', 'User is not a Discord Partner.');
                return `Removed Discord Partner from ${member.username}#${member.discriminator} <:bexy:393137089622966272>`;
            }
            else {
                member.addRole("392169841554882570", "User is is a Discord Partner.");
                return `Gave ${member.username}#${member.discriminator} Discord Partner <:bexy:393137089622966272>`;
            }
        }
        else if(msg.mentions[0] && msg.mentions[0].username) { // 0 == true, -1 == false
            var userID = msg.mentions[0].id;
            var member = msg.channel.guild.members.get(user);
            if (member.roles.indexOf('392169937755439106') == 0) {
                member.removeRole('392169937755439106', 'User is not Discord Partner.');
                return `Removed Discord Partner from ${member.username}#${member.discriminator} <:bexy:393137089622966272>`;
            }
            else {
                member.addRole("392169937755439106", "User is Discord Partner.");
                return `Gave ${member.username}#${member.discriminator} Discord Partner <:bexy:393137089622966272>`;
            }
        }
        else if (!args[0]) {
            var member = msg.member;
            if (member.roles.indexOf('392169937755439106') == 0) {
                member.removeRole('392169937755439106', 'User is not Discord Partner.');
                return `Removed Discord Partner from ${member.username}#${member.discriminator} <:bexy:393137089622966272>`;
            }
            else {
                member.addRole("392169937755439106", "User is Discord Partner.");
                return `Gave ${member.username}#${member.discriminator} Discord Partner <:bexy:393137089622966272>`;
            }
        }
        else {
            return "Please provide a valid user <:bexn:393137089631354880>"
        }
    }, 
    {
        requirements: {
            roleIDs: ['392157971507052554', '392150288729112587']
        },
        description: "Give a user the Discord Partner role.",
        fullDescription: "This is used to give users who have the partner badge the Discord Partner role."
    });

    bot.register("hypesquad", (msg, args) => {
        if (args[0].length == 18) {
            var userID = args[0];
            var member = msg.channel.guild.members.get(userID);
            if (member.roles.indexOf('392169890955395078') == 0) {
                member.removeRole('392169890955395078', 'User is not a Hypesquad member.');
                return `Removed Hypesquad from ${member.username}#${member.discriminator} <:bexy:393137089622966272>`;
            }
            else {
                member.addRole("392169841554882570", "User is is a Hypesquad.");
                return `Gave ${member.username}#${member.discriminator} Hypesquad <:bexy:393137089622966272>`;
            }
        }
        else if (msg.mentions[0] && msg.mentions[0].username) { // 0 == true, -1 == false
            var userID = msg.mentions[0].id;
            var member = msg.channel.guild.members.get(user);
            if (member.roles.indexOf('392169890955395078') == 0) {
                member.removeRole('392169890955395078', 'User is not Hypesquad.');
                return `Removed Hypesquad from ${member.username}#${member.discriminator} <:bexy:393137089622966272>`;
            }
            else {
                member.addRole("392169890955395078", "User is Hypesquad.");
                return `Gave ${member.username}#${member.discriminator} Hypesquad <:bexy:393137089622966272>`;
            }
        }
        else if (!args[0]) {
            var member = msg.member;
            if (member.roles.indexOf('392169890955395078') == 0) {
                member.removeRole('392169890955395078', 'User is not Hypesquad.');
                return `Removed Hypesquad from ${member.username}#${member.discriminator} <:bexy:393137089622966272>`;
            }
            else {
                member.addRole("392169890955395078", "User is Hypesquad.");
                return `Gave ${member.username}#${member.discriminator} Hypesquad <:bexy:393137089622966272>`;
            }
        }
        else {
            return "Please provide a valid user <:bexn:393137089631354880>"
        }
    }, 
    {
        requirements: {
            roleIDs: ['392157971507052554', '392150288729112587']
        },
        description: "Give a user the Hypesquad role.",
        fullDescription: "This is used to give users who are members of Hypesquad the Hypesquad role."
    });

    bot.register("reactions", (msg, args) => {
        bot.reactions = [];
        if (args.length == 0) return 'Reset the reactions!';

        args.forEach(function(arg) {
            if (arg.includes(':')) {
                arg = arg.replace('<:', '');
                arg = arg.replace('>', '');
                bot.reactions.push(arg);
            } else {
                bot.reactions.push(arg);
            }
        })
        return 'Done! <:bexhey:390556541360799748>';
    }, {
        requirements: {
            roleIDs: ['392425936366075905', '392150288729112587']
        },
        description: "Change the reactions added to the fotd channel.",
        fullDescription: "Easier & quicker to add reactions."
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
    }, {
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
    }, {
        requirements: {
            userIDs: bot.config.owners
        },
        description: "Executes to command line",
        fullDescription: "This command is used to execute command line commands."
    });

    bot.register("update", function(msg, args) {
        bot.createMessage(msg.channel.id, "Updating...").then(e => {
            var evaled = require("child_process").execSync('git pull').toString()
            bot.createMessage(e.channel.id, "```" + evaled + "```")
            if (evaled.indexOf("Already up-to-date.") < 0) {
                bot.createMessage(e.channel.id, "New code successfully pulled! Restarting...")
                setTimeout(function() {
                    process.exit(0)
                }, 2000);
            }
        })
    }, {
        requirements: {
            userIDs: bot.config.owners
        },
        description: "Updates the bot's code.",
        fullDescription: "This command is used to update the bot's code on Github."
    });

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
        if (typeof(text) === "string") {
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        } else {
            return text;
        }
    }

    bot.register("event", (msg, args) => {
        var argsArray = args.slice();
        var countdownTime = argsArray[1];
        var slicedArgs = args.slice(2);
        var eventDescription = slicedArgs.join("");
        var msgSent;

        function countingDown() {
            countdownTime = countdownTime - 1;
        } // subtracts five from the number given as time in minutes

        function countdownFunc() {
            setTimeout(countingDown, 60000);
        } // loops countingDown() to run every minute

        function countdownMessage() {
            var msgSent = "**" + eventDescription + "**\nstarting in **" + countdownTime + " minutes!**"
            bot.createMessage("392173094728630275", msgSent).then((it) => msgSent = it);
        }

        function editMsg() {
            msgSent.edit("**" + eventDescription + "**\nstarting in **" + countdownTime + " minutes!**").then((it) => msgSent = it);
        } // edits the sent message conform the altered countdownTime variable

        function sendEdit() {
            setTimeout(editMsg, 60000);
        } // loops the above function every minute

        function stopCountdown() {
            clearTimeout(countdownTime);
        }

        if (argsArray[0] === "start") {
            if (isNaN(argsArray[1])) {
                bot.createMessage(msg.channel.id, "Time must be a number!");
            } else {
                bot.createMessage(msg.channel.id, "Event **" + eventDescription + "** started!")
                countdownMessage();
                countdownFunc();
                sendEdit();
                if (countdownTime <= 0) {
                    stopCountdown();
                    msgSent.edit("**" + eventDescription + " has begun!**");
                }
            }
        } else {
            bot.createMessage(msg.channel.id, "The correct usage is: `!event start <time> <description>`!")
        }
    }, {
        requirements: {
            roleIDs: ["392169572863836160"]
        },
        description: "Start an event.",
        fullDescription: "This command is used to start a countdown for an event in the events channel."
    })
}