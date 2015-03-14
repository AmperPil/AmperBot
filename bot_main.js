var config = require('./lib/config');
var rates = require('./lib/rates');
var moment = require('moment-timezone');
//Variables
var userSpecialString;
var chatCol;
var botAdmins = ['amperpil', 'kz_frew', 'eidgod', 'feurigerilias'];

//Date and time
var d = new Date();
var datetime = "The current date and time is: " + d.getDate() + "/"
                                + (d.getMonth()+1)  + "/"
                                + d.getFullYear() + " @ "
                                + d.getHours() + ":"
                                + d.getMinutes() + ":"
                                + d.getSeconds();

//Connection Info
var rlimit = new rates(config);
config.client.connect();

config.client.addListener('chat', function (channel, user, message) {
	//Date + Time
	var now = moment();
	var time = "[" + now.format('HH:mm:ss') + "]";
	//User Levels
	var twitStaff = user.special.indexOf('staff') > -1;
	var twitAdmin = user.special.indexOf('admin') > -1;
	var twitBroad = user.special.indexOf('broadcaster') > -1;
	var twitGlobMod = user.special.indexOf('global_mod') > -1;
	var twitMod = user.special.indexOf('mod') > -1;
	var twitSub = user.special.indexOf('subscriber') > -1;
	var twitTurbo = user.special.indexOf('turbo') > -1;
	var twitView = user.special.indexOf(user) === -1;

	console.log(time + ' ' + channel + ', ' + user.username + ': ' + message);
	/*
	Level Command
	*/
	if (message.toLowerCase().indexOf('&level') === 0) {
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
		rlimit.queueCommand(channel, function() { config.client.say(channel, userSpecialString); }); // print the special string to the channel.
	}
	/*
	Commands Command
	*/
	else if (message.toLowerCase().indexOf('&commands') === 0) {
		rlimit.queueCommand(channel, function() { config.client.say(channel, 'The commands for this bot can be found at: http://bit.ly/AmperBotHelp'); });
	}
	else if (message.toLowerCase() === '&github') {
		rlimit.queueCommand(channel, function() { config.client.say(channel, 'The github repository for the bot can be found here: https://github.com/AmperPil/AmperBot'); });
	}
	/*
	Join custom channel
	*/
	else if (message.toLowerCase().indexOf('&admin_join') === 0) {
		if (botAdmins.indexOf(user.username) > -1){
			//this will make this new string only contain the entries to the command
			var channelToJoin = message.replace('&join ', '');
			config.client.join(channelToJoin);
			rlimit.queueCommand(channel, function() { config.client.say(channel, 'The bot has now joined ' + channelToJoin + ' Enjoy!'); });
		} else {
			rlimit.queueCommand(channel, function() { config.client.say(channel, 'You do not have the permissions to do this command.'); });
		}
	}
	/*
	Join user's channel
	*/
	else if (message.toLowerCase().indexOf('&join') === 0) {
		config.client.join(user.username);
		rlimit.queueCommand(channel, function() { config.client.say(channel, 'The bot has now joined your channel, Enjoy!'); });
	}
	/*
	&leave current channel
	*/
	else if (message.toLowerCase().indexOf('&leave') === 0) {
		if (botAdmins.indexOf(user.username) > -1 || twitBroad) {
			rlimit.queueCommand(channel, function() { config.client.say(channel, 'The bot is now going to leave your channel.'); });
			config.client.part(channel);
		} else if (botAdmins.indexOf(user.username) === -1) {
			rlimit.queueCommand(channel, function() { config.client.say(channel, 'You do not have the permissions to do this command.'); });
		} else {
			rlimit.queueCommand(channel, function() { config.client.say(channel, 'Something went wrong, sorry! <3'); });
		}
	}
	/*
	Hug someone!
	*/
	else if (message.toLowerCase().indexOf('&hug') === 0) {
		if (user.special.indexOf('mod') >= 0 || botAdmins.indexOf(user.username) > -1){
			var hugRecipent = message.replace('&hug ', '');
			rlimit.queueCommand(channel, function() { config.client.say(channel, '/me gives ' + hugRecipent + ' a big hug!'); });
		} else {
			return;
		}
	}
	/*
	Kill someone :(
	*/
	else if (message.toLowerCase().indexOf('&kill') === 0) {
		if (user.special.indexOf('mod') >= 0 || botAdmins.indexOf(user.username) > -1){
			var killRecipent = message.replace('&kill ', '');
			rlimit.queueCommand(channel, function() { config.client.say(channel, '/me stabs ' + killRecipent + ' in the chest, killing them. RIP In Peace.'); });
		} else {
			return;
		}
	}
	/*
	Kappa Pyramid
	*/
	else if (message.toLowerCase().indexOf('&pyramid') === 0) {
		if (user.special.indexOf('mod') >= 0 || botAdmins.indexOf(user.username) > -1)
		rlimit.queueCommand(channel, function() { config.client.say(channel, 'Kappa'); });
		setTimeout(function(){
			rlimit.queueCommand(channel, function() { config.client.say(channel, 'Kappa Kappa'); });
		}, 1000);
		setTimeout(function(){
			rlimit.queueCommand(channel, function() { config.client.say(channel, 'Kappa Kappa Kappa'); });
		}, 2000);
		setTimeout(function(){
			rlimit.queueCommand(channel, function() { config.client.say(channel, 'Kappa Kappa Kappa Kappa'); });
		}, 3000);
		setTimeout(function(){
			rlimit.queueCommand(channel, function() { config.client.say(channel, 'Kappa Kappa Kappa'); });
		}, 4000);
		setTimeout(function(){
			rlimit.queueCommand(channel, function() { config.client.say(channel, 'Kappa Kappa'); });
		}, 5000);
		setTimeout(function(){
			rlimit.queueCommand(channel, function() { config.client.say(channel, 'Kappa'); });
		}, 6000);
	}
	/*
	Set timezone
	*/
	else if (message.toLowerCase().indexOf('&time_set') === 0) {

	}
	/*
	Current Time
	*/
	else if (message.toLowerCase().indexOf('&time') === 0) {
		var timezone = message.replace('&time ', '');
		var timezoneInt = parseInt(timezone);
		now.utcOffset(timezoneInt);
		rlimit.queueCommand(channel, function() { config.client.say(channel, 'It is currently: ' + now.format('DD-MM-YYYY @ HH:mm:ss Z'))});
	}
	/*
	Ability to add admins to the bot through the chat.
	*/
	else if (message.toLowerCase().indexOf('&admin_add') === 0) {
		if (botAdmins.indexOf(user.username) > -1) {
			var adminRecipent = message.replace('&admin_add ', '');
			botAdmins.push(adminRecipent);
			rlimit.queueCommand(channel, function() { config.client.say(channel, adminRecipent + ' has been added as an admin of the bot.'); });
		} else if (botAdmins.indexOf(user.username) === -1) {
			rlimit.queueCommand(channel, function() { config.client.say(channel, 'You do not have the permission to do this command.'); });
		} else {
			rlimit.queueCommand(channel, function() { config.client.say(channel, 'Something went wrong, sorry! <3'); });
		}
	}
	/*
	Check if you are an admin
	*/
	else if (message.toLowerCase().indexOf('&admin_check') === 0) {
		if (botAdmins.indexOf(user.username) > -1) {
			rlimit.queueCommand(channel, function() { config.client.say(channel, 'Congratulations! You are one of the admins! <3'); });
		} else if (botAdmins.indexOf(user.username) === -1) {
			rlimit.queueCommand(channel, function() { config.client.say(channel, 'Sorry, You are not one of the admins :('); });
		} else {
			rlimit.queueCommand(channel, function() { config.client.say(channel, 'Something went wrong, sorry! <3'); });
		}
	}
	/*
	List of admins
	*/
	else if (message.toLowerCase().indexOf('&admin_list') === 0) {
		rlimit.queueCommand(channel, function() { config.client.say(channel, 'The admins for the bot are: ' + botAdmins); });
	}
	/*
	Error Message
	*/
	else if (message.toLowerCase().indexOf('&') === 0) {
		rlimit.queueCommand(channel, function() { config.client.say(channel, 'Sorry, that is not a command. Please make sure you typed it correctly.') });
	}
	/*
	Random Colour(Credit goes to S for the idea, and originally creating it in mIRC script)
	*/
	var randomNum = Math.floor((Math.random() * 14) + 1);
	switch(randomNum){
		case 1:
			chatCol = 'Blue';
			break;
		case 2:
			chatCol = 'BlueViolet';
			break;
		case 3:
			chatCol = 'CadetBlue';
			break;
		case 4:
			chatCol = 'Chocolate';
			break;
		case 5:
			chatCol = 'Coral';
			break;
		case 6:
			chatCol = 'DodgerBlue';
			break;
		case 7:
			chatCol = 'Firebrick';
			break;
		case 8:
			chatCol = 'GoldenRod';
			break;
		case 9:
			chatCol = 'Green';
			break;
		case 10:
			chatCol = 'HotPink';
			break;
		case 11:
			chatCol = 'OrangeRed';
			break;
		case 12:
			chatCol = 'Red';
			break;
		case 13:
			chatCol = 'SeaGreen';
			break;
		case 14:
			chatCol = 'SpringGreen';
			break;
		default:
			chatCol = 'YellowGreen';
			break;
	}
	if (message.toLowerCase().indexOf('&') === 0) {
		config.client.say(channel, '/color ' + chatCol);
		console.log('Changed colour to:' + chatCol + ' in ' + channel);
	}
});