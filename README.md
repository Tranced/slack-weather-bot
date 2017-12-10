# slack-weather-bot

A simple weather bot that uses the slackbots API: https://www.npmjs.com/package/slackbots

I used this API because it uses a similar pattern to Discord and Telegram bots which I'm familiar with.

Discord bot example: https://medium.com/@renesansz/tutorial-creating-a-simple-discord-bot-9465a2764dc0
In contrast, the heroku/nodejs slackbot tutorial code which is an express app: https://github.com/mattcreager/starbot

## Work Arounds

The slackbots API does not have an accessible way to set the bot's Web Socket port.
When deployed to Heroku, it would always give the error
```Web process failed to bind to $PORT within 60 seconds of launch```

Which can be fixed by changing the dyno type to a worker since it doesn't
need a port to listen to using this command:

```heroku scale web=0 worker=1```



## Resources used

* PORT fail fix: https://github.com/Naltox/telegram-node-bot/issues/119
* Heroku/NodeJS tutorial: https://devcenter.heroku.com/articles/getting-started-with-nodejs

