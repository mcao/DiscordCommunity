const { CommandClient } = require("eris"),
    readdir = require("fs").readdir,
    readFileSync = require("fs").readFileSync,
    hastebin = require('hastebin-gen'),
    HOME_GUILD = `358528040617377792`,
    TEST_GUILD = `396914522801176577`;
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
        bot.topTwenty()
    }, 300000)

    try {
        bot.getMessage(JSON.parse(readFileSync("./channel.json")).channel, JSON.parse(readFileSync("./channel.json")).message).then(msg => {
            msg.edit("Restarted!")
        })
    } catch (err) {
        bot.log(err);
    };
});

bot.on("messageCreate", function(msg) {
    if (msg.channel.type == 1) {
        bot.createMessage(msg.channel.id, 'hey dude im not working rn go away');
    }
    const reactions = ['#⃣', '🇭', '🇾', '🇵', '🇪', '✨', 'bexhype:390557755339177994', 'bexlove:390556541717053440', 'bexhey:390556541360799748', 'bexangry:390557738473881601', 'hypekey:390416915207815168', 'nitro:390416828272476161', 'love:390416915194970122', 'HypeMan:390416914826133505', 'wlove:390416915341901826'];
    const voteReactions = ['bexy:393137089622966272', 'bexn:393137089631354880'];
    const channels = ["392407095171088384", "392173071223750656", "392172869154635786", "392173094728630275"];

    if (msg.channel.id == '392407095171088384') {
        if (bot.reactions.length == 0) return;
        bot.reactions.forEach(function(reaction) {
            msg.addReaction(reaction);
        });
    }

    if (msg.channel.id == "392152654505050112") { // #introductions
        msg.addReaction('bexhey:390556541360799748');
    } else if (channels.indexOf(msg.channel.id) > -1) {
        if (msg.content.toLowerCase().includes('poll')) return;
        for (var reaction in reactions) {
            msg.addReaction(reaction);
        }
    }
    if (msg.content.toLowerCase().startsWith('suggestion:') && msg.channel.id === '392178846306402314') { // #staff-feedback
        voteReactions.forEach(function(vote) {
            msg.addReaction(vote);
        });
    }
    if (!msg.author.bot && msg.channel.guild.id == HOME_GUILD) {
        if (!bot.cooldowns.has(msg.author.id)) {
            bot.cooldowns.add(msg.author.id)
            bot.incrementMessage(msg)
            setTimeout(() => {
                bot.cooldowns.delete(msg.author.id);
            }, 10 * 1000)
        }
    }
    if (msg.channel.id == "397522914955755531" && msg.author.id == "392445621165883392") {
        bot.createMessage("392442695756546059", "Automatic Code Update Initiated.").then(e => { // #bot-development
            var evaled = require("child_process").execSync('git pull').toString()
            bot.createMessage("392442695756546059", "Automatic Code Update Successful.")
            var e = msg.embeds[0].description.toString()
            bot.createMessage("392442695756546059", `<@171319044715053057>, the following changes were pushed by **${e.match(/.+\s-\s([\w\d-_]+)$/)[1] || "Unknown"}**. Please approve the changes and restart the bot.\n\`\`\`${evaled}\`\`\``)
        })
    }
})

bot.on("guildMemberAdd", function(guild, member) {
    if (guild.id == HOME_GUILD) {
        bot.createMessage("392152516596465664", `Welcome to the official Discord Hub Community, <@${member.user.id}>! :tada::tada:
Please remember to read the <#392171939101409290> and post something in <#392152654505050112> if you'd like! <:bexlove:390556541717053440>`)
        setTimeout(function() { member.addRole('392169263982444546', "Autorole") }, 300000);
    }
})

bot.on("guildBanAdd", function(guild, user) {
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

bot.on("guildBanRemove", function(guild, user) {
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