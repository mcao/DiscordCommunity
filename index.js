const { CommandClient } = require("eris"),
    readdir = require("fs").readdir,
    readFileSync = require("fs").readFileSync;
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

    bot.loadProfiles();
    bot.backupProfiles();
    bot.twentyFourHourTimer();

    setInterval(() => {
        bot.writeProfiles();
    }, 300000)

    try {
        bot.getMessage(JSON.parse(readFileSync("./channel.json")).channel, JSON.parse(readFileSync("./channel.json")).message).then(msg => {
            msg.edit("Restarted!")
        })
    } catch (err) {
        bot.log(err);
    };
});

bot.on("messageCreate", function (msg) {
    const reactions = ['#⃣', '🇭', '🇾', '🇵', '🇪', '✨', 'bexhype:390557755339177994', 'bexlove:390556541717053440', 'bexhey:390556541360799748', 'bexangry:390557738473881601', 'hypekey:390416915207815168', 'nitro:390416828272476161', 'love:390416915194970122', 'HypeMan:390416914826133505', 'wlove:390416915341901826'];
    const voteReactions = ['yy:392094878210850827', 'bexn:393137089631354880'];
    const channels = ["392407095171088384", "392173071223750656", "392172869154635786", "392173094728630275"];

    if (msg.channel.id == "392152654505050112") { // #introductions
        msg.addReaction('bexhey:390556541360799748');
    } else if (channels.indexOf(msg.channel.id) > -1) {
        if (msg.content.toLowerCase().includes('poll')) return;
        for (var reaction in reactions) {
            msg.addReaction(reaction);
        }
    }
    var messageSuggestion = msg.content.toLowerCase();
    if (messageSuggestion.startsWith('suggestion:' && msg.channel.id === '392178846306402314')) {
        for (var vote in voteReactions) {
            msg.addReaction(vote);
        }
    }
    if (!msg.author.bot && msg.channel.guild.id == '358528040617377792') {
        bot.incrementMessage(msg)
    }
    if (msg.channel.id == "392442695756546059" && msg.author.id == "392445621165883392") {
        bot.createMessage(msg.channel.id, "Automatic Code Update Initiated.").then(e => {
            var evaled = require("child_process").execSync('git pull').toString()
            bot.createMessage(msg.channel.id, "Automatic Code Update Successful.")
            var e = msg.embeds[0].description.toString()
            bot.createMessage(msg.channel.id, `<@171319044715053057>, the following changes were pushed by **${e.match(/.+\s-\s([\w\d-_]+)$/)[1] || "Unknown"}**. Please approve the changes and restart the bot.\n\`\`\`${evaled}\`\`\``)
        })
    }
})

bot.on("guildMemberAdd", function (guild, member) {
    if (guild.id == "358528040617377792") {
        bot.createMessage("392152516596465664", `Welcome to the official Discord Hub Community, <@${member.user.id}>! :tada::tada:
Please remember to read the <#392171939101409290> and post something in <#392152654505050112> if you'd like! <:bexlove:390556541717053440>`)
        setTimeout(function () { member.addRole('392169263982444546', "Autorole") }, 300000);
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