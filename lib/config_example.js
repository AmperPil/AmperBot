var clientOptions = {
    options: {
        debug: true,
        debugIgnore: ['ping', 'chat', 'action']
    },
    identity: {
        username: 'Bot Name', //Name of your bot
        password: 'oauth token' //oauth token for your bot, can be found here: http://twitchapps.com/tmi/
    },
    channels: ['channel_one', 'channel_two']
}
var client = new irc.client(clientOptions);
var rlimit = new rates(client);

client.connect();