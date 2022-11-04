// This strategy is an advanced example of how to customize movements, place blocks, and craft items with RGBot.
// The Bot will chop wood until it has 100 points-worth of items in its inventory.
// (Note: Logs and apples are each worth 1 point)
function advancedStrategy(rg, bot) {

    // This function will make the Bot chop + pick up a Spruce Log.
    async function gatherLog() {

        // Track whether the Bot encountered any issues while chopping a log.
        // There are so many trees around the spawn area that it can
        // simply try to chop a different one
        let skipCurrentLog = false;
        const logsBefore = rg.getInventoryItemQuantity('spruce_log');

        // Ensure that if the Bot fails to gather the dropped log,
        // it will try collecting another log until its inventory reflects one has been picked up
        while (rg.getInventoryItemQuantity('spruce_log') <= logsBefore) {
            const foundLog = await rg.findBlock('spruce_log', {skipClosest: skipCurrentLog});
            if (foundLog) {
                // If the Bot located a spruce log, then go chop it
                const success = await rg.findAndDigBlock('spruce_log', {skipClosest: skipCurrentLog});
                if (!success) {
                    // If anything prevents the Bot from breaking the block,
                    // then find the next-closest log and try chopping that instead.
                    skipCurrentLog = true;
                } else {
                    skipCurrentLog = false;
                }
            } else {
                // If the Bot didn't find any logs nearby,
                // then allow it to wander a bit and look again.
                // This loop makes sure it completes the 'wander' movement.
                let didWander = false;
                while (!didWander) {
                    didWander = await rg.wander();
                }
            }
        }
    }

    // The bot will announce whenever it collects a log or an apple
    bot.on('playerCollect', async (collector, collected) => {
        const itemName = rg.getEntityName(collected).toLowerCase();
        if (collector.username === bot.username && (itemName.includes('log') || itemName === 'apple')) {
            rg.chat(`I collected a ${itemName}`);
        }
    });

    // This method gathers enough wood to craft two axes
    // (crafting two at once is more efficient than waiting for the first to break before we craft the second)
    async function craftAxes() {

        // If the Bot doesn't have all the materials it needs to craft two axes, then gather them now.

        // First, the crafting table:
        // If the Bot doesn't have one already, then 4 planks are needed to craft it.
        // The Bot can get planks from 1 log if needed.
        if (!rg.inventoryContainsItem('crafting_table')) {
            if (!rg.inventoryContainsItem('spruce_planks', { quantity: 4 })) {
                if (!rg.inventoryContainsItem('spruce_log')) {
                    await gatherLog();
                }
                await rg.craftItem('spruce_planks');
            }
            await rg.craftItem('crafting_table');
        }

        // Next, sticks:
        // If the Bot doesn't have 4 of them, then 2 planks are needed to craft them.
        // The Bot can get planks from 1 log if needed.
        if (!rg.inventoryContainsItem('stick', { quantity: 4 })) {
            if (!rg.inventoryContainsItem('spuce_planks', { quantity: 2 })) {
                if (!rg.inventoryContainsItem('spruce_log')) {
                    await gatherLog();
                }
                await rg.craftItem('spruce_planks');
            }
            await rg.craftItem('stick');
        }

        // Lastly, planks:
        // If the Bot doesn't have 6 of them, then 2 logs are needed to craft them.
        if (!rg.inventoryContainsItem('spruce_planks', { quantity: 6 })) {
            const logsCarried = rg.getInventoryItemQuantity('spruce_log');
            const logsNeeded = (rg.getInventoryItemQuantity('spruce_planks')) >= 2 ? 1 : 2;
            for (let i = logsCarried; i < logsNeeded; i++) {
                await gatherLog();
            }
            await rg.craftItem('spruce_planks', { quantity: logsNeeded });
        }

        // Finally, craft the axes
        // Locate a spot to place the craftingTable, place it, then stand next to it
        const ground = rg.findBlock('grass', {onlyFindTopBlocks: true, maxDistance: 10}) || rg.findBlock('dirt', { onlyFindTopBlocks: true, maxDistance: 10});
        await rg.placeBlock('crafting_table', ground);
        const placedTable = await rg.findBlock('crafting_table');
        await rg.approachBlock(placedTable);

        // Craft 2 axes and equip one of them, then gather the crafting table
        await rg.craftItem('wooden_axe', { quantity: 2, craftingTable: placedTable });
        await rg.holdItem('wooden_axe');
        await rg.findAndDigBlock('crafting_table');
    }

    // When the Bot spawns, begin the main gathering loop.
    // Before collecting a log, have the Bot craft axes if it has none.
    bot.on('spawn', async () => {
        rg.chat('Hello, I have arrived!');

        let logsCollected = rg.getInventoryItemQuantity('spruce_log');
        let applesCollected = rg.getInventoryItemQuantity('apple');
        while (logsCollected + applesCollected < 100) {
            if (!rg.inventoryContainsItem('_axe', {partialMatch: true})) {
                // craft axes if inventory doesn't have any
                await craftAxes();
            }
            await gatherLog();
        }

        // Once we have 100 points, announce it in the chat
        rg.chat(`I reach my goal! I have ${logsCollected} logs and ${applesCollected} apples`);
    });

}

module.exports = advancedStrategy;