//Rename the file to config.js after entering all the settings
var irc = require('twitch-irc');
var clientOptions = {
    options: {
        debug: true,
        debugIgnore: ['ping', 'chat', 'action']
    },
    identity: {
        username: 'Bot_Name', //Name of your bot
        password: 'oauth token' //oauth token for your bot, can be found here: http://twitchapps.com/tmi/
    },
    channels: ['channel_one', 'channel_two'] //Channels to join go here
}
var botAdmins = ['admin_one', 'admin_two']; //Enter the usernames of the admins here
exports.client = new irc.client(clientOptions);