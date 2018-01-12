module.exports = bot => {
    bot.register('guessit', (msg, args) => {
        if (bot.runninggames.has('guessit')) {
            return 'Please finish the current game first!';
        } else {
            if (!isNaN(args)) {
                if (args < 200) {
                    return `Your number is too easy :frowning:\nTry 200 or greater ;)`;
                }
                bot.randomnumber = Math.round(Math.random() * (args - 0 + 1)) + 1;
            } else {
                return 'Please use !guessit <number>.';
            }
            bot.runninggames.add('guessit');
            ++bot.guesscounter;

            var counter = bot.guesscounter;

            setTimeout(() => {
                if (bot.runninggames.has('guessit') && msg.content == bot.randomnumber) {
                    msg.channel.createMessage(`:tada: Well done! You did it! The number was ${bot.randomnumber}`);
                    bot.runninggames.delete('guessit');
                } else if (bot.runninggames.has('guessit') && counter === bot.guesscounter) {
                    msg.channel.createMessage(`Ok the time is over now! You failed to guess ${bot.randomnumber}. Sorry`);
                    bot.runninggames.delete('guessit');
                    bot.guesstries = 15;
                }
            }, 90 * 1000);
            return `You may start guesssing now!`;
        }
    }, {
        description: `Starts a "guess a number" game if none is running!`,
        fullDescription: `Starts a "guess a number" game if none is running!`,
    });
};