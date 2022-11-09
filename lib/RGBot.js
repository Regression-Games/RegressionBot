const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const { GoalNear, GoalPlaceBlock, GoalLookAtBlock, GoalXZ, GoalInvert, GoalFollow } = require('mineflayer-pathfinder').goals
const { Vec3 } = require('vec3');

/**
 *
 * <h2><u>Glossary:</u></h2>
 *
 *  <b><u>Mineflayer and Pathfinder</u></b><br>ß
 *    Mineflayer is a high-level JavaScript API for creating Minecraft Bots.
 *    Mineflayer supports third-party plugins like Pathfinder - an advanced Pathfinding library to help your Bot navigate the world.
 *    Regression Games uses Mineflayer and Pathfinder to create a stable and user-friendly library. Create the best Bot you can with ease. <br>
 *    <i>Mineflayer API documentation - https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md </i><br>
 *    <i>Mineflayer Pathfinder API documentation - https://github.com/PrismarineJS/mineflayer-pathfinder/blob/master/readme.md </i><br>
 *
 *
 *  <b><u>Vec3</u></b><br>
 *    Mineflayer indicates the position of an object as a point along 3 axes. These points are represented as Vec3 instances in the following format:
 *      {x (south), y (up), z(west)} <br>
 *    <i>Vec3 Documentation - https://github.com/PrismarineJS/node-vec3 </i><br>
 *
 *  <b><u>Entity</u></b><br>
 *    An Entity is anything that can be dynamically spawned into the Minecraft world.
 *    Common Entities include other players, enemy mobs, items in your inventory or floating on the ground, and objects you can interact with such as minecarts or beds.
 *
 *  <b><u>Block</u></b><br>
 *    A Block is a specific type of Entity that exist in the environment.
 *    Some yield materials when collected, like blocks of Coal or Diamond, while others can be interacted with like ladders and vines. <br>
 *
 *  <b><u>Item</u></b><br>
 *    An Item represents any Entity that can be collected in the player's inventory or hands.
 *    These can be things like weapons and armor that the player equips, crafting materials, or items that can be placed to create a Block.
 *    This last example brings up an important distinction to keep in mind while creating your Bot: an object is an Item when in the Bot's inventory or hand, or when it has been tossed on the ground, but it is a Block once it is placed in the world.
 *
 *  <b><u>Name versus Display Name</u></b><br>
 *    An Entity's name is a unique identifier, and its display name is typically the same or similar identifier but in a human-readable format.
 *    As an example, the Ender Dragon is the readable name, or display name, of the Entity named ender_dragon. Likewise, Grass Block is the display name of the block named grass_block.
 *    This library attempts to accept both the name and display name interchangeably wherever possible, so the identifier you use is up to your own personal tastes.
 */
