# Regression Games Bot

A stable and user-friendly JavaScript library for creating Bots in a variety of games. 


This library was originally created by [Regression Games](https://www.regression.gg) for use in conjunction with our 
[AI platform](https://medium.com/blockchain-biz/announcing-regression-games-4-2m-seed-round-for-ai-gaming-nea-a16z-b12025a83e95),
but can easily be integrated into your own projects.

Regression Games is currently in its alpha stage and supports Minecraft. Support for other games will be added
over time.

## Install

```
npm install rg-bot
```

## Minecraft

Regression Games uses the [Mineflayer API](https://github.com/PrismarineJS/mineflayer) to interact with Minecraft's API, 
and the [Mineflayer-Pathfinder](https://github.com/PrismarineJS/mineflayer-pathfinder) plugin to handle complex movements. 

RGBot offers a range of methods for interacting with the Minecraft world including placing and breaking Blocks,
looting from and depositing into chests, and initiating combat.

### Usage within Regression Games

The Regression Games platform requires an `index.js` file with an exported `configureBot` method which acts as an entrypoint into your bot script.
When a match is started through the Regression Games platform, an `RGBot` is created and configured for the player and passed to the `configureBot` method.

Example:

```javascript
/**
 * @param {RGBot} bot
 */
function configureBot(bot) {

    // turn on debug logging 
    // logs are displayed within the Regression Games app during a match
    bot.setDebug(true);

    // announce in chat when Bot spawns
    bot.on('spawn', function() {
        bot.chat('Hello World');
    })

    // use in-game chat to make the Bot collect or drop wood for you
    bot.on('chat', async function (username, message) {
        if(username === bot.mineflayer().username) return

        if(message === 'collect wood') {
            await bot.findAndDigBlock('log', {partialMatch: true});
        }
        else if (message === 'drop wood') {
            await bot.dropInventoryItem('log', {partialMatch: true, quantity: 1});
        }
    })

}

exports.configureBot = configureBot;
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
const rg = new RGBot(bot);
rg.setDebug(true);

// you can invoke methods from both the mineflayer Bot and RGBot
bot.on('spawn', function() {
    rg.chat('Hello World');
})

// or you can can choose to make calls to mineflayer through the RGBot for consistency
rg.mineflayer().on('chat', async function (username, message) {
    if(username === rg.mineflayer().username) return
    
    if(message === 'collect wood') {
        await rg.findAndDigBlock('log', {partialMatch: true});
    }
    else if (message === 'drop wood') {
        await rg.dropInventoryItem('log', {partialMatch: true, quantity: 1});
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