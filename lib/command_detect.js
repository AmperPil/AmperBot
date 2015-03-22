var config = require('./config');

exports.comIndex = function(comName) {
    config.client.addListener('chat', function (channel, user, message) {
        message.toLowerCase().indexOf(comName) === 0;
    });
}
exports.comInput = function(comName) {
    config.client.addListener('chat', function (channel, user, message) {
        message.toLowerCase() === comName;
    });
}