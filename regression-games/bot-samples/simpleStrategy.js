// This strategy is the simplest example of how to get started with the RGBot.
// The Bot will run around and gathers Poppies until it has 4 in its inventory.
function simpleStrategy(rg, bot) {

    // This is our main loop. The Bot will invoke this on spawn.
    // goal: collect 4 Poppies
    async function startGathering() {

        // Check the Bot's inventory - if it has less than 4 Poppies
        // then it needs to find and gather one
        while (rg.getInventoryItemQuantity('Poppy') < 4) {

            // Try to locate a Poppy nearby and dig it up
            const collectedPoppy = await rg.findAndDigBlock('Poppy');

            if (collectedPoppy) {
                // If the Bot collected a Poppy, then announce it in chat
                rg.chat('I collected a Poppy.');
            }
            else {
                // If the Bot couldn't find a poppy
                // or failed to collect one it did find,
                // then have it wander around before trying to find another
                await rg.wander();
            }
        }

        // once the Bot has 4 poppies, celebrate!
        rg.chat('Wow! I have collected 4 Poppies!');
    }

    // Have the Bot begin our main loop when it spawns into the game
    bot.on('spawn', async () => {
        rg.chat('Hello, I have arrived!');
        startGathering();
    });

}

module.exports = simpleStrategy;