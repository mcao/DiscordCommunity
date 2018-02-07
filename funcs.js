module.exports = bot => {
    const fs = require('fs');
    bot.config = require('./config.json');

    /**
     * Register a new command on the bot
     * 
     * @param name {String} Name of command
     * @param command {Function} Function to run
     * @param options {Object} Objects for command
     * @return {null}
     */
    bot.register = function(name, command, options) {
        if (bot.commands[name]) {
            bot.log(`Reloading command: ${name}`);
            bot.unregisterCommand(name);
            bot.registerCommand(name, command, options);
        } else {
            bot.log(`Registering command: ${name}`);
            bot.registerCommand(name, command, options);
        }
    };

    bot.log = function(txt) {
        console.log(txt);
    };

    /**
     * Chunk array into little nibbles :)
     * 
     * @param myArray {Array} The original array
     * @param chunk_size {Number} Amount of items per chunk
     * @return {Array} Chunked 2D array.
     */
    bot.chunkArray = function(myArray, chunk_size) {
        var index = 0;
        var arrayLength = myArray.length;
        var tempArray = [];

        for (index = 0; index < arrayLength; index += chunk_size) {
            var myChunk = myArray.slice(index, index + chunk_size);
            // Do something if you want with the group
            tempArray.push(myChunk);
        }

        return tempArray;
    };
    
    bot.timestamp = function() {
        var currentTime = new Date(),
            hours = currentTime.getHours(),
            minutes = currentTime.getMinutes(),
            seconds = currentTime.getSeconds();
        if (minutes < 10) minutes = '0' + minutes;
        if (seconds < 10) seconds = '0' + seconds;
        return `[${hours}:${minutes}:${seconds}]`;
    };
};