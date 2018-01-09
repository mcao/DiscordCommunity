const amqp = require('amqp');
const path = require('path');

/**
 * Initializes a new connection to the RabbitMQ server
 */
class Rabbit {
    constructor() {
        this.username = 'discord';
        this.connection = amqp.createConnection({
            host: 'localhost',
            login: this.username,
            password: require(path.join(__dirname, 'config.json')).rabbitmq_password,
        });
        this.connection.on('ready', () => {
            console.log('RabbitMQ Connected');
        });
    }


    /**
     * Broadcast a message saying a user has levelled up
     * @param {string} userid The ID of the promoted user
     * @param {number} level The new level of the user
     */
    levelUp(userid, level) {
        let payload = {
            type: 'level_up',
            userid: userid.toString(),
            level: level,
        };
        this.connection.exchange('amq.topic', ex => {
            ex.publish('discord_community', payload);
            // resolve();
        });
    }

    /**
     * Adds a function to a queue's subscriptions.
     * @param {Function} callback The function that will be run with each new message.
     */
    handleMessage(callback) {
        this.connection.queue('discord_community', q => {
            // Can't remember why I actually need this line but it makes it work so okay
            q.bind('#');
            // Add users callback to subscriptions.
            q.subscribe(callback);
        });
    }
}
module.exports = Rabbit;
