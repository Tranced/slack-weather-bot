const SlackBot = require('slackbots');
const request = require('request');

const weatherAPIKey = process.env.API_KEY;

//make new instance of slackbot
let bot = new SlackBot({
	token: process.env.TOKEN,
	name : "weather-bot",
});

let params = {
	icon_emoji: ":sunglasses:"
}
//initialize slackbot
bot.on('start', function(){

	bot.postMessageToChannel("general", 
		"Hi, I'm weather-bot! To ask me about the weather, please send me a message with the format: `!weather city-name``or `!weather city-name,country`", params);

});


//helper function for different weather cases using weather[0].id
//probably could replace with object literal
let weatherSwitch = function weatherSwitch(id){
	//look at first number in code for common weather categories
	switch(id.toString()[0]){
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

//on event
bot.on('message', function(data){
	let user = data.user;
	
	//check for exclamation mark in case
	//future commands are to be added
	if(data.type == "message" && data.text.substring(0,1) == "!"){

		//get !weather and then splice off ! mark to get command
		let cmd = data.text.split(" ", 1)[0].slice(1);

		//index for rest of arguments
		let cmdStart = data.text.indexOf(" ");

		switch(cmd){
			case "weather":
				//get arguments
				let args = data.text.slice(cmdStart+1);

				//API call
				let url = `http://api.openweathermap.org/data/2.5/weather?q=${args}&APPID=${weatherAPIKey}`;
				request(url,function(error, response, body){
		        	if(error){
		        		bot.postMessageToChannel("general",error,params);
		        	} else{
		        		let weather = JSON.parse(body);

		        		//convert Kelvin to fahreinheit
		        		let fahrenheit = Math.round(9/5*(weather.main.temp-273.15) + 32);
		        		bot.postMessageToChannel("general", weather.weather[0].main + " " + weatherSwitch(weather.weather[0].id), params);
		        		bot.postMessageToChannel("general", "It's " + fahrenheit +" degrees Fahrenheit in " + weather.name, params);
		        	}
	        	})
		}
	}
});
