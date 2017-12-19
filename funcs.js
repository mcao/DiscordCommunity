module.exports = (bot) => {
    bot.config = require("./config.json")

    bot.register = function (name, command, options) {
        if (bot.commands[name]) {
            console.log(`Reloading command: ${name}`)
            bot.unregisterCommand(name)
            bot.registerCommand(name, command, options)
        } else {
            console.log(`Registering command: ${name}`)
            bot.registerCommand(name, command, options)
        }
    }
}