# Regression Games Bot

A stable and user-friendly JavaScript library for creating Bots in a variety of games. 


This library was originally created by [Regression Games](https://www.regression.gg) for use in conjunction with our 
[AI platform](https://medium.com/blockchain-biz/announcing-regression-games-4-2m-seed-round-for-ai-gaming-nea-a16z-b12025a83e95),
but can easily be integrated into your own projects.

Regression Games is currently in its alpha stage and supports Minecraft. Support for other games will be added
over time.

## Install

```node
npm install rg-bot
```

## Minecraft

Regression Games uses the [Mineflayer API](https://github.com/PrismarineJS/mineflayer) and 
[Mineflayer-Pathfinder](https://github.com/PrismarineJS/mineflayer-pathfinder) plugin to interact with Minecraft's API. 

### Getting Started

Instantiate a new RGBot from a Mineflayer Bot instance. RGBot automatically loads the pathfinder plugin to handle
complex movements. From here, RGBot offers a range of methods for interacting with the Minecraft world including placing and breaking Blocks, 
looting from and depositing into chests, and initiating combat. 

#### Example

```javascript
// import mineflayer and rg-bot
const mineflayer = require('mineflayer');
const RGBot = require('rg-bot').RGBot;

// RGBot interacts directly with your mineflayer Bot instance 
const bot = mineflayer.createBot({username: 'Bot'});
const rg = new RGBot(bot);
rg.setDebug(true);

// announce in chat when the Bot spawns
bot.on('spawn', function() {
    rg.chat('Hello World');
})

// use in-game chat to make the Bot collect or drop wood for you
bot.on('chat', async function (username, message) {
    if(username === bot.username) return
    
    if(message === 'collect wood') {
        await rg.findAndDigBlock('log', {partialMatch: true});
    }
    else if (message === 'drop wood') {
        await rg.dropInventoryItem('log', {partialMatch: true, quantity: 1});
    }
})

```

## Join us on Discord!

Have a question or want to discuss improvements and new ideas? 
Contact us through the [Regression Games Discord Server](https://discord.com/invite/925SYVse2H).








