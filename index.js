const { CommandClient } = require("eris-additions")(require("eris")),
    readdir = require("fs").readdir,
    readFileSync = require("fs").readFileSync,
    hastebin = require('hastebin-gen'),
    HOME_GUILD = `358528040617377792`,
    TEST_GUILD = `396914522801176577`;
var bot = new CommandClient(require("./config.json").token, {
    disableEvents: ['PRESENCE_UPDATE']
}, require("./config.json").commandOpts);

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
            msg.edit("Restarted!");
        })
    } catch (err) {
        bot.log(err);
    };
});

bot.on("messageCreate", function (msg) {
    // const yesno = ['bexy:393137089622966272', 'bexn:393137089631354880'];
    // if (msg.channel.type == 1) {
    //     let responses = msg.channel.awaitMessages(m => m.content === "yes");
    //     if(responses.length) bot.createMessage(msg.channel.id, "You said yes :)");
    // if (msg.content.toLowerCase().startsWith('feedback')) {
    //     var embedy = {
    //         title: `New anonymous feedback!`,
    //         author: {
    //             name: "Discord Community",
    //             icon_url: "https://cdn.discordapp.com/avatars/392450607983755264/071e72220fae40698098221d52df3e5f.jpg?size=256"
    //         },
    //         thumbnail: {
    //             url: bot.user.avatarURL
    //         },
    //         color: 0x71368a,
    //         fields: [

    //         ],
    //         timestamp: new Date()
    //     };
    //     if (msg.content.length > 1024) { // If message is too big
    //         hastebin(msg.content, "txt").then(r => { // Hastebin it
    //             var message = `The message was too long, it was sent to <${r}>`;
    //             embedy.fields.push({name: 'Message:', value: message});
    //             bot.createMessage('392442695756546059', {embed: embedy});
    //         });
    //     }
    //     else {
    //         embedy.fields.push({name: 'Feedback message:', value: `${msg.content}`});
    //         bot.createMessage('392442695756546059', {embed: embedy}).then(m => yesno.forEach(function(vote) {m.addReaction(vote)}));
    //     }
    //     msg.author.getDMChannel().then(c => c.createMessage('<:bexy:393137089622966272> Thanks for sending your feedback in! We promise to keep your information private.'));
    // }
    // }
    if (msg.channel.type == 1) {
        var nextTicket = 0;
        for (let key in bot.profiles) {
            if (bot.tickets.hasOwnProperty(key)) size++;
        }
        nextTicket = +1;
        var mailName = `${nextTicket}-${msg.author.id}`; // Channel name
        var embedy = {
            title: `New mail ${msg.author.username}#${msg.author.discriminator}`,
            description: `Ticket #${nextTicket}`,
            author: {
                name: "Discord Community",
                icon_url: "https://cdn.discordapp.com/avatars/392450607983755264/071e72220fae40698098221d52df3e5f.jpg?size=256"
            },
            thumbnail: {
                url: msg.author.avatarURL.replace("?size=128", "")
            },
            color: 0x71368a,
            fields: [

            ],
            footer: {
                text: `Do "!claim ${nextTicket}" to claim this ticket.`
            },
            timestamp: new Date()
        };
        if (msg.content.length > 1024) { // If message is too big
            hastebin(msg.content, "txt").then(r => { // Hastebin it
                var message = `The message was too long, it was sent to <${r}>`;
                embedy.fields.push({ name: 'Message:', value: message });
            });
        }
        else {
            embedy.fields.push({ name: 'Message:', value: `${msg.content}` })
        }
        var existingChan = bot.guilds.get(TEST_GUILD).channels.filter(c => c.name.includes(msg.author.username));
        if (existingChan[0]) { // If there's already a channel for that user
            return existingChan[0].createMessage({ embed: embedy });
        }
        bot.createChannel(TEST_GUILD, mailName, 0, 'Mod mail', '398577703399194634').then((channel) => {
            channel.edit({ topic: `User ID: ${msg.author.id}` });
            var channelID;
            msg.author.getDMChannel().then(channel => {
                bot.tickets[nextTicket] = {
                    userID: msg.author.id,
                    channelID: channel.id,
                    taken: false,
                    finished: false
                };
            });
            bot.createMessage('398565803613749259', { embed: embedy });
            channel.createMessage({ embed: embedy });
        });
    } else if (msg.channel.type == 0) {
        const reactions = ['#⃣', '🇭', '🇾', '🇵', '🇪', '✨', 'bexhype:390557755339177994', 'bexlove:390556541717053440', 'bexhey:390556541360799748', 'bexangry:390557738473881601', 'hypekey:390416915207815168', 'nitro:390416828272476161', 'love:390416915194970122', 'HypeMan:390416914826133505', 'wlove:390416915341901826'];
        const voteReactions = ['bexy:393137089622966272', 'bexn:393137089631354880'];
        const channels = ["392407095171088384", "392173071223750656", "392172869154635786", "392173094728630275"];

        if (msg.channel.id == '392407095171088384') {
            if (bot.reactions.length == 0) return;
            bot.reactions.forEach(function (reaction) {
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
            voteReactions.forEach(function (vote) {
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
    }
})

bot.on("guildMemberAdd", function (guild, member) {
    if (guild.id == HOME_GUILD) {
        bot.createMessage("392152516596465664", `Welcome to the official Discord Hub Community, <@${member.user.id}>! :tada::tada:
Please remember to read the <#392171939101409290> and post something in <#392152654505050112> if you'd like! <:bexlove:390556541717053440>`)
        setTimeout(function () { member.addRole('392169263982444546', "Autorole") }, 300000);
    }
})

bot.on("guildBanAdd", function (guild, user) {
    const guildList = bot.config.guilds;

    guild.getAuditLogs(2, null, 22).then(logs => {
        if (logs.entries[0].user.id == bot.user.id) return;

        var embed = {
            "embed": {
                "color": 8919211,
                "footer": {
                    "icon_url": bot.users.get(logs.entries[0].user.id).avatarURL.replace("?size=128", ""),
                    "text": "Banned by " + logs.entries[0].user.username + "#" + logs.entries[0].user.discriminator + " | Banned User ID: " + user.id
                },
                "thumbnail": {
                    "url": user.avatarURL.replace("?size=128", "")
                },
                "fields": [
                    {
                        "name": "User Banned",
                        "value": user.username + "#" + user.discriminator,
                        "inline": true
                    },
                    {
                        "name": "Banned in",
                        "value": guild.name,
                        "inline": true
                    },
                    {
                        "name": "Ban Reason",
                        "value": logs.entries[0].reason || "Not Specified",
                        "inline": true
                    }
                ]
            }
        }
        bot.getChannel("398936742532743188").createMessage(embed)

        for (var i = 0; i < guildList.length; i++) {
            try {
                const guild2 = bot.guilds.get(guildList[i])
                if (guild2.id == guild.id) return;
                guild.getBans(user.id).then(thisBans => {
                    bot.log(`Banning ${user.username} on ${guild2.name}!`)
                    guild2.banMember(user.id, 0, "Automated Ban Sync - User banned on " + guild.name)
                });
            } catch (err) {
                bot.getChannel("392897329721507850").createMessage(`Error: ${err.stack}`)
            }
        }
    });
});

bot.on("guildBanRemove", function (guild, user) {
    const guildList = bot.config.guilds;

    for (var i = 0; i < guildList.length; i++) {
        try {
            const guild2 = bot.guilds.get(guildList[i])
            if (guild2.id == guild.id) return;
            bot.log(`Unbanning ${user.username} on ${guild2.name}!`)
            guild2.unbanMember(user.id, 0, "Automated Unban Sync - User unbanned on " + guild.name)
        } catch (err) {
            bot.getChannel("389588585889660928").createMessage(`Error: ${err}`)
        }
    }
});

process.on("uncaughtException", (err) => {
    console.error(err.stack)
});

process.on("unhandledRejection", (err) => {
    console.error(err.stack)
})

bot.connect();
