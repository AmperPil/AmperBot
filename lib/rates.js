var rates = function(client) {
    var self = this;

    /* Some internal variables for rates limit */
    self.cmdQueue = {
        channel: [],
        command: [],
        timestamp: [],
        count: 0,
        unmoded: +new Date()
    };

    /* Count how many commands we did in the last 30 seconds and clear old timestamps */
    function countCommands(cb) {
        var current  = Math.round(new Date() / 1000);
        var interval = current - 30;

        for (var i = 0; i < self.cmdQueue.timestamp.length; ++i) {
            if (self.cmdQueue.timestamp[i] >= interval) { self.cmdQueue.count++; }
            else { self.cmdQueue.timestamp.splice(i, 1); }
        }

        cb(self.cmdQueue.count);
    }

    /* Where the magic happens */
    var dequeue = function() {
        self.cmdQueue.count = 0;
        countCommands(function (count) {
            // We have at least a command to perform..
            if (self.cmdQueue.command.length >= 1) {
                // One command at the time..
                var curr = 0;
                var stop = false;
                self.cmdQueue.channel.forEach(function (channel) {
                    if (!stop) {
                        // Make sure the bot is moderator..
                        var isMod = false;
                        try { isMod = client.isMod(channel, client.getOptions().identity.username.toLowerCase()); } catch(e) { isMod = false; }

                        // If we are not moderator, make sure we do not exceed 20 messages in 30 seconds. (Changed to 18 just to be sure)
                        if (!isMod && count <= 18) {
                            // Make sure there is a delay of at least 1300ms between commands when not moderator, otherwise Twitch will not execute your command
                            // and will respond with: Your message was not sent because you are sending messages too quickly.
                            if ((+new Date() - self.cmdQueue.unmoded) >= 1300) {
                                self.cmdQueue.unmoded = +new Date();
                                self.cmdQueue.timestamp.push(Math.round(new Date() / 1000));
                                self.cmdQueue.command[curr]();
                                self.cmdQueue.command.splice(curr, 1);
                                self.cmdQueue.channel.splice(curr, 1);
                            }
                            stop = true;
                        }

                        // If we are moderator, make sure we do not exceed 100 messages in 30 seconds. (Changed to 98 just to be sure)
                        else if (isMod && count <= 98) {
                            self.cmdQueue.timestamp.push(Math.round(new Date() / 1000));
                            self.cmdQueue.command[curr]();
                            self.cmdQueue.command.splice(curr, 1);
                            self.cmdQueue.channel.splice(curr, 1);
                            stop = true;
                        }
                        curr++;
                    }
                });
            }
        });
    };

    setInterval(dequeue, 300);
};

/* Queue a command for a channel */
rates.prototype.queueCommand = function(channel, fn) {
    var self = this;
    self.cmdQueue.channel.push(channel);
    self.cmdQueue.command.push(fn);
};

module.exports = rates;