const RGBot = class {

    #bot = null;

    constructor(bot) {
        // load pathfinder plugin and setup default Movements.
        // The player can override this by setting new Movements.
        this.mcData = require('minecraft-data')(bot.version);
        bot.loadPlugin(pathfinder);
        bot.pathfinder.setMovements(new Movements(bot, this.mcData));

        this.#bot = bot;
        this.debug = false;
    }

    /**
     * Returns the mineflayer Bot instance controlled by the RGBot. Use this to interact with mineflayer's API directly.
     * @returns {Bot}
     */
    mineflayer() {
        return this.#bot;
    }

    /**
     * Enable or disable debug logs.
     * @param {boolean} debug
     * @returns {void}
     */
    setDebug(debug) {
        this.debug = debug;
    }

    /**
     * Log a message if debug is enabled.
     * @param {string} message
     * @returns {void}
     */
    #log(message) {
        if (this.debug) {
            console.log(message);
        }
    }

    /**
     * Bot sends a chat message in-game. If debug is enabled, also outputs to console.
     * @param {string} message
     * @returns {void}
     */
    chat(message) {
        this.#bot.chat(message);
        this.#log(message);
    }

    /**
     * Waits for the specified number of in-game ticks before continuing.
     * Minecraft normally runs at 20 ticks per second, with an in-game day lasting 24,0000 ticks (20 minutes)
     * This is similar to the standard JavaScript setTimeout function but runs on the physics timer of the Bot specifically.
     * This is useful for waiting on the server to update a Block or spawn drops when you break a Block.
     * @param {number} ticks - the number of in-game ticks to wait
     * @returns {Promise<void>}
     */
    async wait(ticks) {
        await this.#bot.waitForTicks(ticks);
    }

    /**
     * Choose a random point within a minimum and maximum radius around the Bot and approach it.
     * Points are calculated on the X and Z axes.
     * @param {number} minDistance=10 - the minimum distance the point may be from the Bot
     * @param {number} maxDistance=10 - the maximum distance the point may be from the Bot
     * @returns {Promise<boolean>} - true if the Bot successfully reached its wander goal, else false
     */
    async wander(minDistance = 10, maxDistance = 10) {
        if (minDistance < 1) {
            minDistance = 1;
        }
        if (maxDistance < minDistance) {
            maxDistance = minDistance;
        }
        let xRange = (minDistance + (Math.random() * (maxDistance - minDistance))) * (Math.random() < 0.5 ? -1 : 1);
        let zRange = (minDistance + (Math.random() * (maxDistance - minDistance))) * (Math.random() < 0.5 ? -1 : 1);
        let newX = this.#bot.entity.position.x + xRange;
        let newZ = this.#bot.entity.position.z + zRange;

        const pathFunc = async () => {
            await this.#bot.pathfinder.goto(new GoalXZ(newX, newZ));
        };
        return await this.handlePath(pathFunc);
    }

    /**
     * <i><b>Experimental</b></i>
     *
     * Find the nearest entity matching the search criteria.
     * @param {object} [options] - optional parameters
     * @param {string} [options.targetName=null] - target a specific type of Entity. If not specified, then may return an Entity of any type
     * @param {boolean} [options.attackable=false] - only return entities that can be attacked
     * @returns {Entity | null} - the nearest Entity matching the search criteria, or null if no matching Entity can be found
     */
    findEntity(options = {}) {
        const targetName = options.targetName || null;
        const attackable = options.attackable || false;
        this.#log(`Searching for Entity ${targetName}`);
        return this.#bot.nearestEntity(entity => {
            if(entity.isValid && (!targetName || this.entityNamesMatch(targetName, entity))) {
                if(!attackable || (attackable && (entity.type === 'mob' || entity.type === 'player'))) {
                    return true;
                }
            }
            return false;
        })
    }

    /**
     * Represent a Vec3 position as a string in the format 'x, y, z'.
     * @param {vec3} position - a Vec3 object representing the position of some Entity
     * @returns {string}
     */
    positionString(position) {
        return `${position.x}, ${position.y}, ${position.z}`
    }

    /**
     * Accepts an Entity and returns the displayName of the Entity, or its name if it has no displayName.
     * @param {Entity} entity
     * @returns {string | undefined}
     */
    getEntityName(entity) {
        if (entity.objectType === "Item" && entity.onGround) {
            // Special case for items that are on the ground:
            // Their name will show up as simply 'Item', so we need to
            // look up the item's info using its id first...
            const item = this.getItemDefinitionById(entity.metadata[8].itemId);
            return item.displayName || item.name;
        }
        else {
            return entity.displayName || entity.name;
        }
    }

    /**
     * Accepts the name of an Item and returns the corresponding Entity definition for the Item.
     * If the Item isn't defined in minecraft's data, returns null instead.
     * @param {string} itemName
     * @returns {Item | null} - the Item's definition (<i>not</i> an Item instance)
     */
    getItemDefinitionByName(itemName) {
        try {
            return this.mcData.itemsByName[itemName];
        } catch (err) {
            console.error(`Couldn't find item in notch data: ${err.message}`);
            return null;
        }
    }

    /**
     * Accepts the id of an Item and returns the corresponding Entity definition for the Item.
     * If the Item isn't defined in minecraft's data, returns null instead.
     * @param {number} itemId - the item's numerical id
     * @returns {Item | null} - the Item's definition (<i>not</i> an Item instance)
     */
    getItemDefinitionById(itemId) {
        try {
            return this.mcData.items[itemId];
        } catch (err) {
            console.error(`Couldn't find item in notch data: ${err.message}`);
            return null;
        }
    }

    /**
     * Determines whether an Entity's name and/or displayName are equal to a targetName string.
     * @param {string} targetName
     * @param {Entity} entity
     * @param {object} [options] - optional parameters
     * @param {boolean} [options.partialMatch=false] - allow partial matches. For example, 'planks' will match any Entity containing 'planks' in its name ('spruce_planks', 'oak_planks', etc.)
     * @returns {boolean}
     */
    entityNamesMatch(targetName, entity, options = {}) {
        const partialMatch = options.partialMatch || false;
        const text = targetName.toLowerCase();
        const namesMatch = entity.name && ((entity.name.toLowerCase() === text) || (partialMatch && entity.name.toLowerCase().includes(text)));
        const displayNamesMatch = entity.displayName && ((entity.displayName.toLowerCase() === text) || (partialMatch && entity.displayName.toLowerCase().includes(text)));
        return namesMatch || displayNamesMatch;
    }

    /**
     * The Bot will approach the given Entity.
     * @param {Entity} entity - the Entity to approach
     * @param {object} [options] - optional parameters
     * @param {number} [options.reach=1] - the Bot will approach and stand within this reach of the Entity
     * @returns {Promise<boolean>} - true if the Bot successfully reaches the Entity, else false
     */
    async approachEntity(entity, options = {}) {
        const reach = options.reach || 1;
        if (!entity) {
            console.error(`approachEntity: Entity was null or undefined`);
            return false;
        } else {
            this.#log(`Approaching ${this.getEntityName(entity)} within reach of ${reach}`);
            const goal = new GoalNear(entity.position.x, entity.position.y, entity.position.z, reach);
            const pathFunc = async () => {
                await this.#bot.pathfinder.goto(goal);
            };
            return await this.handlePath(pathFunc);
        }
    }

    /**
     * <i><b>Experimental</b></i>
     *
     * The Bot will follow the given Entity.
     * @param {Entity} entity - the Entity to follow
     * @param {object} [options} - optional parameters
     * @param {number} [options.reach=2] - the Bot will follow and remain within this reach of the Entity
     * @returns {Promise<void>}
     */
    async followEntity(entity, options = {}) {
        const reach = options.reach || 2;
        if (!entity) {
            console.error(`followEntity: Entity was null or undefined`);
        } else {
            this.#log(`Following ${this.getEntityName(entity)} within reach of ${reach}`);
            this.#bot.pathfinder.setGoal(new GoalFollow(entity, reach), true);
        }
    }

    /**
     * <i><b>Experimental</b></i>
     *
     * The Bot will avoid the given Entity.
     * @param {Entity} entity - the Entity to avoid
     * @param {object} [options]- optional parameters
     * @param {number} [options.reach=5] - the Bot will not move within this reach of the Entity
     * @returns {Promise<void>}
     */
    async avoidEntity(entity, options = {}) {
        const reach = options.reach || 5;
        if (!entity) {
            console.error(`avoidEntity: Entity was null or undefined`);
        } else {
            this.#log(`Avoiding ${this.getEntityName(entity)} at a minumum reach of ${reach}`);
            this.#bot.pathfinder.setGoal(new GoalInvert(new GoalFollow(entity, reach)), true);
        }
    }

    /**
     * <i><b>Experimental</b></i>
     *
     * The Bot will attack the given Entity one time.
     * This <i>will not</i> move the Bot towards its target: calling {@link `followEntity`} is recommended for staying within attack range of the target as it moves.
     * @param {Entity} entity
     * @returns {void}
     */
    attackEntity(entity) {
        if (!entity) {
            console.error(`attackEntity: Entity was null or undefined`);
        } else {
            try {
                this.#log(`Attacking ${this.getEntityName(entity)}`);
                this.#bot.attack(entity, true);
            } catch (err) {
                console.error(`Error attacking target: ${this.getEntityName(entity)}`, err)
            }
        }
    }

    /**
     * Attempt to locate the nearest block of the given type within a specified range from the Bot.
     * @param blockType {string} - the displayName or name of the block to find
     * @param {object} [options} - optional parameters
     * @param {boolean} [options.partialMatch=false] - find blocks whose name / displayName contains blockType. (Ex. 'log' may find any of 'spruce_log', 'oak_log', etc.)
     * @param {boolean} [options.onlyFindTopBlocks=false] - will not return any blocks that are beneath another block
     * @param {number} [options.maxDistance=50] - find any Blocks matching the search criteria up to and including this distance from the Bot
     * @param {boolean} [options.skipClosest=false] - will attempt to locate the next-closest Block. This can be used to skip the closest Block when the Bot encounters an issue collecting it
     * @returns {Block | null}
     */
    findBlock(blockType, options = {}) {
        const partialMatch = options.partialMatch || false;
        const onlyFindTopBlocks = options.onlyFindTopBlocks || false;
        const maxDistance = options.maxDistance || 50;
        const skipClosest = options.skipClosest || false;

        let nearbyBlocks = this.#bot.findBlocks({
            point: this.#bot.entity.position, // from the bot's current position
            maxDistance: maxDistance, // find blocks within range
            count: (skipClosest ? 2 : 1),
            matching: (block) => {
                let blockFound = false;
                if (blockType) {
                    blockFound = (this.entityNamesMatch(blockType, block, { partialMatch }));
                }
                else if (block.type !== this.mcData.blocksByName.air.id) {
                    blockFound = true; // if nothing specified... try anything but air
                }
                return blockFound;
            },
            useExtraInfo: (block) => {
                if (onlyFindTopBlocks) {
                    const blockAbove = this.#bot.blockAt(block.position.offset(0, 1, 0));
                    return !blockAbove || blockAbove.type === 0 // only find if clear or 'air' above
                }
                return true;
            },
        });

        let result = null;
        if (nearbyBlocks.length > 0) {
            if (!skipClosest) {
                result = this.#bot.blockAt(nearbyBlocks[0]);
            }
            else if (nearbyBlocks.length > 1) {
                result = this.#bot.blockAt(nearbyBlocks[1]);
            }
        }

        if (result) {
            this.#log(`Found Block of type ${blockType} within a maximum distance of ${maxDistance}`);
        }
        else {
            this.#log(`I did not find any Blocks of type ${blockType} within a maximum distance of ${maxDistance}`);
        }
        return result;
    }

    /**
     * Attempt pathfinding. If the Bot becomes 'stuck' then cancel pathfinding.
     * The Bot is considered 'stuck' if it fails to move or perform mining/building actions during a specified interval.
     * @param {function} pathFunc- a function utilizing pathfinder to move the Bot
     * @param {object} [options] - optional parameters
     * @param {number} [options.interval=5000] - how long in ms a Bot must be inactive to be considered 'stuck'
     * @returns {Promise<boolean>} - true if pathing completes, or false if pathing is cancelled or otherwise interrupted
     */
    async handlePath(pathFunc, options = {}) {
        const interval = options.interval || 5000;
        let previousPosition = this.#bot.entity.position;
        let wasActive = true;
        let stuck = false;

        const checkPosition = () => {
            let currentPosition = this.#bot.entity.position;
            let isActive = this.#bot.pathfinder.isMining() || this.#bot.pathfinder.isBuilding();
            if (currentPosition.equals(previousPosition, 0.005) && !wasActive && !isActive) {
                // if the bot hasn't moved or performed other actions then we are stuck
                // stop pathfinder and remove its current goal
                this.#log('Bot is stuck. Stopping current path.');
                stuck = true;
                this.#bot.pathfinder.stop();
                this.#bot.pathfinder.setGoal(null);
            } else {
                previousPosition = currentPosition;
                wasActive = isActive;
            }
        }

        const timer = setInterval(checkPosition, interval);
        try {
            await pathFunc();
        } finally {
            clearInterval(timer);
            return !stuck;
        }
    }

    /**
     * The Bot will approach and stand within reach of the given Block.
     * @param {Block} block - the Block instance to approach
     * @param {object} [options] - optional parameters
     * @param {number} [options.reach=5]
     * @returns {Promise<boolean>} - true if pathing was successfully completed or false if pathing could not be completed
     */
    async approachBlock(block, options = {}) {
        const reach = options.reach || 5;
        const pathFunc = async () => {
            await this.#bot.pathfinder.goto(new GoalLookAtBlock(block.position, this.#bot.world, { reach: reach }))
        };
        try {
            this.#log(`Approaching ${block.displayName || block.name}`);
            return await this.handlePath(pathFunc);
        } catch (err) {
            console.error('Error approaching block', err);
        }
    }

    /**
     * Move directly adjacent to a target Block and place another Block from the Bot's inventory against it.
     * @param {string} blockName - the name of the Block to place. Must be available in the Bot's inventory
     * @param {Block} targetBlock- the target Block to place the new Block on/against
     * @param {object} [options] - optional parameters
     * @param {Vec3} [options.faceVector=Vec3(0, 1, 0)] - the face of the targetBlock to place the new block against (Ex. Vec3(0, 1, 0) represents the topmost face of the targetBlock)
     * @param {number} [options.reach=5] - the Bot will stand within this reach of the targetBlock while placing the new Block
     * @returns {Promise<void>}
     */
    async placeBlock(blockName, targetBlock, options = {}) {
        const faceVector = options.faceVector || new Vec3(0, 1, 0);
        const reach = options.reach || 5;

        this.#log(`Moving to position ${this.positionString(targetBlock.position)} to place ${blockName}`);
        const pathFunc = async() => {
            await this.#bot.pathfinder.goto(new GoalPlaceBlock(targetBlock.position, this.#bot.world, { range: reach }));
        };

        if(await this.handlePath(pathFunc)) {
            await this.holdItem(blockName);
            if(targetBlock.type === this.mcData.blocksByName.grass.id) {
                // Mineflayer tells us that a grass_block sits just above (0, 1, 0) the dirt_block that it is a 'part' of.
                // Mineflayer's bot.placeBlock checks the block above the targetBlock to determine whether our new Block exists after placement.
                // If we give it the position of grass instead of dirt, then our Block _replaces_ the grass_block
                // and mineflayer checks the position _above_ where our new Block should be placed.
                // Obviously, this will be air or some other Block type, and mineflayer will complain.
                targetBlock = this.#bot.blockAt(targetBlock.position.offset(0, -1, 0));
            }
            await this.#bot.placeBlock(targetBlock, faceVector); // place it
        }

    }

    /**
     * Equip the best tool for harvesting the specified Block.
     * @param {Block} block - a harvestable Block instance
     * @returns {Promise<Item | null>} - the tool that was equipped or null if the Bot did not have the tool in its inventory
     */
    async equipBestHarvestTool(block) {
        const bestHarvestTool = this.#bot.pathfinder.bestHarvestTool(block);
        if (bestHarvestTool) {
            try {
                await this.#bot.equip(bestHarvestTool, 'hand');
                return this.#bot.heldItem;
            } catch (err) {
                console.error('Unable to equip a better tool', err);
                return null;
            }
        }
    }

    /**
     * Dig the given Block.
     * This will equip the most appropriate tool in the Bot's inventory for this Block type.
     * @param {Block} block - the Block instance to dig
     * @returns {Promise<void>}
     */
    async digBlock(block) {
        if (!block) {
            console.error(`digBlock: Block was null or undefined`);
        } else {
            await this.equipBestHarvestTool(block);
            const checkForInfiniteDig = async (reason) => {
                if (reason === 'block_updated' || reason === 'dig_error') {
                    // if Bot is still digging but the target block no longer exists then stop the Bot
                    if (this.#bot.pathfinder.isMining() && !this.#bot.targetDigBlock) {
                        this.#log('Cancelling current dig because target block no longer exists.');
                        this.#bot.stopDigging();
                        this.#bot.pathfinder.stop();
                        this.#bot.pathfinder.setGoal(null);
                    }
                }
            }
            this.#bot.on('path_reset', checkForInfiniteDig);
            this.#log(`Digging ${block.displayName || block.name}`);
            await this.#bot.dig(block);
            this.#bot.off('path_reset', checkForInfiniteDig);
        }
    }

    /**
     * Locate and dig the closest Block of a given type within a maximum distance from the Bot.
     * This method will equip the most appropriate tool in the Bot's inventory for this Block type.
     * @param {string} blockType - the name of the Block to find and dig
     * @param {object} [options] - optional parameters
     * @param {boolean} [options.partialMatch=false] - find blocks whose name / displayName contains blockType. (Ex. 'log' may find any of 'spruce_log', 'oak_log', etc.)
     * @param {boolean} [options.onlyFindTopBlocks=false] - will not attempt to dig any Blocks that are beneath another Block
     * @param {number} [options.maxDistance=50] - find any Blocks matching the search criteria up to and including this distance from the Bot
     * @param {boolean} [options.skipClosest=false] - will attempt to locate the next-closest Block. This can be used to skip the closest Block when the Bot encounters an issue collecting it
     * @returns {Promise<boolean>} - true if a Block was found and dug successfully or false if a Block was not found or if digging was interrupted
     */
    async findAndDigBlock(blockType, options = {}) {
        const partialMatch = options.partialMatch || false;
        const onlyFindTopBlocks = options.onlyFindTopBlocks || false;
        const maxDistance = options.maxDistance || 50;
        const skipClosest = options.skipClosest || false;

        let result = false;
        const block = this.findBlock(blockType, { partialMatch, onlyFindTopBlocks, maxDistance, skipClosest });
        if (block) {
            try {
                if (await this.approachBlock(block)) {
                    await this.digBlock(block);

                    // collect any dropped items
                    let droppedItem = null;
                    await this.wait(25); // give the server time to create drops
                    if (block.drops && block.drops.length > 0) {
                        droppedItem = await this.findItemOnGround(block.drops[0]);
                    } else {
                        droppedItem = await this.findItemOnGround(block.name);
                    }

                    if (droppedItem) {
                        await this.approachEntity(droppedItem);
                    }
                    result = true;
                }
            }
            catch (err) {
                console.error('Error finding and digging block', err)
            }
        }
        return result;
    }

    /**
     * Returns a list of all Items that are on the ground within a maximum distance from the Bot (can be empty).
     * @param {object} [options] - optional parameters
     * @param {string} [options.itemName=null] - find only Items with this name
     * @param {boolean} [options.partialMatch=false] - if itemName is defined, find Items whose names / displayNames contain itemName. (Ex. 'boots' may find any of 'iron_boots', 'golden_boots', etc.)
     * @param {number} [options.maxDistance=50] - find any Items matching the search criteria up to and including this distance from the Bot
     * @returns {Item[]} - the list of Items found on the ground (can be empty)
     */
    findItemsOnGround(options = {}) {
        const itemName = options.itemName || null;
        const partialMatch = options.partialMatch || false;
        const maxDistance = options.maxDistance || 50;
        this.#log(`Detecting all items on the ground within a max distance of ${maxDistance}`);
        // this.#bot.entities is a map of entityId : entity
        return Object.values(this.#bot.entities).filter((entity) => {
            if (entity.objectType === "Item" && entity.onGround) {
                const itemEntity = this.getItemDefinitionById(entity.metadata[8].itemId);
                if(!itemName || this.entityNamesMatch(itemName, itemEntity, {partialMatch})) {
                    return this.#bot.entity.position.distanceTo(entity.position) <= maxDistance;
                }
            }
        });
    }

    /**
     * Collects all Items on the ground within a maximum distance from the Bot.
     * @param {object} [options] - optional parameters
     * @param {string} [options.itemName=null] - find and collect only Items with this name
     * @param {boolean} [options.partialMatch=false] - if itemName is defined, find Items whose names / displayNames contain itemName. (Ex. 'boots' may find any of 'iron_boots', 'golden_boots', etc.).
     * @param {number} [options.maxDistance=50] - find and collect any Items matching the search criteria up to and including this distance from the Bot
     * @returns {Promise<Item[]>} - a list of Item definitions for each Item collected from the ground (can be empty)
     */
    async findAndCollectItemsOnGround(options = {}) {
        const itemName = options.itemName || null;
        const partialMatch = options.partialMatch || false;
        const maxDistance = options.maxDistance || 50;
        this.#log(`Collecting all items on the ground within a range of ${maxDistance}`);
        const itemsToCollect = this.findItemsOnGround({itemName, partialMatch, maxDistance});

        let result = [];
        for(let itemToCollect of itemsToCollect) {
            // check to see if item still exists in world
            const itemEntity = this.getItemDefinitionById(itemToCollect.metadata[8].itemId);
            const itemName = this.getEntityName(itemEntity);
            if(await this.findItemOnGround(itemName, {maxDistance}) != null) {
                // if it is on the ground, then approach it and collect it.
                if(await this.approachEntity(itemToCollect)) {
                    result.push(itemToCollect)
                }
            } else {
                // if it isn't, then we will assume we've already picked it up
                result.push(itemToCollect);
            }
        }
        return result;
    }

    /**
     * Locate the closest Item with the given name within a maximum distance from the Bot, or null if no matching Items are found.
     * @param {string} itemName
     * @param {object} [options] - optional parameters
     * @param {number} [options.maxDistance=30] - find any Items matching the search criteria up to and including this distance from the Bot
     * @returns {Item | null}
     */
    findItemOnGround(itemName, options = {}) {
        const maxDistance = options.maxDistance || 30;
        this.#log(`Detecting item ${itemName} within a max distance of ${maxDistance}`);
        return this.#bot.nearestEntity((entity) => {
            if (entity.objectType === "Item" && entity.onGround) {
                const itemEntity = this.getItemDefinitionById(entity.metadata[8].itemId);
                const matchedName = !itemName || this.entityNamesMatch(itemName, itemEntity);
                if (matchedName && this.#bot.entity.position.distanceTo(entity.position) <= maxDistance) {
                    return entity;
                }
            }
        });
    }

    /**
     * Drop an inventory Item on the ground.
     * @param {string} itemName
     * @param {object} [options] - optional parameters
     * @param {boolean} [options.partialMatch=false] - drop items whose name / displayName contains itemName. (Ex. itemName 'stone' will drop 'stone', 'stone_axe', 'stone_sword', etc.)
     * @param {number} [options.quantity=1] - the quantity of this Item to drop. To drop all, use -1 or call `dropAllInventoryItem` instead
     * @returns {Promise<void>}
     */
    async dropInventoryItem(itemName, options = {}) {
        const partialMatch = options.partialMatch || false;
        const quantity = options.quantity || 1;

        let quantityAvailable = 0;
        let itemsToDrop = this.#bot.inventory.items().filter((item) => {
            if (this.entityNamesMatch(itemName, item, {partialMatch})) {
                quantityAvailable += item.count
                return true;
            }
            return false;
        });

        if (quantityAvailable > 0) {
            let quantityToDrop = (quantity < 0 ? quantityAvailable : quantity);
            this.#log(`Dropping ${quantityToDrop} of ${itemName}`);
            try {
                let i = 0;
                while (quantityToDrop > 0 && i < itemsToDrop.length) {
                    // we may need to drop items from multiple stacks to satisfy the quantity
                    const itemToDrop = itemsToDrop[i];
                    const currentQuantity = (itemToDrop.count > quantityToDrop ? quantityToDrop : itemToDrop.count);
                    await this.#bot.toss(itemToDrop.type, itemsToDrop.metadata, currentQuantity);
                    quantityToDrop -= currentQuantity;
                    ++i;
                }
            } catch (err) {
                console.error(`Error encountered while dropping ${itemName} from inventory`, err)
            }
        }
        else {
            console.error(`dropInventoryItem: No ${itemName} in inventory to drop`)
        }
    }

    /**
     * Drops all stacks of an Item in the Bot's inventory matching itemName.
     * Alias for `dropInventoryItem(itemName, {quantity: -1})`
     * @param {string} itemName - the name or display name of the Item(s) to drop
     * @param {object} [options] - optional parameters
     * @param {boolean} [options.partialMatch=false] - drop items whose name / displayName contains itemName. (Ex. itemName 'stone' will drop 'stone', 'stone_axe', 'stone_sword', etc.)
     * @returns {Promise<void>}
     */
    async dropAllInventoryItem(itemName, options = {}) {
        const partialMatch = options.partialMatch || false;
        await this.dropInventoryItem(itemName, { quantity: -1 , partialMatch});
    }

    /**
     * Return how many of a specific item the Bot currently holds in its inventory.
     * @param {string} itemName
     * @param {object} [options] - optional parameters
     * @param {boolean} [options.partialMatch=false] - count any items whose name / displayName contains itemName. (Ex. 'wooden_axe', 'stone_axe', 'diamond_axe', etc. will all be included in the quantity for itemName 'axe').
     * @returns {int}
     */
    getInventoryItemQuantity(itemName, options = {}) {
        const partialMatch = options.partialMatch || false;
        let quantityAvailable = 0;
        this.#bot.inventory.items().filter((item) => {
            if (this.entityNamesMatch(itemName, item, { partialMatch })) {
                quantityAvailable += item.count;
                return true;
            }
            return false;
        });
        this.#log(`Bot has ${quantityAvailable} of item ${itemName}`);
        return quantityAvailable;
    }

    /**
     * Returns true if the Bot has one or more of a specified Item in its inventory, or false if it does not.
     * @param {string} itemName
     * @param {object} [options] - optional parameters
     * @param {boolean} [options.partialMatch=false] - check for any items whose name / displayName contains itemName. (Ex. 'wooden_axe', 'stone_axe', 'diamond_axe', etc. will all satisfy itemName 'axe')
     * @param {number} [options.quantity=1] - the minimum amount of this Item the Bot must have
     * @returns {boolean}
     */
    inventoryContainsItem(itemName, options = {}) {
        const partialMatch = options.partialMatch || false;
        const quantity = options.quantity || 1;
        if (quantity < 1) {
            console.error(`inventoryContainsItem: invalid quantity ${quantity}`);
            return false;
        }
        return this.getInventoryItemQuantity(itemName, {partialMatch}) >= quantity;
    }

    /**
     * Craft an Item. The Bot must have enough materials to make at least one of these Items, or else recipe lookup will fail.
     * If the recipe requires a crafting station, then a craftingTable entity is required for success.
     * @param {string} itemName - the Item to craft
     * @param {object} [options] - optional parameters
     * @param {number} [options.quantity=1] - the number of times to craft this Item. Note: this is NOT the total quantity that should be crafted (Ex. `craftItem('stick', 4)` will result in 16 sticks rather than 4)
     * @param {Block} [options.craftingTable=null] - for recipes that require a crafting table/station. A Block Entity representing the appropriate station within reach of the Bot
     * @returns {Promise<Item | null>} - the crafted Item or null if crafting failed
     */
    async craftItem(itemName, options = {}) {
        const quantity = options.quantity || 1;
        const craftingTable = options.craftingTable || null;
        let result = null;
        const itemId = (this.getItemDefinitionByName(itemName)).id;
        const recipes = this.#bot.recipesFor(itemId, null, null, craftingTable);
        if (recipes.length === 0) {
            this.#log(`Failed to create ${itemName}. Either the item is not valid, or the bot does not possess the required materials to craft it.`);
        }
        else {
            try {
                await this.#bot.craft(recipes[0], quantity, craftingTable);
                result = this.#bot.inventory.findInventoryItem((itemId));
                this.#log(`Crafted ${quantity} of ${itemName}`);
            }
            catch (err) {
                console.error(`Failed to craft ${itemName}: ${err}`);
            }
        }
        return result;
    }

    /**
     * Equips an Item to the Bot's hand. The Bot must have the Item in its inventory to hold it.
     * @param {string} itemName
     * @returns {Promise<Item | null>} - the held Item or null if the Bot was unable to equip the Item
     */
    async holdItem(itemName) {
        const item = this.getItemDefinitionByName(itemName);
        if (item && this.inventoryContainsItem(itemName)) {
            this.#log(`Holding ${itemName}`);
            await this.#bot.equip(item.id, 'hand');
            return this.#bot.heldItem;
        }
        else {
            console.error(`Equip failed: inventory does not contain ${itemName}`);
            return null;
        }
    }

    /**
     * Returns the contents of an open container.
     * If multiple stacks of the same Item are present in the container, they will not be collapsed in the result.
     * @param {Window} containerWindow - the open container Window to withdraw items from
     * @returns {Item[]} - the list of Items present in the container (can be empty)
     */
    getContainerContents(containerWindow) {
        let result = [];
        if (!containerWindow) {
            console.error(`getContainerContents: containerEntity was null or undefined`);
        } else if (containerWindow.slots) {
            for(const slot of containerWindow.slots) {
                if(slot) {
                    result.push(slot);
                }
            }
        }
        return result;
    }

    /**
     * Withdraws one or more items from a container.
     * @param {Window} containerWindow - the open container Window to withdraw items from
     * @param {object} [options] - optional parameters
     * @param {string} [options.itemName=null] - an Item to withdraw from the container. If not specified, will withdraw all Items
     * @param {boolean} [options.partialMatch=false] - Allow partial matches to itemName. For example, 'planks' will match any Item containing 'planks' in its name ('spruce_planks', 'oak_planks', etc.)
     * @param {number} [options.quantity=null] - if itemName is specified, withdraw up to this quantity
     * @returns {Promise<void>}
     */
    async withdrawItems(containerWindow, options = {}) {
        const itemName = options.itemName || null;
        const partialMatch = options.partialMatch || false;
        const quantity = options.quantity || null;

        if (!containerWindow) {
            console.error(`withdrawItems: containerEntity was null or undefined`);
        } else if (!containerWindow.slots) {
            console.error(`withdrawItems: containerEntity is empty`);
        }
        else {
            let quantityCollected = 0;

            // The first 27 slots in this window should belong to the chest.
            // The following 27 slots are the bot's inventory, and the last 9 are the bot's hotbar.
            for (let i = 0; i < 27; i++) {
                const slot = containerWindow.slots[i];
                if(slot && (!itemName || this.entityNamesMatch(itemName, slot, {partialMatch}))) {
                    if(quantity == null) {
                        // if no quantity specified, grab the entire stack
                        await containerWindow.withdraw(slot.type, null, slot.count);
                        quantityCollected += slot.count;
                    }
                    else
                    {
                        // otherwise, figure out how many we still need to withdraw
                        // don't withdraw more than quantity
                        let amountToWithdraw = quantity - quantityCollected;
                        if(amountToWithdraw > 0) {
                            amountToWithdraw = slot.count > amountToWithdraw ? amountToWithdraw : slot.count;
                            await containerWindow.withdraw(slot.type, null, amountToWithdraw);
                            quantityCollected += amountToWithdraw;
                        }
                    }
                }
            }
        }
    }

    /**
     * Deposits one or more items into a container.
     * @param {Window} containerWindow - the open container Window to deposit items into
     * @param {object} [options] - optional parameters
     * @param {string} [options.itemName=null] - an Item to deposit into the container. If not specified, will deposit all Items.
     * @param {boolean} [options.partialMatch=false] - Allow partial matches to itemName. For example, 'planks' will match any Item containing 'planks' in its name ('spruce_planks', 'oak_planks', etc.).
     * @param {number} [options.quantity=null] - if itemName is specified, deposit up to this quantity.
     * @returns {Promise<void>}
     */
    async depositItems(containerWindow, options = {}) {
        const itemName = options.itemName || null;
        const partialMatch = options.partialMatch || false;
        const quantity = options.quantity || null;

        if(!containerWindow) {
            console.error(`depositItems: containerEntity was null or undefined`);
        }
        else {
            let quantityDeposited = 0;

            // mineflayer has a known bug (almost 8 years old...) where the game updates inventory correctly
            // but mineflayer's internal bot.inventory state is not updated when a Window is open... so we need to
            // iterate over the actual window slots, we CANNOT rely on bot.inventory for this.
            // The first 27 slots in this window should belong to the chest.
            // The following 27 slots are the bot's inventory, and the last 9 are the bot's hotbar.
            for (let i = 26; i < 63; i++) {
                const slot = containerWindow.slots[i];
                if(slot && (!itemName || this.entityNamesMatch(itemName, slot, {partialMatch}))) {
                    if(quantity == null) {
                        // if no quantity specified, deposit the entire stack
                        await containerWindow.deposit(slot.type, null, slot.count);
                        quantityDeposited += slot.count;
                    }
                    else
                    {
                        // otherwise, figure out how many we still need to deposit
                        // don't deposit more than quantity
                        let amountToDeposit = quantity - quantityDeposited;
                        if(amountToDeposit > 0) {
                            amountToDeposit = slot.count > amountToDeposit ? amountToDeposit : slot.count;
                            await containerWindow.deposit(slot.type, null, amountToDeposit);
                            quantityDeposited += amountToDeposit;
                        }
                    }
                }
            }
        }
    }

}

module.exports = RGBot