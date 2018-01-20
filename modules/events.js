module.exports = bot => {
    bot.registerCommand('queue', msg => {
        if (bot.queue.indexOf(msg.author.id) !== -1) {
            return `:ok_hand: You are position #${bot.queue.indexOf(msg.author.id) + 1}`;
        } else {
            bot.queue.push(msg.author.id);
            return `:ok_hand: You are now position #${bot.queue.indexOf(msg.author.id) + 1} in the queue`;
        }
    });
};
