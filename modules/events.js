module.exports = bot => {
    bot.registerCommand('queue', msg => {
        if (bot.queue.indexOf(msg.author.id) !== -1) {
            return `<:bexy:393137089622966272> You are position #${bot.queue.indexOf(msg.author.id) + 1}`;
        } else {
            bot.queue.push(msg.author.id);
            return `<:bexy:393137089622966272> You are now position #${bot.queue.indexOf(msg.author.id) + 1} in the queue`;
        }
    }, {
    	requirements: {
    		roleIDs: ['392150288729112587']
	}
    });

    bot.registerCommand('leavequeue', msg => {
        if (bot.queue.indexOf(msg.author.id) === -1) return '<:bexn:393137089631354880> You were never in the queue!';

        let index = bot.queue.indexOf(msg.author.id);
        bot.queue.splice(index, 1);
        return '<:bexy:393137089622966272> You have been removed from the queue';
    }, {
    	requirements: {
    		roleIDs: ['392150288729112587']
	}
    });

    bot.registerCommand('aqueue', msg => {
        if (bot.queue.length === 0) return 'No users in queue';
        let first_user = msg.channel.guild.members.get(bot.queue[0]);
        if (bot.queue.length === 1) return `${first_user.user.username}#${first_user.user.discriminator} is the only member of the queue.`;
        return `${first_user.user.username}#${first_user.user.discriminator} is next and there are ${bot.queue.length - 1} left in queue`
    }, {
        requirements: {
            roleIDs: ['392169572863836160', '392150288729112587'],
        },
    });

    bot.registerCommand('next', msg => {
        let karaoke_channel = msg.channel.guild.channels.get('404265067354521610').voiceMembers;
        karaoke_channel.forEach(v => {
            msg.channel.guild.editMember(v.id, { mute: true }, 'Reason user not next');
        });

        msg.channel.guild.editMember(bot.queue[0], { mute: false });
        bot.queue.splice(0, 1);
        return '<:bexy:393137089622966272> Users have been muted & speaker unmuted'
    }, {
        requirements: {
            roleIDs: ['392169572863836160', '392150288729112587'],
        },
    });
};
