const { CommandClient } = require("eris"),
    readdir = require("fs").readdir;
var bot = new CommandClient(require("./config.json").token, {}, require("./config.json").commandOpts);

require('./funcs.js')(bot)

bot.on("ready", () => {
    bot.log(`Logged in as ${bot.user.username}#${bot.user.discriminator}!`);

    bot.editStatus({ name: `${bot.config.game} | ${bot.config.commandOpts.prefix[0]}help` })

    readdir('./modules/', (err, files) => {
        bot.log(`Loading ${files.length} modules!`);
        files.forEach(f => {
            if (f.endsWith(".js")) {
                try {
                    require(`./modules/${f}`)(bot)
                } catch (e) {
                    bot.log(`Unable to load module ${f}: ${e}`);
                }
            }
        });
        bot.log(`Modules loaded!`);
    });

    bot.backupRanks();

    setTimeout(() => {
        bot.backupRanks();
    }, 300000)
});

bot.on("guildMemberAdd", function (guild, member) {
    if (guild.id == "358528040617377792") {
        bot.createMessage("392152516596465664", `Welcome to the official Discord Hub Community, <@${member.user.id}>! :tada::tada:
Please remember to read the <#392171939101409290> and post something in <#392152654505050112> if you'd like! <:bexlove:390556541717053440>`)
        setTimeout(member.addRole('392169263982444546', "Autorole"), 30000);
    }
})

bot.on("guildBanAdd", function (guild, user) {
    const guildList = bot.config.guilds;

    for (var i = 0; i < guildList.length; i++) {
        try {
            const guild2 = bot.guilds.get(guildList[i])
            guild2.getBans().then(thatBans => {
                for (var j = 0; j < thatBans.length; j++) {
                    if (thatBans[j].user.id == user.id) {
                        return;
                    }
                }
                guild.getBans(user.id).then(thisBans => {
                    bot.log(`Banning ${user.username} on ${guild2.name}!`)
                    guild2.banMember(user.id, 0, "Automated Ban Sync - User banned on " + guild.name + " for " + thisBans[0].reason)
                });
            })
        } catch (err) {
            bot.getChannel("389588585889660928").createMessage(`Error: ${err}`)
        }
    }
});

bot.on("guildBanRemove", function (guild, user) {
    const guildList = bot.config.guilds;

    for (var i = 0; i < guildList.length; i++) {
        try {
            const guild2 = bot.guilds.get(guildList[i])
            guild2.getBans().then(thatBans => {
                for (var j = 0; j < thatBans.length; j++) {
                    if (thatBans[j].user.id == user.id) {
                        bot.log(`Unbanning ${user.username} on ${guild2.name}!`)
                        guild2.unbanMember(user.id, 0, "Automated Unban Sync - User unbanned on " + guild.name)
                    }
                }
            })
        } catch (err) {
            bot.getChannel("389588585889660928").createMessage(`Error: ${err}`)
        }
    }
});

bot.connect();