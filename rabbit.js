const amqp = require("amqp");
const path = require("path");

/**
 * Initializes a new connection to the RabbitMQ server
 */
class Rabbit {
    constructor(){
        this.username = "discord";
        this.connection = amqp.createConnection({
            host: "localhost",
            login: this.username,
            password: require(path.join(__dirname, "config.json")).rabbitmq_password
        });
    }


    /**
     * Broadcast a message saying a user has levelled up
     * @param {String} userid The ID of the promoted user
     * @param {Number} level The new level of the user
     */
    levelUp(userid, level){
        return new Promise((resolve, reject) => {
            let payload = {
                type: "level_up",
                userid: userid.toString(),
                level: level,
            };
            var exch = this.connection.exchange("amq.topic");
            exch.publish("discord_community", payload);
            resolve()
        });
    }

    /**
     * Adds a function to a queue's subscriptions.
     * @param {Function} callback The function that will be run with each new message.
     */
    handleMessage(callback){
        this.connection.queue("discord_community", (q) => {
            q.bind("#"); // Can't remember why I 
                         //actually need this line but it makes it work so okay
            
            q.subscribe((m) => {callback(m)}); // Add users callback to subscriptions.
        });
    }
}
module.exports = Rabbit;