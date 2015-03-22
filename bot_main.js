//Require me!
var fs = require('fs');
var api = require('twitch-irc-api');
var config = require('./lib/config');
var moment = require('moment');
var rates = require('./lib/rates');
var rlimit = new rates(config.client);

//Define me!
var userSpecialString;
var chatCol;
var timeSet;
//var botAdmins = ['amperpil', 'kz_frew', 'eidgod', 'feurigerilias'];

config.client.connect(); //Connects to the twitch servers

config.client.addListener('chat', function (channel, user, message) {
	//var chat = require('./lib/send_message');
	//var comDetect = require('./lib/command_detect');
	var botAdminList = config.botAdmins.indexOf(user.username) > -1;
	var notBotAdmin = config.botAdmins.indexOf(user.username) === -1;
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

	console.log(time + ' ' + channel + ', ' + user.username + ': ' + message); //Writes all of the messages to the console with the time, channel name and the user
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
		rlimit.queueCommand(channel, function() { config.client.say(channel, userSpecialString ) }); // print the special string to the channel.
	}
	/*
	Commands Command
	*/
	else if (message.toLowerCase().indexOf('&commands') === 0) {
		//chat.messageSay('The commands for this bot can be found at: http://bit.ly/AmperBotHelp');
		rlimit.queueCommand(channel, function() { config.client.say(channel, 'The commands for this bot can be found at: http://bit.ly/AmperBotHelp'); });
	}
	else if (message.toLowerCase() === '&github') {
		rlimit.queueCommand(channel, function() { config.client.say(channel,'The github repository for the bot can be found here: https://github.com/AmperPil/AmperBot') });
	}
	/*
	Join custom channel
	*/
	else if (message.toLowerCase().indexOf('&admin_join') === 0) {
		if (botAdminList){
			//this will make this new string only contain the entries to the command
			var channelToJoin = message.replace('&admin_join ', '');
			config.client.join(channelToJoin);
			rlimit.queueCommand(channel, function() { config.client.say(channel,'The bot has now joined ' + channelToJoin + ' Enjoy!'); });
		} else {
			rlimit.queueCommand(channel, function() { config.client.say(channel,'You do not have the permissions to do this command.'); });
		}
	}
	/*
	Join user's channel
	*/
	else if (message.toLowerCase().indexOf('&join') === 0) {
		config.client.join(user.username);
		rlimit.queueCommand(channel, function() { config.client.say(channel,'The bot has now joined your channel, Enjoy!'); });
	}
	/*
	&leave current channel
	*/
	else if (message.toLowerCase().indexOf('&leave') === 0) {
		if (botAdminList || twitBroad) {
			rlimit.queueCommand(channel, function() { config.client.say(channel,'The bot is now going to leave your channel.'); });
			config.client.part(channel);
		} else if (notBotAdmin) {
			rlimit.queueCommand(channel, function() { config.client.say(channel,'You do not have the permissions to do this command.'); });
		} else {
			rlimit.queueCommand(channel, function() { config.client.say(channel,'Something went wrong, sorry! <3'); });
		}
	}
	/*
	Hug someone!
	*/
	else if (message.toLowerCase().indexOf('&hug') === 0) {
		if (twitBroad || twitMod || botAdminList){
			var hugRecipent = message.replace('&hug ', '');
			rlimit.queueCommand(channel, function() { config.client.say(channel,'/me gives ' + hugRecipent + ' a big hug!'); });
		} else {
			return;
		}
	}
	/*
	Kill someone :(
	*/
	else if (message.toLowerCase().indexOf('&kill') === 0) {
		if (twitBroad || twitMod || botAdminList){
			var killRecipent = message.replace('&kill ', '');
			rlimit.queueCommand(channel, function() { config.client.say(channel,'/me stabs ' + killRecipent + ' in the chest, killing them. RIP In Peace.'); });
		} else {
			return;
		}
	}
	/*
	Set timezone
	*/
	else if (message.toLowerCase().indexOf('&time_set') === 0) {
		if (botAdminList) {
			timeSet = message.replace('&time_set ', '');
			rlimit.queueCommand(channel, function() { config.client.say(channel,'The default timezone has been set to: ' + timeSet); });
		}
		else if (notBotAdmin) {
			rlimit.queueCommand(channel, function() { config.client.say(channel,'Sorry! Only admins can do this command! <3'); });
		}

	}
	else if (message.toLowerCase().indexOf('&time_offset') === 0) {
		rlimit.queueCommand(channel, function() { config.client.say(channel,'The current offset is: ' + timeSet); });
	}
	/*
	Current Time
	*/
	else if (message.toLowerCase().indexOf('&time') === 0) {
		if (twitBroad || twitMod || botAdminList) {
			var timezone = message.replace('&time ', '');
			var timezoneInt = parseInt(timezone);
			var timeSetInt = parseInt(timeSet);


			if (timezone.toLowerCase() === '&time') {
				now.utcOffset(timeSetInt);
				rlimit.queueCommand(channel, function() { config.client.say(channel,'It is currently: ' + now.format('DD-MM-YYYY @ HH:mm:ss Z')); });
			}
			else if (timezone != '') {
				now.utcOffset(timezoneInt);
				rlimit.queueCommand(channel, function() { config.client.say(channel,'It is currently: ' + now.format('DD-MM-YYYY @ HH:mm:ss Z')); });
			}
			else {
				rlimit.queueCommand(channel, function() { config.client.say(channel,'Something went wrong. Sorry! <3'); });
			}
		}
	}
	/*
	All credit for the uptime command goes to schmoopiie. the gist can be found here: https://gist.github.com/Schmoopiie/410827edd6a47e76a2b4
	*/
	else if (message.toLowerCase().indexOf('&uptime') === 0) {
		var currentBroad = channel.replace('#', '')
		api.call({
				channel: null,
				method: 'GET',
				path: '/streams/' + currentBroad,
				options: {}
			},
			function (err, statusCode, response) {
				if (!err && statusCode === 200) {
					if (response.stream) {
						var broadcaster = response.stream['channel']['display_name'];
						var currentDate = new Date(moment().toISOString());
						var streamDate  = new Date(response.stream['created_at']);
						var timeDiff    = new Date(moment.utc(moment(currentDate,"DD/MM/YYYY HH:mm:ss").diff(moment(streamDate,"DD/MM/YYYY HH:mm:ss"))).format("DD/MM/YYYY HH:mm:ss"));
						var hours   = timeDiff.getHours();
						var minutes = timeDiff.getMinutes();
						var seconds = timeDiff.getSeconds();
						var result  = hours + 'hours ' + (minutes < 10 ? '0' + minutes : minutes) + 'mins ' + (seconds  < 10 ? '0' + seconds : seconds) + 'secs';

						rlimit.queueCommand(channel, function() { config.client.say(channel,broadcaster + ' has been online for ' + result + '.'); });
					} else {
						rlimit.queueCommand(channel, function() { config.client.say(channel,'Sorry, but we are not live at the moment.'); });
					}
				} else {
					rlimit.queueCommand(channel, function() { config.client.say(channel,'Having issues with the Twitch API, try again later.'); });
				}
			}
		);
	}
	/*
	Ability to add admins to the bot through the chat.
	*/
	else if (message.toLowerCase().indexOf('&admin_add') === 0) {
		if (botAdminList) {
			var adminRecipent = message.replace('&admin_add ', '');
			config.botAdmins.push(adminRecipent);
			rlimit.queueCommand(channel, function() { config.client.say(channel,adminRecipent + ' has been added as an admin of the bot.'); });
		} else if (notBotAdmin) {
			rlimit.queueCommand(channel, function() { config.client.say(channel,'You do not have the permission to do this command.'); });
		} else {
			rlimit.queueCommand(channel, function() { config.client.say(channel,'Something went wrong, sorry! <3'); });
		}
	}
	/*
	Check if you are an admin
	*/
	else if (message.toLowerCase().indexOf('&admin_check') === 0) {
		if (botAdminList) {
			rlimit.queueCommand(channel, function() { config.client.say(channel,'Congratulations! You are one of the admins! <3'); });
		} else if (notBotAdmin) {
			rlimit.queueCommand(channel, function() { config.client.say(channel,'Sorry, You are not one of the admins :('); });
		} else {
			rlimit.queueCommand(channel, function() { config.client.say(channel,'Something went wrong, sorry! <3'); });
		}
	}
	/*
	List of admins
	*/
	else if (message.toLowerCase().indexOf('&admin_list') === 0) {
		rlimit.queueCommand(channel, function() { config.client.say(channel,'The admins for the bot are: ' + config.botAdmins); });
	}
	else if (message.toLowerCase().indexOf('&rps') === 0) {
		if (twitBroad || twitMod || botAdminList) {
			var rpsOption = message.toLowerCase().replace('&rps ', '');
			var rpsRandNum = Math.floor((Math.random() * 90000) + 1);

			if (rpsOption === 'scissors') {
				if (rpsRandNum > 0 && rpsRandNum < 30000) { rlimit.queueCommand(channel, function() { config.client.say(channel,'ROCK - Rock beats Scissors! You lose ' + user.username); }); }
				if (rpsRandNum > 29000 && rpsRandNum < 60000) { rlimit.queueCommand(channel, function() { config.client.say(channel,'PAPER - Hmm, I lose. Congrats ' + user.username); }); }
				if (rpsRandNum > 59000 && rpsRandNum < 91000) { rlimit.queueCommand(channel, function() { config.client.say(channel,'SCISSORS - Damn, its a draw.'); }); }
			}
			else if (rpsOption === 'paper') {
				if (rpsRandNum > 0 && rpsRandNum < 30000) { rlimit.queueCommand(channel, function() { config.client.say(channel,'ROCK - Hmm, I lose. Congrats ' + user.username); }); }
				if (rpsRandNum > 29000 && rpsRandNum < 60000) { rlimit.queueCommand(channel, function() { config.client.say(channel,'PAPER - Damn, its a draw.'); }); }
				if (rpsRandNum > 59000 && rpsRandNum < 91000) { rlimit.queueCommand(channel, function() { config.client.say(channel,'SCISSORS - Scissors beats Paper! You lose ' + user.username); }); }
			}
			else if (rpsOption === 'rock') {
				if (rpsRandNum > 0 && rpsRandNum < 30000) { rlimit.queueCommand(channel, function() { config.client.say(channel,'ROCK - Damn, its a draw.'); }); }
				if (rpsRandNum > 29000 && rpsRandNum < 60000) { rlimit.queueCommand(channel, function() { config.client.say(channel,'PAPER - Paper beats Rock! You lose ' + user.username); }); }
				if (rpsRandNum > 59000 && rpsRandNum < 91000) { rlimit.queueCommand(channel, function() { config.client.say(channel,'SCISSORS - Hmm, I lose. Congrats ' + user.username); }); }
			}
			else {
				rlimit.queueCommand(channel, function() { config.client.say(channel,'Please choose either Paper, rock, or scissors.'); });
			}
		}
	}
	/*
	Error Message
	*/
	else if (message.toLowerCase().indexOf('&') === 0) {
		rlimit.queueCommand(channel, function() { config.client.say(channel,'Sorry, that is not a command. Please make sure you typed it correctly.'); });
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