const SlackBot = require('slackbots');
const request = require('request');

const weatherAPIKey = process.env.API_KEY;

//make new instance of slackbot
let bot = new SlackBot({
	token: process.env.TOKEN,
	name : "weather-bot"
});


//initialize slackbot
bot.on('start', function(){
	let params = {
        icon_emoji: ":sunglasses:"
    };

	bot.postMessageToChannel("general", 
		"Hi, I'm weather-bot! To ask me about the weather, please send me a message with the format: `!weather city-name``or `!weather city-name,country`", params);

});


//helper function for different weather cases using weather[0].id
//probably could replace with object literal
let weatherSwitch = function weatherSwitch(id){
	//look at first number in code for common weather categories
	switch(id[0]){
		case "2":
			return ":thunder_cloud_and_rain:";
		case "3":
		case "5":
			return ":rain_cloud:";
		case "6":
			return ":snow_cloud:";
		case "7":
			if(id == "781"){
				return ":tornado:";
			} else{
				return ":fog:";
			}
		case "8":
			if(id == "800"){
				return ":sunny:";
			}else{
				return ":partly_sunny:";
			}

	}
	if(id < 903){
		return ":tornado:";
	} 
	return ":exlamation:";
}

bot.on('message', function(data){
	let user = data.user;
	//check for exclamation mark in case
	//future commands are to be added
	if(data.text.substring(0,1) == "!"){
		let cmd = data.text.splice(1).split(" ", 1);
		let cmdStart = data.text.indexOf(" ");
		switch(cmd){
			case "weather":
				let args = data.text.slice(cmdStart+1)
				let url = `http://api.openweathermap.org/data/2.5/weather?q=${args}&APPID=${weatherAPIKey}`
				request(url,function(error, response, body){
		        	if(error){
		        		bot.postMessageToUser(user,error,params);
		        	} else{
		        		let weather = JSON.parse(body);
		        		let fahrenheit = 9/5*(weather.main.temp-273.15) + 32;
		        		bot.postMessageToUser(user, weather.weather[0].main + " " + weatherSwitch(weather.weather[0].id, params);
		        		bot.postMessageToUser(user, "It's " + fahrenheit +" degrees Fahrenheit in " + weather.name, params);
		        	}
	        	})
		}
	}
});
