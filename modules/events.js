module.exports = bot => {
    bot.registerCommand('queue', msg => {
        if (bot.queue.indexOf(msg.author.id) !== -1) {
            return `<:bexy:393137089622966272> You are position #${bot.queue.indexOf(msg.author.id) + 1}`;
        } else {
            bot.queue.push(msg.author.id);
            return `<:bexy:393137089622966272> You are now position #${bot.queue.indexOf(msg.author.id) + 1} in the queue`;
        }
    });

    bot.registerCommand('leavequeue', msg => {
        if (bot.queue.indexOf(msg.author.id) === -1) return '<:bexn:393137089631354880> You were never in the queue!';

        let index = bot.queue.indexOf(msg.author.id);
        bot.queue.splice(index, 1);
        return '<:bexy:393137089622966272> You have been removed from the queue';
    });
};
