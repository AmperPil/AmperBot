//Rename the file to config.js after entering all the settings
var irc = require('twitch-irc');
var clientOptions = {
    options: {
        debug: false, //Shows debug messages in the console, it shows when an event is triggered.
        debugIgnore: ['ping', 'chat', 'action'] //Ignores selected events while in debug mode.
    },
    identity: {
        username: 'Bot_Name', //Name of your bot
        password: 'oauth token' //oauth token for your bot, can be found here: http://twitchapps.com/tmi/
    },
    logging : {
        enabled: false, //Set to true if you want to keep a log.
        chat: false, //Enabled logging for the chat/action messages
        rewrite: true, //Rewrites the log file when you restart the bot
        timeStamp: true //Shows a timestamp in your log file.
    },
    channels: ['channel_one', 'channel_two'] //Channels to join go here
}
exports.botAdmins = ['admin_one', 'admin_two']; //Enter the usernames of the admins here
exports.client = new irc.client(clientOptions);