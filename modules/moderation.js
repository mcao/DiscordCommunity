
module.exports = (bot) => {
    bot.register("warnings", (msg, args) => {
        var user;
        args = args.join(" ");
        if (args.length == 0) return "Please provide a user.";
        if (args.length == 18) {
            user = msg.channel.guild.members.get(args);
        }
        if (msg.mentions[0]) {
            user = msg.mentions[0];
        }
        var embedy = {
            title: `Warnings for ${user.username}#${user.discriminator}`,
            color: 0x71368a,
            author: {
                name: "Discord Community",
                icon_url: "https://cdn.discordapp.com/avatars/392450607983755264/071e72220fae40698098221d52df3e5f.jpg?size=256"
            },
            fields: [

            ],
            thumbnail: {
                url: user.avatarURL.replace("?size=128", "")
            }
        };

        if (bot.profiles[user.id].warnings.length == 0) return "This user doesn't have any warnings!";

        var moderator;
        var reason;
        var channel;
        var warningNum = 0;
        bot.profiles[user.id].warnings.forEach(function(warning) {
            warningNum+=1;
            moderator = warning.mod;
            reason = warning.reason;
            channel = warning.channel;
            fields.push({name: `Warning #${warningNum}`, value: `Moderator: <@${moderator}>\nReason: ${reason}\nChannel: ${channel}`})
        });
        return {embed: embedy};
    },
    {
        description: "Check a user's warnings.",
        fullDescription: "Check the warnings for a given user.",
        requirements: {
            roleIDs: ['392425936366075905']
        }
    });

    bot.register("warn", (msg, args) => {
        if (args.length == 0) return "Please provide a user.";
        var reason = args.slice(1).join(" ");
        var user = args[0];
        if (!args[0]) return "Please provide a user.";
        if (!reason) return "Please provide a reason.";
        if (user.length == 18) {
            bot.warn(user, msg.author.id, reason, `#${msg.channel.guild.channels.get(msg.channel.id).name}`);
            return "Warning recorded <:bexy:393137089622966272>";
        }
        else {
            if (msg.mentions[0]) {
                user = msg.mentions[0].id;
                bot.warn(user, msg.author.id, reason, `#${msg.channel.guild.channels.get(msg.channel.id).name}`);
                return "Warning recorded <:bexy:393137089622966272>";
            }
            else {
                return "Invalid user!";
            }
        }
    },
    {
        description: "Warns a user.",
        fullDescription: "A command used to store a warning for a user who has violated a rule..",
        requirements: {
            roleIDs: ['392157971507052554']
        }
    });

    bot.register("reset", (msg, args) => {
        var user = msg.mentions[0].id;
        if (args.length === 0) return bot.createMessage(msg.channel.id, 'Please provide a user.');
        if (msg.mentions[0].bot) return bot.createMessage(msg.channel.id, 'Bots don\'t have ranks!');
        if (!msg.mentions[0] && args.length !== 18) return bot.createMessage(msg.channel.id, 'Invalid user.')
        if (args.length === 18 && typeof args === 'number') user = args;
        const levelRoles = ['393606932608450561', '393606931014746113', '393606929068589057', '393606926467989507', '393606924433752064'];
        levelRoles.forEach(function (role) {
            const person = msg.channel.guild.members.get(user);
            if (!person.roles.includes(role)) return;
            person.removeRole(role, `Rank resetted | Done by: ${msg.author.username}#${msg.author.discriminator}`);
        });
        bot.resetMessages(user);
        return `Reset the level for <@${user}>.`
    },
    {
            description: "Resets a level.",
            fullDescription: "Resets the message count for the given user.",
            requirements: {
                roleIDs: ['392157971507052554']
            }
    });
}