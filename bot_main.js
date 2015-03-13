// Requires
var irc = require('twitch-irc');
var rates = require('./lib/rates');
//Variables
var userSpecialString;
var chatCol;
var botAdmins = ['amperpil', 'kz_frew', 'eidgod'];

//Date and time
var d = new Date();
var datetime = "The current date and time is: " + d.getDate() + "/"
				+ (d.getMonth()+1)  + "/"
				+ d.getFullYear() + " @ "
				+ d.getHours() + ":"
				+ d.getMinutes() + ":"
				+ d.getSeconds();
//Connection Info
var clientOptions = {
	options: {
		debug: true,
		debugIgnore: ['ping', 'chat', 'action']
	},
	identity: {
		username: 'AmperBot',
		password: 'oauth:8rlu891g2jqpy18yrv9e2v74z8ooa3'
	},
	channels: ['amperpil', 'kz_frew', 'amperbot', 'eidgod', 'feurigerilias']
}
var client = new irc.client(clientOptions);
var rlimit = new rates(client);

client.connect();

client.addListener('chat', function (channel, user, message) {
	//User Levels
	var twitStaff = user.special.indexOf('staff') > -1;
	var twitAdmin = user.special.indexOf('admin') > -1;
	var twitBroad = user.special.indexOf('broadcaster') > -1;
	var twitGlobMod = user.special.indexOf('global_mod') > -1;
	var twitMod = user.special.indexOf('mod') > -1;
	var twitSub = user.special.indexOf('subscriber') > -1;
	var twitTurbo = user.special.indexOf('turbo') > -1;
	var twitView = user.special.indexOf(user) === -1;

	console.log(channel + ', ' + user.username + ': ' + message);
	//Level command
	if (message.toLowerCase() === '&level') {
		if (user.special.length === 1) { // If the user.special array is equal to 1, then set the special string and add on the first entry of the array.
		userSpecialString = 'Your user level is: ' + user.special[0] + '.';
		}
		else if (user.special.length === 0) {
			userSpecialString = 'Your user level is: viewer.'
		}

		else {
		userSpecialString = 'Your user levels are: ';
			for (var i = 0; i < user.special.length; i++) { //While i is less than the length of the array, go through the loop
				if (i != 0) {userSpecialString += ', ';} // If i is not 0, then add on a comma to the end of the special string.
				userSpecialString += user.special[i]; // add on the the entry of the array to special string.
			}
			userSpecialString += '.'
		}
		// then return/send the message in some way, if this was a function:
		rlimit.queueCommand(channel, function() { client.say(channel, userSpecialString); }); // print the special string to the channel.
	}
	//Commands command
	if (message.toLowerCase() === '&commands') {
		rlimit.queueCommand(channel, function() { client.say(channel, 'The commands for this bot can be found at: http://bit.ly/AmperBotHelp'); });
	}
	//Join custom channel
	if (message.toLowerCase().indexOf('&admin_join') === 0) {
		if (botAdmins.indexOf(user.username) > -1){
			//this will make this new string only contain the entries to the command
			var channelToJoin = message.replace('&join ', '');
			client.join(channelToJoin);
			rlimit.queueCommand(channel, function() { client.say(channel, 'The bot has now joined ' + channelToJoin + ' Enjoy!'); });
		} else {
			rlimit.queueCommand(channel, function() { client.say(channel, 'You do not have the permissions to do this command.'); });
		}
	}
	//Join user's channel
	if (message.toLowerCase() === '&join') {
		client.join(user.username);
		rlimit.queueCommand(channel, function() { client.say(channel, 'The bot has now joined your channel, Enjoy!'); });
	}
	//leave current channel
	if (message.toLowerCase() === '&leave') {
		if (botAdmins.indexOf(user.username) > -1 || twitBroad) {
			rlimit.queueCommand(channel, function() { client.say(channel, 'The bot is now going to leave your channel.'); });
			client.part(channel);
		} else if (botAdmins.indexOf(user.username) === -1) {
			rlimit.queueCommand(channel, function() { client.say(channel, 'You do not have the permissions to do this command.'); });
		} else {
			rlimit.queueCommand(channel, function() { client.say(channel, 'Something went wrong, sorry! <3'); });
		}
	}
	//Hug command
	if (message.toLowerCase().indexOf('&hug') === 0) {
		if (user.special.indexOf('mod') >= 0 || botAdmins.indexOf(user.username) > -1){
			var hugRecipent = message.replace('&hug ', '');
			rlimit.queueCommand(channel, function() { client.say(channel, '/me Gives ' + hugRecipent + ' a big hug!'); });
		} else {
			return;
		}
	}
	//kill command
	if (message.toLowerCase().indexOf('&kill') === 0) {
		if (user.special.indexOf('mod') >= 0 || botAdmins.indexOf(user.username) > -1){
			var killRecipent = message.replace('&kill ', '');
			rlimit.queueCommand(channel, function() { client.say(channel, '/me Stabs ' + killRecipent + ' in the chest, killing them. RIP In Peace.'); });
		} else {
			return;
		}
	}
	//Pyramid command
	if (message.toLowerCase() === '&pyramid') {
		if (user.special.indexOf('mod') >= 0 || botAdmins.indexOf(user.username) > -1)
		rlimit.queueCommand(channel, function() { client.say(channel, 'Kappa'); });
		setTimeout(function(){
			rlimit.queueCommand(channel, function() { client.say(channel, 'Kappa Kappa'); });
		}, 1000);
		setTimeout(function(){
			rlimit.queueCommand(channel, function() { client.say(channel, 'Kappa Kappa Kappa'); });
		}, 2000);
		setTimeout(function(){
			rlimit.queueCommand(channel, function() { client.say(channel, 'Kappa Kappa Kappa Kappa'); });
		}, 3000);
		setTimeout(function(){
			rlimit.queueCommand(channel, function() { client.say(channel, 'Kappa Kappa Kappa'); });
		}, 4000);
		setTimeout(function(){
			rlimit.queueCommand(channel, function() { client.say(channel, 'Kappa Kappa'); });
		}, 5000);
		setTimeout(function(){
			rlimit.queueCommand(channel, function() { client.say(channel, 'Kappa'); });
		}, 6000);
	}
	//Time Command
	if (message.toLowerCase() === '&time') {
		rlimit.queueCommand(channel, function() { client.say(channel, datetime + ' (GMT 0)'); });
	}
	//Ability to add admins to the bot through the chat.
	if (message.toLowerCase().indexOf('&admin_add') === 0) {
		if (botAdmins.indexOf(user.username) > -1) {
			var adminRecipent = message.replace('&admin_add ', '');
			botAdmins.push(adminRecipent);
			rlimit.queueCommand(channel, function() { client.say(channel, adminRecipent + ' has been added as an admin of the bot.'); });
		} else if (botAdmins.indexOf(user.username) === -1) {
			rlimit.queueCommand(channel, function() { client.say(channel, 'You do not have the permission to do this command.'); });
		} else {
			rlimit.queueCommand(channel, function() { client.say(channel, 'Something went wrong, sorry! <3'); });
		}
	}
	//Check if user is in the admin list
	if (message.toLowerCase() === '&admin_check') {
		if (botAdmins.indexOf(user.username) > -1) {
			rlimit.queueCommand(channel, function() { client.say(channel, 'Congratulations! You are one of the admins! <3'); });
		} else if (botAdmins.indexOf(user.username) === -1) {
			rlimit.queueCommand(channel, function() { client.say(channel, 'Sorry, You are not one of the admins :('); });
		} else {
			rlimit.queueCommand(channel, function() { client.say(channel, 'Something went wrong, sorry! <3'); });
		}
	}
	//Prints out the list of admins for the bot.
	if (message.toLowerCase() === '&admin_list') {
		rlimit.queueCommand(channel, function() { client.say(channel, 'The admins for the bot are: ' + botAdmins); });
	}
	//Random Colour(Sorry S)
	var randomNum = Math.floor((Math.random() * 14) + 1);
	if (randomNum === 1) {
		chatCol = 'Blue';
	} else if (randomNum === 2) {
		chatCol = 'BlueViolet';
	} else if (randomNum === 3) {
		chatCol = 'CadetBlue';
	} else if (randomNum === 4) {
		chatCol = 'Chocolate';
	} else if (randomNum === 5) {
		chatCol = 'Coral';
	} else if (randomNum === 6) {
		chatCol = 'DodgerBlue';
	} else if (randomNum === 7) {
		chatCol = 'Firebrick';
	} else if (randomNum === 8) {
		chatCol = 'GoldenRod';
	} else if (randomNum === 9) {
		chatCol = 'Green';
	} else if (randomNum === 10) {
		chatCol = 'HotPink';
	} else if (randomNum === 11) {
		chatCol = 'OrangeRed';
	} else if (randomNum === 12) {
		chatCol = 'Red';
	} else if (randomNum === 13) {
		chatCol = 'SeaGreen';
	} else if (randomNum === 14) {
		chatCol = 'SpringGreen';
	} else {
		chatCol = 'YellowGreen';
	}
	if (message.toLowerCase().indexOf('&') === 0) {
		client.color(channel, chatCol);
		console.log('Changed colour to:' + chatCol + ' in ' + channel);
	}
});