const SlackBot = require('slackbots');



let bot = new SlackBot({
	token: process.env.TOKEN,
	weatherAPIKey: process.env.API_KEY,
	name : "weather-bot"
});

bot.on('start', function(){
	var params = {
        icon_emoji: ":sunglasses:"
    };

	bot.postMessageToChannel("general", 
		"Hi, I'm weather-bot! To ask me about the weather, please send me a message with the format: `!weather city-name``or `!weather city-name,country`", params);

});

bot.on('message', function(data){
	console.log(data);
});
