const { CommandClient } = require("eris"),
    readdir = require("fs").readdir;
var bot = new CommandClient(require("./config.json").token, {}, require("./config.json").commandOpts);

require('./funcs.js')(bot)

bot.on("ready", () => {
    console.log(`Logged in as ${bot.user.username}#${bot.user.discriminator}!`);

    bot.editStatus({ name: `${bot.config.game} | ${bot.config.commandOpts.prefix[0]}help` })

    readdir('./modules/', (err, files) => {
        console.log(`Loading ${files.length} modules!`);
        files.forEach(f => {
            try {
                require(`./modules/${f}`)(bot)
            } catch (e) {
                console.log(`Unable to load module ${f}: ${e}`);
            }
        });
        console.log(`Modules loaded!`);
    });
});

bot.on("guildBanAdd", function (guild, user) {
    const guildList = bot.config.guilds;

    for (var i = 0; i < guildList.length; i++) {
        try {
            bot.guilds.get(guildList[i]).getBans().then(thatBans => {
                for (var i = 0; i < thatBans.length; i++) {
                    if (thatBans[i].user.id == user.id) {
                        return;
                    }
                }
                bot.guilds.get(guild.id).getBans(user.id).then(thisBans => {
                    bot.getDMChannel(user.id).then(chan => {
                        bot.createMessage(chan.id, `You have been banned on ${bot.guilds.get(guildList[i]).name} for ${thisBans[0].reason}!`)
                    })
                    bot.getChannel("389588585889660928").createMessage(`Banning ${user.username} on ${bot.guilds.get(guildList[i]).name}!`)
                    // bot.guilds.get(guildList[i]).banMember(user.id, 0, "Automated Ban Sync - User banned on " + guild.name + " for " + thisBans[0].reason)
                });
            })
        } catch (err) {
            bot.getChannel("389588585889660928").createMessage(`Error: ${err}`)
        }
    }
});

bot.connect();