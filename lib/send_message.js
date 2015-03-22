var config = require('./config');
var rates = require('./rates');
var rlimit = new rates(config.client);
exports.messageSay = function (string) {
    config.client.addListener('chat', function (channel, user, message) {
        rlimit.queueCommand(channel, function() { config.client.say(channel, string); });
    });
}