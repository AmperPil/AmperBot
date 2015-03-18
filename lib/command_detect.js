var config = require('./config');

exports.comIndex = function(comName) {
    config.client.addListener('chat', function (message) {
        message.toLowerCase().indexOf(comName) === 0;
    });
}
exports.comInput = function(comName) {
    config.client.addListener('chat', function (message) {
        message.toLowerCase() === comName;
    });
}