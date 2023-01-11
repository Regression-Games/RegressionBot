# Regression Games Bot
[View API Documentation](https://github.com/Regression-Games/RegressionBot/blob/main/docs/api.md)

A stable and user-friendly JavaScript library for creating Bots in a variety of games. 

This library was originally created by [Regression Games](https://www.regression.gg) for use in conjunction with our 
[AI platform](https://medium.com/blockchain-biz/announcing-regression-games-4-2m-seed-round-for-ai-gaming-nea-a16z-b12025a83e95),
but can easily be integrated into your own projects.

Regression Games is currently in its alpha stage and supports Minecraft. Support for other games will be added over time.

## Compiling Typescript

For local testing it is necessary to compile the typescript types.  This is done automatically when publishing.

```
sudo npm install -g typescript
tsc
```

## Install

```
npm install rg-bot
```

## Minecraft

Regression Games uses the [Mineflayer API](https://github.com/PrismarineJS/mineflayer) to interact with Minecraft's API, 
and the [Mineflayer-Pathfinder](https://github.com/PrismarineJS/mineflayer-pathfinder) plugin to handle complex movements. 

RGBot offers a range of methods for interacting with the Minecraft world including placing and breaking Blocks,
looting from and depositing into chests, and initiating combat.

RGBot also supports using Python3 for Mineflayer bots via the https://github.com/extremeheat/JSPyBridge project that
bridges from Python into NodeJS Javascript.  Note that this works for diehard Python fans, but is slower than using
Javascript as all calls into RGBot or Mineflayer APIs use inter process communication to go between the Python and NodeJS
runtimes.

**!!!**
**Note: Python3 bots will currently only work with NodeJS 14.x.y versions.  They will NOT work with 16.x.y versions.**
**!!!**

### Usage within Regression Games

The Regression Games platform requires an `index.js` file with an exported `configureBot` method which acts as an entrypoint into your bot script.
When a match is started through the Regression Games platform, an `RGBot` is created and configured for the player and passed to the `configureBot` method.

Example:

```javascript
/**
 * @param {RGBot} rgbot
 */
function configureBot(rgbot) {

    // turn on debug logging 
    // logs are displayed within the Regression Games app during a match
    rgbot.setDebug(true);

    // announce in chat when Bot spawns
    rgbot.on('spawn', function() {
        rgbot.chat('Hello World');
    })

    // use in-game chat to make the Bot collect or drop wood for you
    rgbot.on('chat', async function (username, message) {
        if(username === rgbot.username()) return

        if(message === 'collect wood') {
            await rgbot.findAndDigBlock('log', {partialMatch: true});
        }
        else if (message === 'drop wood') {
            await rgbot.dropInventoryItem('log', {partialMatch: true, quantity: 1});
        }
    })

}

exports.configureBot = configureBot;
```

```python
import json
import logging
import threading
import javascript

from javascript import require, On

mineflayer = require('mineflayer')
mineflayer_pathfinder = require('mineflayer-pathfinder')
rg_bot = require('rg-bot')
rg_match_info = require('rg-match-info')
Vec3 = require('vec3').Vec3

logging.basicConfig(level=logging.NOTSET)


def configure_bot(bot):

    # turn on debug logging
    # logs are displayed within the Regression Games app during a match
    bot.setDebug(True)

    # announce in chat when Bot spawns
    @On(bot, 'spawn')
    def bot_on_spawn(this):
        bot.chat('Hello World')

    # use in-game chat to make the Bot collect or drop wood for you
    @On(bot, 'chat')
    def bot_on_chat(username, message):
        if username == bot.username():
            return
        if message == 'collect_wood':
            bot.findAndDigBlock('log', {'partialMatch': True})
        elif message == 'drop wood':
            bot.dropInventoryItem('log', {'partialMatch': True, 'quantity': 1});
```

### External use

While `rg-bot` is primarily developed to support the Regression Games platform, it can also be integrated into 
non-Regression-Games projects. Usage in unaffiliated projects is nearly identical to [Usage within Regression Games](#usage-within-regression-games)
with the distinction that you must instantiate and configure your own mineflayer `Bot` and `RGBot`.

Example:

```javascript
// import mineflayer and rg-bot
const mineflayer = require('mineflayer');
const RGBot = require('rg-bot').RGBot;

// create mineflayer bot
const bot = mineflayer.createBot({username: 'Bot'});

// create an RGBot
// RGBot interacts directly with your mineflayer Bot instance
const rgbot = new RGBot(bot);
rgbot.setDebug(true);

// you can invoke methods from both the mineflayer Bot and RGBot
bot.on('spawn', function() {
    rgbot.chat('Hello World');
})

// or you can can choose to make calls to mineflayer through the RGBot for consistency
// This will handle passing through listeners that are not RGBot specific to rg.mineflayer().on(...)
rgbot.on('chat', async function (username, message) {
    if(username === rgbot.username()) return
    
    if(message === 'collect wood') {
        await rgbot.findAndDigBlock('log', {partialMatch: true});
    }
    else if (message === 'drop wood') {
        await rgbot.dropInventoryItem('log', {partialMatch: true, quantity: 1});
    }
})
```

### Additional Examples

For more examples to help you get started with the `rg-bot` package, see these templates from Regression Games:
* [Simple Example](https://github.com/Regression-Games/SimpleBotTemplate)
* [Intermediate Example](https://github.com/Regression-Games/IntermediateBotTemplate)
* [Advanced Example](https://github.com/Regression-Games/AdvancedBotTemplate)

## Join us on Discord!

Have a question or want to discuss improvements and new ideas? 
Contact us through the [Regression Games Discord Server](https://discord.com/invite/925SYVse2H).