const { CommandClient } = require('eris-additions')(require('eris'));
var readdir = require('fs').readdir,
    readFileSync = require('fs').readFileSync,
    hastebin = require('hastebin-gen'),
    TEST_GUILD = `396914522801176577`;
var bot = new CommandClient(require('./config.json').token, {
    disableEvents: ['PRESENCE_UPDATE'],
}, require('./config.json').commandOpts);

require('./funcs.js')(bot);

if (process.argv && process.argv[2] === 'dev') console.log('[DEVELOPER MODE] Starting in Developer Mode...');
else console.log('Starting...');

bot.on('ready', () => {
    bot.log(`Logged in as ${bot.user.username}#${bot.user.discriminator}!`);

    bot.editStatus({
        name: `${bot.config.game} | ${bot.config.commandOpts.prefix[0]}help`,
    });

    readdir('./modules/', (err, files) => {
        if (err) console.log(err);
        bot.log(`Loading ${files.length} modules!`);
        files.forEach(f => {
            if (f.endsWith('.js')) {
                try {
                    require(`./modules/${f}`)(bot);
                } catch (e) {
                    bot.log(`Unable to load module ${f}: ${e}`);
                }
            }
        });
        bot.log('Modules loaded!');
    });
});

bot.on('messageCreate', msg => {

});

bot.on('guildMemberAdd', (guild, member) => {
});

bot.on('guildBanAdd', (guild, user) => {
    setTimeout(() => {
        guild.getAuditLogs(2, null, 22).then(logs => {
            if (logs.entries[0].user.id === bot.user.id) return;

            bot.getChannel('398936742532743188').createMessage({
                embed: {
                    color: 8919211,
                    footer: {
                        icon_url: bot.users.get(logs.entries[0].user.id).avatarURL.replace('?size=128', ''),
                        text: 'Banned by ' + logs.entries[0].user.username + '#' + logs.entries[0].user.discriminator + ' | Banned User ID: ' + logs.entries[0].targetID,
                    },
                    thumbnail: {
                        url: bot.users.get(logs.entries[0].targetID).avatarURL.replace('?size=128', ''),
                    },
                    fields: [{
                        name: 'User Banned',
                        value: bot.users.get(logs.entries[0].targetID).username + '#' + bot.users.get(logs.entries[0].targetID).discriminator,
                        inline: true,
                    }, {
                        name: 'Banned In',
                        value: guild.name,
                        inline: true,
                    }, {
                        name: 'Ban Reason',
                        value: decodeURIComponent(logs.entries[0].reason) || 'Not Specified',
                        inline: true,
                    }],
                },
            });

            var guilds = bot.guilds.map(g => { return g; });
            for (var i = 0; i < guilds.length; i++) {
                try {
                    if (guilds[i].id !== guild.id) {
                        bot.log(`Banning ${user.username} on ${guilds[i].name}!`);
                        guilds[i].banMember(user.id, 0, 'Automated Ban Sync - User banned on ' + guild.name + ' for ' + decodeURIComponent(logs.entries[0].reason));
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        });
    }, 5000);
});

bot.on('guildBanRemove', (guild, user) => {
    var guilds = bot.guilds.map(g => { return g; });
    for (var i = 0; i < guilds.length; i++) {
        try {
            if (guilds[i].id !== guild.id) {
                bot.log(`Unbanning ${user.username} on ${guilds[i].name}!`);
                guilds[i].unbanMember(user.id, 0, 'Automated Unban Sync - User unbanned on ' + guild.name);
            }
        } catch (err) {
            bot.getChannel('392897329721507850').createMessage(`Error: ${err.stack}`);
        }
    }
});

bot.on('messageReactionAdd', (message, emoji, user) => {
});

bot.on('messageReactionAdd', (message, emoji, userID) => {
});

process.on('uncaughtException', err => {
    console.error(err.stack);
});

process.on('unhandledRejection', err => {
    console.error(err.stack);
});

bot.connect();
