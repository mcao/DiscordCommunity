module.exports = (bot) => {
    bot.register("guessit", (msg, args) => {
        if (msg.channel.id != '396842501971116032') {
            return
        }
        if (bot.runninggames.has("guessit")) {
            return "Please finish the current game first!"
        } else {
            if (!isNaN(args)) {
                bot.randomnumber = Math.round(Math.random() * (args - 0 + 1)) + 1;
            } else {
                bot.randomnumber = Math.round(Math.random() * (1000 - 0 + 1)) + 1;
            }
            bot.runninggames.add("guessit")
            setTimeout(() => {
                if (bot.runninggames.has("guessit")) {
                    msg.channel.createMessage(`Ok the time is over now! You failed to guess ${bot.randomnumber}. Sorry`)
                    bot.runninggames.delete("guessit")
                }
            }, 90 * 1000)
            return `You may start guesssing now! Well its ${bot.randomnumber} you cheater :eyes:`
        }
    }, {
        requirements: {
            roleIDs: ['397898635565727745']
        },
        description: `Starts a "guess a number" game if none is running!`,
        fullDescription: `Starts a "guess a number" game if none is running!`
    })
}