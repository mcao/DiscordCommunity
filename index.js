const Eris = require("eris"),
    config = require("./config.json"),
    readdir = require("fs").readdir;
var bot = new Eris.CommandClient(config.token, {}, config.commandOpts);

bot.on("ready", () => {
    console.log(`Logged in as ${bot.user.username}#${bot.user.discriminator}!`);

    bot.editStatus({ name: `${config.game} | ${config.commandOpts.prefix[0]}help` })

    readdir('./modules/', (err, files) => {
        console.log(`Loading ${files.length} modules!`);
        files.forEach(f => {
            try {
                require(`./modules/${f}`)(bot)
            } catch (e) {
                console.log(`Unable to load module ${f}: ${e}`);
            }
        });
        console.log(`Modules loaded!`);
    });
});

bot.connect();