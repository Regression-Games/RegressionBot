// This strategy is an intermediate example of how to craft and equip items, and harvest blocks.
// The Bot will create a pickaxe and use it to mine the bell in the starting village
function intermediateStrategy(rg, bot) {

    // This is our main loop. The Bot will invoke this on spawn.
    // goal: Gather wood, use it to craft a pickaxe, and then dig the Bell in the starting village.
    async function startRoutine() {

        // Two of the houses in the starting village have a chest containing logs as well as a crafting table.
        // These are the perfect places to quickly craft a pickaxe, which will allow the Bot to collect the village's Bell.
        // First, find and approach the nearest crafting table
        let craftingTable = await rg.findBlock('crafting_table');
        const pathingSuccessful = await rg.approachBlock(craftingTable, {reach: 3});
        if(!pathingSuccessful) {
            // Sometimes the Bot may encounter pathing issues. Since there are two houses with the perfect
            // conditions for this strategy, the Bot can try to get to the second house if it fails to approach the first one.
            craftingTable = await rg.findBlock('crafting_table', { skipClosest: true });
            await rg.approachBlock(craftingTable, {reach: 3});
        }

        // Next, loot some logs from the chest in the same house.
        // The chest has three, but the Bot only needs two to craft the pickaxe,
        // so we won't let it be too greedy.
        const chest = rg.findBlock('chest', { maxDistance: 10 });
        await rg.approachBlock(chest);
        const chestInventoryWindow = await bot.openContainer(chest);
        await rg.withdrawItems(chestInventoryWindow, { itemName: 'spruce_log', quantity: 2 });
        await chestInventoryWindow.close();

        // Craft the components the Bot will need for one pickaxe
        // Turn the logs into 8 planks, and then two of the planks into some sticks
        await rg.craftItem('spruce_planks', { quantity: 2 });
        await rg.craftItem('stick');

        // Now the Bot has enough materials to craft a pickaxe
        await rg.approachBlock(craftingTable);
        await rg.craftItem('wooden_pickaxe', { craftingTable: craftingTable });
        await rg.holdItem('wooden_pickaxe');

        // Finally, have the Bot collect the Bell using its new pickaxe
        await rg.findAndDigBlock('bell', { maxDistance: 100 });
        rg.chat(`I have collected the village's Bell!`);
    }

    // When spawned, start main function
    bot.on('spawn', async () => {
        rg.chat('Hello! I have arrived!');
        startRoutine();
    });

}

module.exports = intermediateStrategy;