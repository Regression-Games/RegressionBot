const mineflayer = require('mineflayer');
const { RGMatchInfo } = require('rg-match-info')
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const { GoalNear, GoalPlaceBlock, GoalLookAtBlock, GoalXZ, GoalInvert, GoalFollow } = require('mineflayer-pathfinder').goals
const { Vec3 } = require('vec3');
const nbt = require('prismarine-nbt');
const {BestHarvestTool,FindResult} = require('./RGModels');

/**
 *
 * <h2><u>Glossary:</u></h2>
 *
 *  <b><u>Mineflayer and Pathfinder</u></b><br>
 *    Mineflayer is a high-level JavaScript API for creating Minecraft Bots.
 *    Mineflayer supports third-party plugins like Pathfinder - an advanced Pathfinding library to help your Bot navigate the world.
 *    Regression Games uses Mineflayer and Pathfinder to create a stable and user-friendly library. Create the best Bot you can with ease. <br>
 *    <i>Mineflayer API documentation - https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md </i><br>
 *    <i>Mineflayer Pathfinder API documentation - https://github.com/PrismarineJS/mineflayer-pathfinder/blob/master/readme.md </i><br>
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
 *    This last example brings up an important distinction to keep in mind while creating your Bot: an object is an Item when in the bot inventory or hand, or when it has been tossed on the ground, but it is a Block once it is placed in the world.
 *
 *  <b><u>Name versus Display Name</u></b><br>
 *    An Entity's name is a unique identifier, and its display name is typically the same or similar identifier but in a human-readable format.
 *    As an example, the Ender Dragon is the readable name, or display name, of the Entity named ender_dragon. Likewise, Grass Block is the display name of the block named grass_block.
 *    This library provides functions to accept the name exclusively, or the name and display name interchangeably, so the identifier you use is up to your own personal tastes.
 */
const RGBot = class {

    /**
     * This is managed automatically by the openAndUseContainer(containerBlock, options, useContainerFunction) function.
     * This value is read by the handlePath function to know if the bot is stuck or not.
     *
     * If you open a container outside the openAndUseContainer function you should follow the example.
     *
     * @example
     * let openChest = await bot.mineflayer().openChest(chestBlock)
     * if (openChest) {
     *     try {
     *         isLookingInChest = true;
     *         //  take action on the chest
     *     } finally {
     *         isLookingInChest = false;
     *     }
     * }
     *
     * @type {boolean}
     */
    isLookingInContainer = false;

    /**
     * This is managed automatically by the craftItem(itemName, options) function.
     * This value is read by the handlePath function to know if the bot is stuck or not.
     *
     * If you craft outside the handleCrafting function you should follow the example.
     *
     * @example
     * try {
     *     bot.isCrafting = true;
     *     //  do crafting actions
     * } finally {
     *     bot.isCrafting = false;
     * }
     *
     * @type {boolean}
     */
    isCrafting = false;

    /**
     * This is managed automatically by attackEntity(entity).  This is used to manage weapon cool-downs.
     *
     * If you attack outside the attackEntity function you should follow the example.
     *
     * @example
     * await bot.followEntity(entity, {reach: 2})
     * await bot.waitForWeaponCoolDown()
     * let attackItem = await bot.findAndEquipBestAttackItem()
     * bot.lastAttackTime = Date.now()
     * // actually perform the attack
     *
     * @type {number}
     */
    lastAttackTime = -1;

    /**
     * This is managed automatically by attackEntity(entity).  This is used to manage weapon cool-downs.
     *
     * If you attack outside the attackEntity function you should follow the example.
     *
     * @example
     * await bot.followEntity(entity, {reach: 2})
     * await bot.waitForWeaponCoolDown()
     * let attackItem = await bot.findAndEquipBestAttackItem()
     * bot.lastAttackTime = Date.now()
     * bot.lastAttackItem = attackItem
     * // actually perform the attack
     *
     * @type {Item}
     */
    lastAttackItem = undefined;

    /**
     * Holds the latest Regression Games match info if it has been provided.
     * Match info is updated on match start, score updates, player join, player left, and match end.
     *
     * @type {RGMatchInfo}
     */
    #matchInfo = undefined;

    #bot = null;

    /**
     *
     * @param {Bot} bot
     * @param {EventEmitter} matchInfoEmitter
     */
    constructor(bot, matchInfoEmitter) {

        this.mcData = require('minecraft-data')(bot.version);
        this.debug = false;

        // load pathfinder plugin and setup default Movements.
        // The player can override this by setting new Movements.
        bot.loadPlugin(pathfinder);
        const defaultMovements = new Movements(bot, this.mcData);
        defaultMovements.allowParkour = false;
        bot.pathfinder.setMovements(defaultMovements);

        this.#bot = bot;

        // Keep the match info up to date
        matchInfoEmitter.on('player_left', (matchInfo, playerName, team) => {
            this.#matchInfo = matchInfo;
        })
        matchInfoEmitter.on('player_joined', (matchInfo, playerName, team) => {
            this.#matchInfo = matchInfo;
        })
        matchInfoEmitter.on('score_update', (matchInfo) => {
            this.#matchInfo = matchInfo;
        })
        matchInfoEmitter.on('match_ended', (matchInfo) => {
            this.#matchInfo = matchInfo;
        })
        matchInfoEmitter.on('match_started', (matchInfo) => {
            this.#matchInfo = matchInfo;
        })

        // Use collection events to log pickups
        bot.on('playerCollect', async (collector, collected) => {
            if (this.debug) {
                if (collector.username === this.username()) {
                    this.#logDebug(`I collected: ${collected.username || collected?.metadata?.length > 8 && this.getItemDefinitionById(collected?.metadata[8]?.itemId)?.name || collected.name}`);
                }
            }
        });

    }

    /**
     * Log a message at debug level if RGBot debug is enabled.
     * @param {string} message
     * @returns {void}
     */
    #logDebug(message,ex = undefined) {
        if (this.debug) {
            if (ex) {
                console.debug(message, ex);
            } else {
                console.debug(message)
            }
        }
    }
    
    /**
     * Log a message at info level even if RGBot debug is not enabled.
     * @param {string} message
     * @returns {void}
     */
    #log(message,ex = undefined) {
        if (ex) {
            console.log(message, ex);
        } else {
            console.log(message)
        }
    }


    /**
     * Log a message at warn level even if RGBot debug is not enabled.
     * @param {string} message
     * @param {exception} ex Optional
     * @returns {void}
     */
    #logWarn(message, ex = undefined) {
        if (ex) {
            console.warn(message, ex);
        } else {
            console.warn(message)
        }
    }

    /**
     * Log a message at error level even if RGBot debug is not enabled.
     * @param {string} message
     * @param {exception} ex Optional
     * @returns {void}
     */
    #logError(message, ex= undefined) {
        if (ex) {
            console.error(message, ex);
        } else {
            console.error(message)
        }
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
     * Returns the mineflayer Bot instance controlled by the RGBot. Use this to interact with the mineflayer API directly.
     * @returns {Bot} The mineflayer Bot instance controlled by the RGBot
     * @see {@link https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md|MineFlayer API}
     *
     * @example <caption>Accessing mineflayer API through mineflayer()</caption>
     * // returns the bot username from mineflayer
     * rgBot.mineflayer().username
     */
    mineflayer() {
        return this.#bot;
    }

    /**
     * Listen for an event and invoke a function when it fires.
     * @param {string} event The event to listen for
     * @param {function()} func Function that is invoked when event fires
     * @returns {void}
     * 
     * @example <caption>Reacting to the spawn event</caption>
     * rgBot.on('spawn', () => { rgBot.chat('Hello World!') })
     */
    on(event, func) {
        this.#bot.on(event, func);
    }

    /**
     * Enable or disable use of parkour while pathing to a destination. Parkour is disabled by default.
     * Parkour movements include moving vertically over trees and other structures rather than walking around them, and jumping over gaps instead of laying Blocks to cross them.
     * Enabling parkour may allow your Bot to reach destinations faster and place fewer blocks to achieve upwards movement.
     * However, this is more likely to cause the Bot to become stuck during pathing and may require additional logic to handle movement issues.
     * @param {boolean} allowParkour Whether the Bot is allowed to use parkour movements to reach a destination
     * @returns {void}
     */
    allowParkour(allowParkour) {
        this.#bot.pathfinder.movements.allowParkour = allowParkour;
    }

    /**
     * Enable or disable the ability to dig blocks while pathing to a destination. Digging is enabled by default.
     * Disabling digging will allow your Bot to reach destinations without breaking important structures that stand between the bot and its goal.
     * @param {boolean} allowDig Whether the Bot is allowed to dig Blocks in order to remove obstacles that stand in the way of its destination
     * @returns {void}
     */
    allowDigWhilePathing(allowDig) {
        this.#bot.pathfinder.movements.canDig = allowDig;
    }

    /**
     * Bot sends a chat message in-game. Also outputs to console if debug is enabled.
     * @param {string} message
     * @returns {void}
     */
    chat(message) {
        this.#bot.chat(message);
        this.#logDebug(message);
    }

    /**
     * Bot sends a whisper message in-game to a specific username.  Also outputs to console if debug is enabled.
     *
     * @param {string} username
     * @param {string} message
     * @returns {void}
     */
    whisper(username, message) {
        this.#bot.whisper(username, message);
        this.#logDebug(message);
    }

    /**
     * Gets the current Regression Games match info.
     * This is updated every time a player_joined,player_left,match_started,match_ended,score_update event occurs on the matchInfoEmitter.
     *
     * You can also listen to these events in your own bot scripts.
     *
     * @example
     *
     *     matchInfoEmitter.on('player_joined', (matchInfo, playerName, team) => {
     *         console.log(`Player joined our match: ${playerName}-${team}`)
     *     })
     *
     *     matchInfoEmitter.on('match_ended', async(matchInfo) => {
     *         const points = matchInfo?.players.find(player => player.username === bot.userName())?.metadata?.score
     *         console.log(`The match has ended - I scored ${points} points`)
     *     })
     *
     * @returns {RGMatchInfo | null}
     */
    matchInfo() {
        return this.#matchInfo;
    }

    /**
     * Gets the username of this bot
     * @returns {string}
     */
    username() {
        return this.#bot.username
    }

    /**
     * Gets the current position of the bot
     * @returns {Vec3}
     */
    position() {
        return this.#bot.entity.position
    }

    /**
     *
     * @param {string} username Username of the player/bot
     *
     * @returns {string | null} Name of the team the player is on
     */
    teamForPlayer(username) {
        return this.#matchInfo.players.filter(player => player.username === username).at(0)?.team
    }

    /**
     * Waits for the specified number of in-game ticks before continuing.
     * Minecraft normally runs at 20 ticks per second, with an in-game day lasting 24,0000 ticks (20 minutes).
     * This is similar to the standard JavaScript setTimeout function but runs on the physics timer of the Bot specifically.
     * This is useful for waiting on the server to update a Block or spawn drops when you break a Block.
     * @param {number} ticks The number of in-game ticks to wait
     * @returns {Promise<void>}
     */
    async wait(ticks) {
        await this.#bot.waitForTicks(ticks);
    }

    /**
     * Represent a Vec3 position as a string in the format 'x, y, z'.
     * @param {Vec3} position A Vec3 object representing the position of some Entity
     * @returns {string} A string representation of the Vec3 position
     * 
     * @example
     * // returns "15.0, 63, -22.2"
     * rgBot.vecToString(new Vec(15.0, 63, -22.2))
     */
    vecToString(position) {
        return `${position.x}, ${position.y}, ${position.z}`;
    }

    /**
     * Accepts a string in the format 'x, y, z' and returns a Vec3 object representing that position.
     * This is useful for creating chat commands that involve specific coordinates from the Player.
     * @param {string} positionString
     * @returns {Vec3 | null} A Vec3 representation of the position string, or null if the positionString was invalid
     * 
     * @example
     * // returns new Vec(15.0, 63, -22.2)
     * rgBot.vecFromString("15.0, 63, -22.2")
     */
    vecFromString(positionString) {
        const coordinates = positionString.split(",")
        if(coordinates.length !== 3) {
            this.#logWarn(`positionFromString: invalid positionString ${positionString}`);
            return null;
        } else {
            let x = parseFloat(coordinates[0].trim());
            let y = parseFloat(coordinates[1].trim());
            let z = parseFloat(coordinates[2].trim());
            return new Vec3(x, y, z);
        }
    }

    /**
     * Accepts an Entity and returns the name of the Entity.  This does not consider displayName, only name.
     * If the entity has a 'username', returns username.
     * @param {Entity | Block | Item} entity
     * @returns {string | undefined}
     *
     * @example 
     * // entity -> {username: "NinaTheDragon", name: "ender_dragon", displayName: "Ender Dragon"}
     * // returns "NinaTheDragon"
     * rgBot.getEntityName(entity)
     *
     * @example
     * // entity -> {username: undefined, name: "ender_dragon", displayName: "Ender Dragon"}
     * // returns "ender_dragon"
     * rgBot.getEntityName(entity)
     * 
     * @example 
     * // entity -> {username: undefined, name: "cocoa_beans", displayName: undefined}
     * // returns "cocoa_beans"
     * rgBot.getEntityName(entity)
     * 
     * @example 
     * // entity -> {username: undefined, name: undefined, displayName: undefined}
     * // returns undefined
     * rgBot.getEntityName(entity)
     */
    getEntityName(entity) {
        if (entity.username) {
            return entity.username
        } else if (entity.objectType === "Item" && entity.onGround && entity?.metadata?.length > 8) {
            // Special case for items that are on the ground:
            // Their name will show up as simply 'Item', so we need to
            // look up the item's info using its id first...
            const item = this.getItemDefinitionById(entity.metadata[8]?.itemId);
            return item?.name || entity.name;
        }
        return entity.name;
    }

    /**
     * Accepts an Entity and returns the displayName of the Entity, or its name if it has no displayName.
     * If the entity has a 'username', returns username.
     * @param {Entity | Block | Item} entity
     * @returns {string | undefined}
     *
     * @example
     * // entity -> {username: "NinaTheDragon", name: "ender_dragon", displayName: "Ender Dragon"}
     * // returns "NinaTheDragon"
     * rgBot.getEntityName(entity)
     *
     * @example
     * // entity -> {username: undefined, name: "ender_dragon", displayName: "Ender Dragon"}
     * // returns "Ender Dragon"
     * rgBot.getEntityName(entity)
     *
     * @example
     * // entity -> {username: undefined, name: "cocoa_beans", displayName: undefined}
     * // returns "cocoa_beans"
     * rgBot.getEntityName(entity)
     *
     * @example
     * // entity -> {username: undefined, name: undefined, displayName: undefined}
     * // returns undefined
     * rgBot.getEntityName(entity)
     */
    getEntityDisplayName(entity) {
        if (entity.username) {
            return entity.username
        } else if (entity.objectType === "Item" && entity.onGround && entity?.metadata?.length > 8) {
            // Special case for items that are on the ground:
            // Their name will show up as simply 'Item', so we need to
            // look up the item's info using its id first...
            const item = this.getItemDefinitionById(entity.metadata[8]?.itemId);
            return item?.displayName || item?.name || entity.displayName || entity.name;
        }
        return entity.displayName || entity.name;
    }

    /**
     * Accepts the name of an Item and returns the corresponding Entity definition for the Item.
     * If the Item isn't defined in minecraft's data, returns null instead.
     * @param {string} itemName The name of the Item to lookup (<i>not</i> its display name)
     * @returns {Item | null} The Item's definition (<i>not</i> an Item instance)
     * 
     * @example 
     * // returns {"id":102,"displayName":"Spruce Log","name":"spruce_log","stackSize":64}
     * rgBot.getItemDefinitionByName('spruce_log')
     */
    getItemDefinitionByName(itemName) {
        try {
            return this.mcData.itemsByName[itemName];
        } catch (err) {
            this.#logWarn(`Couldn't find item in notch data: ${err.message}`);
            return null;
        }
    }

    /**
     * Accepts the id of an Item and returns the corresponding Entity definition for the Item.
     * If the Item isn't defined in minecraft's data, returns null instead.
     * @param {number} itemId The item's unique numerical id
     * @returns {Item | null} The Item's definition (<i>not</i> an Item instance)
     *
     * @example
     * // returns {"id":102,"displayName":"Spruce Log","name":"spruce_log","stackSize":64}
     * rgBot.getItemDefinitionByName(102)
     */
    getItemDefinitionById(itemId) {
        try {
            return this.mcData.items[itemId];
        } catch (err) {
            this.#logWarn(`Couldn't find item in notch data: ${err.message}`);
            return null;
        }
    }

    /**
     * Determines whether an Entity's username or name is equal to a targetName string.  Does not consider displayName.
     * Matching is case-sensitive.
     *
     * @param {string} targetName
     * @param {Entity|Item} entity
     * @param {object} [options={}] Optional parameters
     * @param {boolean} [options.partialMatch=false] Allow partial matches. For example, '_planks' will match any Entity containing 'planks' in its name ('spruce_planks', 'oak_planks', etc.)
     * @returns {boolean}
     *
     * @example <caption>Full Match</caption>
     * const entity = rg.getItemDefinitionByName('iron_axe')
     * rgBot.entityNamesMatch('iron_axe', entity) // returns true
     * rgBot.entityNamesMatch('Iron Axe', entity) // returns false
     *
     * @example <caption>Partial Match</caption>
     * const entity = rg.getItemDefinitionByName('iron_axe')
     * rgBot.entityNamesMatch('_axe', entity, {partialMatch: true}) // returns true
     */
    entityNamesMatch(targetName, entity, options = {}) {
        const partialMatch = options.partialMatch || false;
        const usernameMatch = (username, targetName) => { return username && ((username === targetName) || (partialMatch && username.includes(targetName)))};
        const namesMatch = (entityName, targetName) =>  { return entityName && ((entityName === targetName) || (partialMatch && entityName.includes(targetName)))};
        return usernameMatch(entity.username, targetName) || namesMatch(entity.name, targetName)
    }

    /**
     * <i><b>Experimental</b></i>
     *
     * Determines whether an Entity's username or displayName or name are equal to a targetName string.
     * Matching for username and name is case-sensitive.  Matching for displayName is NOT case-sensitive.
     * Generally you should use entityNamesMatch(targetName, entity, options) instead of this function.
     *
     * @param {string} targetName
     * @param {Entity|Item} entity
     * @param {object} [options={}] Optional parameters
     * @param {boolean} [options.partialMatch=false] Allow partial matches. For example, '_planks' will match any Entity containing 'planks' in its name ('spruce_planks', 'oak_planks', etc.)
     * @returns {boolean}
     *
     * @example <caption>Full Match</caption>
     * const entity = rg.getItemDefinitionByName('iron_axe')
     * rgBot.entityDisplayNamesMatch('iron_axe', entity) // returns true - matched name
     * rgBot.entityDisplayNamesMatch('Iron Axe', entity) // returns true - matched displayName
     * rgBot.entityDisplayNamesMatch('iron axe', entity) // returns true - matched displayName
     *
     * @example <caption>Partial Match</caption>
     * const entity = rg.getItemDefinitionByName('iron_axe')
     * rgBot.entityDisplayNamesMatch('_axe', entity, {partialMatch: true}) // returns true
     */
    entityDisplayNamesMatch(targetName, entity, options = {}) {
        const partialMatch = options.partialMatch || false;
        const usernameMatch = (username, targetName) => { return username && ((username === targetName) || (partialMatch && username.includes(targetName)))};
        const namesMatch = (entityName, targetName) =>  { return entityName && ((entityName === targetName) || (partialMatch && entityName.includes(targetName)))};
        const displayNamesMatch = (entityDisplayNameLower, targetNameLower) => { return entityDisplayNameLower && ((entityDisplayNameLower === targetNameLower) || (partialMatch && entityDisplayNameLower.includes(targetNameLower)))};
        return usernameMatch(entity.username, targetName) || displayNamesMatch(entity.displayName?.toLowerCase(), targetName.toLowerCase()) || namesMatch(entity.name, targetName)
    }

    /**
     * Attempt pathfinding. If the Bot becomes 'stuck' then cancel pathfinding.
     * The Bot is considered 'stuck' if it fails to move or perform mining/crafting/chest-interaction actions during a specified interval.
     * @param {function()} pathFunc- a function utilizing pathfinder to move the Bot
     * @param {object} [options={}] - optional parameters
     * @param {number} [options.interval=5000] - how long in ms a Bot must be inactive to be considered 'stuck'
     * @returns {Promise<boolean>} - true if pathing completes, or false if pathing is cancelled or otherwise interrupted
     *
     * @example
     * const goal = new GoalNear(entity.position.x, entity.position.y, entity.position.z, reach);
     * const success = await rgBot.handlePath(async () => {
     *  await rgBot.mineflayer().pathfinder.goto(goal);
     * });
     */
    async handlePath(pathFunc, options = {}) {
        const interval = options.interval || 5000;
        let previousPosition = this.position();
        let stuck = false;

        const checkPosition = () => {
            try {
                let currentPosition = this.#bot.entity.position;
                if (currentPosition.distanceTo(previousPosition) < 2 && !this.#bot.pathfinder.isMining() && !this.isLookingInContainer && !this.isCrafting) {
                    // if the bot hasn't moved or performed other actions then we are stuck
                    // stop pathfinder and remove its current goal
                    this.#log(`!!!!!!!!!!!!!! Bot is stuck at ${this.vecToString(currentPosition)}. Stopping pathfinding...`);
                    stuck = true;
                    this.#bot.pathfinder.setGoal(null);
                    //this.#bot.pathfinder.stop();
                } else {
                    previousPosition = currentPosition;
                }
            } catch (ex) {
                this.#logDebug(`! Caught expected GoalChanged error stopping stuck bot`)
            }
        }

        const timer = setInterval(checkPosition, interval);
        try {
            await pathFunc();
        } catch (err) {
            if (stuck) {
                this.#logDebug(`!! Caught expected GoalChanged error stopping stuck bot`)
            } else {
                this.#logDebug(`!! Caught GoalChanged error during handlePath`, err)
            }
            return false
        } finally {
            clearInterval(timer);
        }
        return !stuck;
    }

    /**
     * <i><b>Experimental</b></i>
     *
     * Find the nearest entity matching the search criteria.
     * @param {object} [options={}] Optional parameters
     * @param {string} [options.targetName=undefined] Target a specific type of Entity. If not specified, then may return an Entity of any type
     * @param {boolean} [options.attackable=false] Only return entities that can be attacked
     * @returns {Entity | null} The nearest Entity matching the search criteria, or null if no matching Entity can be found
     *
     * @example <caption>Locate the nearest chicken</caption>
     * rgBot.findEntity({targetName: "chicken"})
     *
     * @deprecated Since 1.2.0, please use findEntities(options, sortValueFunction)
     */
    findEntity(options = {}) {
        this.#logWarn(`findEntity(options): Deprecated since 1.2.0, please use findEntities(options, sortValueFunction)`)
        options['entityNames'] = options.targetName && [options.targetName] || [];
        return this.findEntities(options).shift()?.result
    }

    /**
     * Find the nearest entity matching the search criteria.
     *
     * @param {object} [options={}]
     * @param {string[]} [options.entityNames=[]] List of targetNames to consider
     * @param {boolean} [options.attackable=false] Whether the entity must be attackable. If true finds only mob and player entities.
     * @param {boolean} [options.partialMatch=false] Consider entities whose username or name partially match one of the targetNames
     * @param {number} [options.maxDistance=null]  Max range to consider
     * @param {number} [options.maxCount=1]  Max count of matching entities to consider
     *
     * @param {function(health:number,defense:number,distance:number):number} [sortValueFunction] Function of that should return the best target with the lowest value, so it sorts to front.
     *
     * @return {FindResult[]}
     *
     * By default, this sorts by distance, but a good example function for considering health would be { return -1 * ((20-health)-(distance*1.1)) }
     *
     * To get the 'best' entity result, call findEntities(...).shift().  Note that the result may be null|undefined if no entities were found
     */
    findEntities(options = {}, sortValueFunction = (health, defense, distance) => { return distance } ) {
        const attackable = options.attackable || false;
        const partialMatch = options.partialMatch || false;
        const maxCount = options.maxCount || 1;
        const maxDistance = options.maxDistance || null;
        const entityNames = options.entityNames || [];
        /**
         * @type {Entity[]}
         */
        const potentialTargets = []

        /**
         *
         * @type {Object.<number,number>}
         */
        const distances = {}

        this.#bot.nearestEntity(entity => {
            if(entity.isValid && (!entityNames || entityNames.length === 0 || entityNames.find(targetName => (entity.username && entity.username === targetName) || targetName === entity.name || (partialMatch && ( (entity.username && entity.username.includes(targetName)) || entity.name.includes(targetName)))))) {
                if(!attackable || (attackable && (entity.type === 'mob' || entity.type === 'player'))) {
                    const distance = this.position().distanceTo(entity.position)
                    if (distance>maxDistance) {
                        return false // we ran out of 'close' entities
                    }
                    potentialTargets.push(entity)
                    distances[entity.id] = distance
                }
            }
            return potentialTargets.length >= maxCount;
        })

        let result = potentialTargets.map(pt => {
            let distance = distances[pt.id]
            if (!distance) {
                distance = this.position().distanceTo(pt.position)
                distances[pt.id] = distance
            }
            let health = pt.health || 10 // assume half max hp of 10 , which is passive animal hp
            let defense = 0 // TODO
            const sortValue = sortValueFunction(health, defense, distance)
            return new FindResult(pt, sortValue)
        }).sort((a,b) => {
            return a.value - b.value
        })

        result.length = Math.min(result.length, maxCount || result.length)

        return result
    }

    /**
     * The Bot will approach the given Entity.
     * @param {Entity} entity The Entity to approach
     * @param {object} [options={}] Optional parameters
     * @param {number} [options.reach=1] The Bot will approach and stand within this reach of the Entity
     * @returns {Promise<boolean>} true if the Bot successfully reaches the Entity, else false
     */
    async approachEntity(entity, options = {}) {
        const reach = options.reach || 1;
        if (!entity) {
            this.#logWarn(`approachEntity: Entity was null or undefined`);
            return false;
        } else {
            try {
                const rangeToEntity = this.position().distanceTo(entity.position);
                this.#logDebug(`approachEntity: Approaching ${this.getEntityName(entity)} from range ${rangeToEntity} within reach of ${reach}`);
                const goal = new GoalNear(entity.position.x, entity.position.y, entity.position.z, reach);
                return await this.handlePath(async () => {
                    await this.#bot.pathfinder.goto(goal);
                });
            } catch(err) {
                this.#log(`approachEntity: failed to approach ${this.getEntityName(entity)}`)
                return false;
            }
        }
    }

    /**
     * <i><b>Experimental</b></i>
     *
     * The Bot will follow the given Entity.
     * @param {Entity} entity The Entity to follow
     * @param {object} [options={}] Optional parameters
     * @param {number} [options.reach=2] The Bot will follow and remain within this reach of the Entity
     * @returns {Promise<void>}
     */
    async followEntity(entity, options = {}) {
        const reach = options.reach || 2;
        if (!entity) {
            this.#logWarn(`followEntity: Entity was null or undefined`);
        } else {
            this.#logDebug(`Following ${this.getEntityName(entity)} within reach of ${reach}`);
            this.#bot.pathfinder.setGoal(new GoalFollow(entity, reach), true);
        }
    }

    /**
     * <i><b>Experimental</b></i>
     *
     * The Bot will avoid the given Entity.
     * @param {Entity} entity The Entity to avoid
     * @param {object} [options={}] Optional parameters
     * @param {number} [options.reach=5] The Bot will not move within this reach of the Entity
     * @returns {Promise<void>}
     */
    async avoidEntity(entity, options = {}) {
        const reach = options.reach || 5;
        if (!entity) {
            this.#logWarn(`avoidEntity: Entity was null or undefined`);
        } else {
            this.#logDebug(`Avoiding ${this.getEntityName(entity)} at a minimum reach of ${reach}`);
            this.#bot.pathfinder.setGoal(new GoalInvert(new GoalFollow(entity, reach)), true);
        }
    }

    /**
     * <i><b>Experimental</b></i>
     *
     * This will move the bot to within range of the target, equip the most powerful weapon in the bot inventory,
     * and attack the target 1 time.  To finish off a target, this method must be called until the target is dead.
     *
     * @param {Entity} entity - The entity to attack
     * @param {object} [options={}] Optional parameters
     * @param {number} [options.reach=2] How close to get to the target before attacking
     * @param {Item} [options.attackItem=undefined] An item in the bot inventory to use for the attack
     * @returns {boolean} - did we successfully attack
     *
     * @example
     * let target = //<someEntity>
     * while (target.isValid) {
     *     attackEntity(target)
     * }
     *
     * Note: This method currently only uses melee weapons
     */
    async attackEntity(entity, options={}) {
        const reach = options.reach || 2;
        if (entity) {
            try {
                this.#logDebug(`Following and attacking entity ${entity.username || entity.name}`)
                if (entity.isValid) {
                    const moveGoal = new GoalNear(entity.position.x, entity.position.y, entity.position.z, reach)
                    try {
                        // if this fails, then it throws an exception
                        await this.#bot.pathfinder.goto(moveGoal)
                        await this.followEntity(entity, {reach: reach})
                        await this.waitForWeaponCoolDown()
                        // TODO: Verify if the target can be attacked melee (flying creatures can't be)
                        let attackItem = options.attackItem || this.bestAttackItemMelee()
                        if (attackItem) {
                            // TODO: Check enchants or exact instance id of the item instead of name
                            if (!this.#bot.heldItem || attackItem.name !== this.#bot.heldItem.name) {
                                this.#log(`Equipping attack weapon: ${attackItem.name}`)
                                await this.#bot.equip(attackItem, 'hand');
                            }
                        }
                        this.#logDebug(`Attacking entity: ${entity.username || entity.name} using weapon: ${attackItem?.name}`)
                        this.lastAttackTime = Date.now()
                        this.lastAttackItem = attackItem
                        this.#bot.attack(entity)
                        return true
                    } catch (ex) {
                        this.#logDebug(`Failed to get near enough to entity to attack`);
                    }
                }
            } catch (ex) {
                this.#logWarn(`Error trying to attack entity: ${entity.username || entity.name}`, ex)
            }
        }
        return false
    }

    /**
     * <i><b>Experimental</b></i>
     *
     * This uses lastAttackTime,lastAttackItem variables to manage weapon attack cool-downs.
     * This assumes that the weapon you just attacked with needs to cool-down before you can attack again,
     * even if that next attack is with a different weapon.
     *
     * Note: This currently only handles melee weapons
     *
     * @returns {Promise<void>}
     */
    async waitForWeaponCoolDown() {
        const attackItem = this.lastAttackItem
        let ticksSinceAttack = (Date.now()-this.lastAttackTime)/(1000*0.05)
        let weaponTicks = 5 // wait 0.25 sec for attacking with anything else in your hand
        if (attackItem) {
            let itemName = attackItem.name.toLowerCase()
            if (itemName.includes("sword")) {
                // wait 0.6 second between attacks for swords for 100% damage
                weaponTicks = 12
            } else if (itemName.includes("trident")) {
                weaponTicks = 18 // wait 0.9 second between attacks for tridents for 100% damage
            } else if (itemName.endsWith("_axe")) {
                //axes speed actually varies by type...
                if (itemName.startsWith("wooden") || itemName.startsWith("stone")) {
                    weaponTicks = 25 // wait 1.25 second between attacks for wooden/stone axe for 100% damage
                } else if (itemName.startsWith("iron")) {
                    weaponTicks = 22 // wait 1.1 second between attacks for iron axe for 100% damage
                } else {
                    weaponTicks = 20 // wait 1 second between attacks for gold/diamond/netherite axe for 100% damage
                }
            } else if (itemName.endsWith("_pickaxe")) {
                weaponTicks = 17 // wait 0.85 second between attacks for pickaxe for 100% damage
            }
        }
        // MUST be a whole number
        let ticksToWait = Math.round(Math.max(0, weaponTicks-ticksSinceAttack))
        if (ticksToWait > 0){
            this.#logDebug(`Waiting ${ticksToWait} ticks for weapon cool down...`)
            await this.wait(ticksToWait)
        }
    }

    /**
     * Moves the bot to at least the specified distance away from the position indicated.
     * This draws a vector on the XZ plane from the position through the player and finds
     * the point at the specified distance.  The bot will move to that point unless it is
     * already further away than the distance.
     *
     * @param {Vec3} position
     * @param {number} distance
     * @returns {Promise<boolean>}
     */
    async moveAwayFrom(position, distance) {
        let positionXZ = new Vec3(position.x, 0, position.z)
        const myEntity = this.#bot.entity
        let botPositionXZ = new Vec3(myEntity.position.x,0, myEntity.position.z)
        if (botPositionXZ.xzDistanceTo(positionXZ) < distance) {
            let newPosition = positionXZ.plus(botPositionXZ.minus(positionXZ).normalize().scale(distance))
            return await this.handlePath(async () => {
                await this.#bot.pathfinder.goto(new GoalXZ(newPosition.x, newPosition.z));
            });
        }
        // was already outside that range
        return true;
    }

    /**
     * Choose a random point within a minimum and maximum radius around the Bot and approach it.
     * Points are calculated on the X and Z axes.
     * @param {number} minDistance=10 The minimum distance the point may be from the Bot
     * @param {number} maxDistance=10 The maximum distance the point may be from the Bot
     * @returns {Promise<boolean>} true if the Bot successfully reached its wander goal, else false
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
        let newX = this.position().x + xRange;
        let newZ = this.position().z + zRange;

        const pathFunc = async () => {
            await this.#bot.pathfinder.goto(new GoalXZ(newX, newZ));
        };
        return await this.handlePath(pathFunc);
    }

    /**
     * Attempt to locate the nearest block of the given type within a specified range from the Bot.
     * @param blockType {string} The displayName or name of the block to find
     * @param {object} [options={}] Optional parameters
     * @param {boolean} [options.partialMatch=false] Find blocks whose name / displayName contains blockType. (Ex. 'log' may find any of 'spruce_log', 'oak_log', etc.)
     * @param {boolean} [options.onlyFindTopBlocks=false] Will not return any blocks that are beneath another block
     * @param {number} [options.maxDistance=50] Find any Blocks matching the search criteria up to and including this distance from the Bot
     * @param {boolean} [options.skipClosest=false] Will attempt to locate the next-closest Block. This can be used to skip the closest Block when the Bot encounters an issue collecting it
     * @returns {Block | null}
     *
     * @deprecated Since 1.2.0, please use findBlocks(options, blockValueFunction, sortValueFunction)
     */
    findBlock(blockType, options = {}) {
        this.#logWarn(`findBlock(blockType, options): Deprecated since 1.2.0, please use findBlocks(options, blockValueFunction, sortValueFunction)`)
        options['blockNames'] = blockType && [blockType] || [];
        return this.findBlocks(options).shift()?.result
    }

    /**
     * Returns the best block that is diggable within a maximum distance from the Bot.
     * @param {object} [options] - optional parameters
     * @param {string[]} [options.blockNames=[]] List of blockNames to consider
     * @param {boolean} [options.partialMatch=false] Consider blocks whose name partially matches one of the blockNames
     * @param {boolean} [options.onlyFindTopBlocks=false] Only find blocks that don't have a block above them.
     * @param {number} [options.maxDistance=50] Max range to consider
     * @param {number} [options.maxCount=1] Max count of matching blocks
     * @param {function(blockName:string):number} [blockValueFunction] - function to call to get the value of a block based on its name (blockName); should return the best block with the lowest sorting value. A good example function is { return scoreValueOf[blockName] }, where scoreValueOf is the point value or intrinsic value of the block in the game mode being played.  If you don't want a block considered, return a value < 0 for its value.
     * @param {function(pointValue:number,distance:number,digTime:number):number} [sortValueFunction] - function to call to sort the evaluation of results based on arguments (pointValue, distance, digTime[seconds]); should return the best item with the lowest sorting value.
     * @returns {FindResult[]} - the best blocks found
     *
     * By default, this only sorts results by distance, and assigns all blocks a value of 0.  A good example function is {return -1 * (pointValue - distance - digTime)}
     *
     * To get the 'best' block result, call findBlocks(...).shift().  Note that the result may be null|undefined if no blocks were found
     */
    findBlocks(options = {}, blockValueFunction = (blockName) => {return 0}, sortValueFunction = (pointValue, distance, digTime) => {return distance}) {
        const blockNames = options.blockNames || [];
        const partialMatch = options.partialMatch || false;
        const onlyFindTopBlocks = options.onlyFindTopBlocks || false;
        const maxDistance = options.maxDistance || 50;
        const maxCount = options.maxCount || 1;

        this.#logDebug(`Detecting up to ${maxCount} items to dig within a max distance of ${maxDistance}`);
        /**
         * @type {Object.<string,Object.<string,BestHarvestTool|number>>}
         */
        const blockDataMap = {}

        /**
         * @type {Block[]}
         */
        let candidateBlocks = []

        const botPosition = this.position()

        let candidateBlockPositions = this.#bot.findBlocks({
            point: botPosition, // from the bots current position
            maxDistance: maxDistance, // find blocks within range
            // this 10 looks odd, but has a purpose..
            count: Math.min(10, 10 + maxCount),
            matching: (block) => {
                const blockName = block.name
                if (!blockNames || blockNames.length === 0 || (blockNames.includes(blockName)) || (partialMatch && blockNames.find(bn => bn.includes(blockName)))) {
                    let blockDataForName = blockDataMap[blockName]
                    if (!blockDataForName) {
                        let canUseBlock = true;
                        if (onlyFindTopBlocks) {
                            const blockAbove = this.#bot.blockAt(block.position.offset(0, 1, 0));
                            canUseBlock = !blockAbove || blockAbove.type === 0
                        }
                        if (canUseBlock) {
                            const bestTool = this.bestHarvestTool(block)
                            if (bestTool.digTime < Infinity) {
                                blockDataForName = {
                                    "value": blockValueFunction(blockName),
                                    "tool": bestTool
                                }
                                blockDataMap[blockName] = blockDataForName
                            }
                        }
                    }
                    return blockDataForName && blockDataForName["value"] >= 0;
                }
            }
        });

        for (let position of candidateBlockPositions) {
            candidateBlocks.push(this.#bot.blockAt(position))
        }

        this.#logDebug(`Detected ${Math.min(candidateBlocks.length, maxCount)} useful items to dig in range`)

        let result = candidateBlocks.map(pt => {
            const distance = this.position().distanceTo(pt.position)
            let blockData = blockDataMap[pt.name]
            const sortValue = sortValueFunction(blockData["value"], distance, blockData["tool"].digTime )
            return new FindResult(pt, sortValue)
        }).sort((a,b) => a.value - b.value)
        result.length = Math.min(result.length, maxCount || result.length)
        return result
    }

    /**
     * The Bot will approach and stand within reach of the given Block.
     * @param {Block} block The Block instance to approach
     * @param {object} [options={}] Optional parameters
     * @param {number} [options.reach=5]
     * @returns {Promise<boolean>} true if pathing was successfully completed or false if pathing could not be completed
     */
    async approachBlock(block, options = {}) {
        const reach = options.reach || 5;
        try {
            const rangeToBlock = this.position().distanceTo(block.position)
            this.#logDebug(`Approaching ${this.getEntityDisplayName(block)} from range: ${rangeToBlock}`);
            return await this.handlePath(async () => {
                await this.#bot.pathfinder.goto(new GoalLookAtBlock(block.position, this.#bot.world, {reach: reach}))
            })
        } catch(err) {
            this.#logWarn('Error approaching block', err);
            return new Promise(resolve => resolve(false));
        }
    }

    /**
     * Move directly adjacent to a target Block and place another Block from the bot inventory against it.
     * @param {string} blockName The name of the Block to place. Must be available in the bot inventory
     * @param {Block} targetBlock The target Block to place the new Block on/against
     * @param {object} [options={}] Optional parameters
     * @param {Vec3} [options.faceVector=Vec3(0, 1, 0)] The face of the targetBlock to place the new block against (Ex. Vec3(0, 1, 0) represents the topmost face of the targetBlock)
     * @param {number} [options.reach=5] The Bot will stand within this reach of the targetBlock while placing the new Block
     * @returns {Promise<void>}
     */
    async placeBlock(blockName, targetBlock, options = {}) {
        const faceVector = options.faceVector || new Vec3(0, 1, 0);
        const reach = options.reach || 5;

        this.#logDebug(`Moving to position ${this.vecToString(targetBlock.position)} to place ${blockName}`);
        const pathFunc = async() => {
            await this.#bot.pathfinder.goto(new GoalPlaceBlock(targetBlock.position, this.#bot.world, { range: reach }));
        };

        if(await this.handlePath(pathFunc)) {
            await this.holdItem(blockName);
            if(targetBlock.type === this.mcData.blocksByName.grass.id) {
                // Mineflayer tells us that a grass_block sits just above (0, 1, 0) the dirt_block that it is a 'part' of.
                // Mineflayer bot.placeBlock checks the block above the targetBlock to determine whether our new Block exists after placement.
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
     * @param {Block} block A harvestable Block instance
     * @returns {Promise<Item | null>} The tool that was equipped or null if the Bot did not have the tool in its inventory
     */
    async equipBestHarvestTool(block) {
        const bestHarvestTool = this.#bot.pathfinder.bestHarvestTool(block);
        if (bestHarvestTool) {
            try {
                await this.#bot.equip(bestHarvestTool, 'hand');
                return this.#bot.heldItem;
            } catch (err) {
                this.#logWarn('Error trying to equip a better tool', err);
                return null;
            }
        }
    }

    /**
     * Finds the best harvest tool in the bot inventory for mining the specified block.
     * If we don't have the best tool, also checks if dig time is infinite because it can't be harvested without a tool
     *
     * @param block {Block}
     * @returns {BestHarvestTool}
     */
    bestHarvestTool(block) {
        const availableTools = this.#bot.inventory.items()
        const effects = this.#bot.entity.effects

        let fastest = Infinity
        let bestTool = null
        for (const tool of availableTools) {
            const enchants = (tool && tool.nbt) ? nbt.simplify(tool.nbt).Enchantments : []
            const digTime = block.digTime(tool ? tool.type : null, false, false, false, enchants, effects)
            if (digTime < fastest) {
                fastest = digTime
                bestTool = tool
            }
        }

        return new BestHarvestTool(bestTool, fastest)
    }

    /**
     * <i><b>Experimental</b></i>
     *
     * This finds the most powerful melee attack item in the bot inventory
     *
     * Note: Today this only prioritizes weapon type, but does not prioritize weapon rarity/enchantments/etc
     *
     * @returns {Item|undefined}
     */
    bestAttackItemMelee() {
        return this.#bot.inventory.items().filter((item) => {
            let itemName = item.name.toLowerCase()
            return itemName.includes("sword") || itemName.includes("trident") || itemName.endsWith("_axe") || itemName.endsWith("_pickaxe");
        }).sort((a, b) => {
            if (a.name.endsWith("_axe") && b.name.endsWith("_pickaxe")) {
                return -1
            } else if (a.name.includes("trident") && b.name.endsWith("axe")) {
                return -1
            } else if (a.name.includes("sword")) {
                return -1
            } else if (a.name === b.name) {
                return 0
            } else {
                return 1
            }
        }).shift()
    }

    /**
     * Dig the given Block.
     * This will equip the most appropriate tool in the bot inventory for this Block type.
     * @param {Block} block The Block instance to dig
     * @returns {Promise<boolean>} Whether the Block was successfully dug
     */
    async digBlock(block) {
        if (!block) {
            this.#logWarn(`digBlock: Block was null or undefined`);
        } else {
            const bestTool = this.bestHarvestTool(block);
            if (bestTool.digTime < Infinity) {
                try {
                    await this.#bot.equip(bestTool.tool, 'hand');
                    const checkForInfiniteDig = async (reason) => {
                        if (reason === 'block_updated' || reason === 'dig_error') {
                            // if Bot is still digging but the target block no longer exists then stop the Bot
                            if (this.#bot.pathfinder.isMining() && !this.#bot.targetDigBlock) {
                                this.#logDebug('Cancelling current dig because target block no longer exists.');
                                this.#bot.stopDigging();
                                try {
                                    this.#bot.pathfinder.setGoal(null);
                                    this.#bot.pathfinder.stop();
                                } catch (err) {
                                    this.#logDebug(`Caught expected goal changed error while stopping dig path`);
                                }
                            }
                        }
                    }
                    this.#bot.on('path_reset', checkForInfiniteDig);
                    this.#logDebug(`Digging ${this.getEntityName(block)}`);
                    await this.#bot.dig(block);
                    this.#bot.off('path_reset', checkForInfiniteDig);
                    return true
                } catch (ex) {
                    this.#logWarn(`Error trying to equip tool or dig block ${this.getEntityName(block)}`, ex)
                }
            } else {
                this.#log(`Cannot dig block ${this.getEntityName(block)}, no capable tool`)
            }
        }
        return false
    }

    /**
     * Locate and dig the closest Block of a given type within a maximum distance from the Bot.
     * This method will equip the most appropriate tool in the bot inventory for this Block type.
     * @param {string} blockType The name of the Block to find and dig
     * @param {object} [options={}] Optional parameters
     * @param {boolean} [options.partialMatch=false] Find blocks whose name / displayName contains blockType. (Ex. 'log' may find any of 'spruce_log', 'oak_log', etc.)
     * @param {boolean} [options.onlyFindTopBlocks=false] Will not attempt to dig any Blocks that are beneath another Block
     * @param {number} [options.maxDistance=50] Find any Blocks matching the search criteria up to and including this distance from the Bot
     * @param {boolean} [options.skipCollection=false] If true, the Bot will not explicitly attempt to collect drops from the broken Block. This allows the player to control which drops are collected and which ones are ignored
     * @param {boolean} [options.skipClosest=false] Will attempt to locate the next-closest Block. This can be used to skip the closest Block when the Bot encounters an issue collecting it
     * @returns {Promise<boolean>} true if a Block was found and dug successfully or false if a Block was not found or if digging was interrupted
     *
     * @deprecated Since 1.2.0, Collection should be a separate bot action/choice from digging. please use the example for new code
     * @example Deprecation
     *         let candidateBlock = bot.findBlocks({blockNames: ['name1',...], maxDistance: maxDistance}, blockPointValueFunction, digCostFunction).shift()?.result
     *         if (candidateBlock) {
     *             if (await bot.approachAndDigBlock(candidateBlock)) {
     *                 // you can collect the item here, but ideally you would let the collection decision be part of your main loop next pass
     *                 // optionally wait a few ticks for the item to spawn, but that is wasting time that could be used making another action/decision
     *                 const theItem = this.findItemsOnGroundv2({itemNames: ['name1',...], maxDistance: 5}).shift()?.result
     *                 if (theItem) {
     *                     return await this.collectItemOnGround(theItem)
     *                 }
     *             }
     *         }
     */
    async findAndDigBlock(blockType, options = {}) {
        const skipCollection = options.skipCollection || false
        const maxDistance = options.maxDistance || 50
        this.#logWarn(`findAndDigBlock(blockType, options): Deprecated since 1.2.0, please see doc example for new code`)
        let candidateBlock = this.findBlocks({blockNames: [blockType], maxDistance: maxDistance}).shift()?.result
        if (candidateBlock) {
            if (await this.approachAndDigBlock(candidateBlock)) {
                // you can collect the item here, or preferably, you can let collection be part of your main loop next pass decision process
                if (!skipCollection) {
                    await this.wait(5) // wait a few ticks for the item to spawn
                    const theItem = this.findItemsOnGroundv2({itemNames: [blockType], maxDistance: 5}).shift()?.result
                    if (theItem) {
                        await this.collectItemOnGround(theItem)
                    }
                }
                return true
            }
        }
        return false
    }

    /**
     * Approach (path-find to) and dig the specified block.
     * @param {Block} block
     * @returns {Promise<boolean>}
     */
    async approachAndDigBlock(block) {
        try {
            if (await this.approachBlock(block)) {
                return await this.digBlock(block);
            }
        } catch (err) {
            this.#logWarn(`Error approaching and digging block, error: ${err}`)
        }
        return false
    }

    /**
     * Locate the closest Item with the given name within a maximum distance from the Bot, or null if no matching Items are found.
     * @param {string} itemName
     * @param {object} [options={}] Optional parameters
     * @param {boolean} [options.partialMatch=false] Locate any items whose name / displayName contains itemName. (Ex. 'wooden_axe', 'stone_axe', 'diamond_axe', etc. will all satisfy itemName 'axe')
     * @param {number} [options.maxDistance=30] Find any Items matching the search criteria up to and including this distance from the Bot
     * @returns {Item | null}
     *
     * @deprecated Since 1.2.0, please use findItems(options, itemValueFunction, sortValueFunction)
     */
    findItemOnGround(itemName, options = {}) {
        this.#logWarn(`findItemOnGround(itemName, options): Deprecated since 1.2.0, please use findItems(options, itemValueFunction, sortValueFunction)`)
        options['itemNames'] = itemName && [itemName] || [];
        return this.findItemsOnGroundv2(options).shift()?.result
    }

    /**
     * Returns a list of all Items that are on the ground within a maximum distance from the Bot (can be empty).
     * @param {object} [options={}] Optional parameters
     * @param {string} [options.itemName=undefined] Find only Items with this name
     * @param {boolean} [options.partialMatch=false] If itemName is defined, find Items whose names / displayNames contain itemName. (Ex. 'boots' may find any of 'iron_boots', 'golden_boots', etc.)
     * @param {number} [options.maxDistance=50] Find any Items matching the search criteria up to and including this distance from the Bot
     * @returns {Item[]} The list of Items found on the ground (can be empty)
     *
     * @deprecated Since 1.2.0, please use findItems(options, itemValueFunction, sortValueFunction)
     */
    findItemsOnGround(options = {}) {
        this.#logWarn(`findItemsOnGround(options): Deprecated since 1.2.0, please use findItems(options, itemValueFunction, sortValueFunction)`)
        options['itemNames'] = options.itemName && [options.itemName] || [];
        return this.findItemsOnGroundv2(options).shift()?.result
    }

    /**
     * Returns a list of all Items that are on the ground within a maximum distance from the Bot (can be empty).
     * @param {object} [options] - optional parameters
     * @param {string[]} [options.itemNames=[]] Find only Items matching one of these names
     * @param {boolean} [options.partialMatch=false] If itemName is defined, find Items whose names / displayNames contain itemName. (Ex. '_boots' may find any of 'iron_boots', 'golden_boots', etc.)
     * @param {number} [options.maxDistance=50] - find any Items matching the search criteria up to and including this distance from the Bot
     * @param {number} [options.maxCount=1] - limit the number of items to find
     * @param {function(blockName:string):number} [itemValueFunction] - function to call to get the value of an item based on its name (itemName); should return the best item with the lowest sorting value. A good example function is { return scoreValueOf[itemName] }, where scoreValueOf is the point value or intrinsic value of the item in the game mode being played.  If you don't want an item considered, return a value < 0 for its value.
     * @param {function(pointValue:number,distance:number):number} [sortValueFunction] - function to call to sort the evaluation of results based on arguments (pointValue, distance); should return the best item with the lowest sorting value.  A good example function is {return -1 * (pointValue*2 - distance*1.1)}
     *
     * @returns {FindResult[]} - the best items found
     *
     * By default, this only sorts results by distance, and assigns all items a pointValue of 0, but a good example function for considering pointValue would be {return -1 * (pointValue*2 - distance*1.1)) }
     *
     * To get the 'best' item to collect, call findItems(...).shift().  Note that the result may be null|undefined if no items were found
     */
    findItemsOnGroundv2(options = {}, itemValueFunction = (itemName) => {return 0}, sortValueFunction = (pointValue,distance) => {return distance}) {
        const itemNames = options.itemNames || [];
        const maxDistance = options.maxDistance || 50;
        const maxCount = options.maxCount || 1
        const partialMatch = options.partialMatch || false
        this.#logDebug(`Detecting all useful items on the ground within a max distance of ${maxDistance}`);
        /**
         * @type {Object.<string,number>}
         */
        const itemDataMap = {}
        /**
         * @type {Object.<number,number>}
         */
        const distances = {}

        /**
         * @type Vec3
         */
        const botPosition = this.position()

        // this.#bot.entities is a map of entityId : entity
        let result = Object.values(this.#bot.entities).filter((entity) => {
            if (entity.objectType === "Item" && entity.onGround && entity?.metadata?.length > 8) {
                const distance = botPosition.distanceTo(entity.position)
                if (distance <= maxDistance) {
                    const itemEntity = this.getItemDefinitionById(entity.metadata[8]?.itemId);
                    distances[itemEntity.id] = distance
                    const itemName = itemEntity.name
                    if(!itemNames || itemNames.length === 0 || itemNames.find(targetName => targetName === itemName || (partialMatch && itemName.includes(targetName)))) {
                        let usefulItemsForName = itemDataMap[itemName]
                        if (!usefulItemsForName) {
                            usefulItemsForName = itemValueFunction(itemName)
                            itemDataMap[itemName] = usefulItemsForName
                        }
                        if (usefulItemsForName >= 0) {
                            return true
                        }
                    }
                }
            }
            return false
        }).map(pt => {
            const itemName = pt.username || pt?.metadata?.length > 8 && this.getItemDefinitionById(pt.metadata[8]?.itemId)?.name || pt.name
            let distance = distances[pt.id]
            if (!distance) {
                distance = this.position().distanceTo(pt.position)
                distances[pt.id] = distance
            }
            const value = itemDataMap[itemName]
            const sortValue = sortValueFunction(value, distance)
            return new FindResult(pt, sortValue)
        }).sort((a, b) => {
            return a.value-b.value
        });

        this.#logDebug(`Detected ${result.length} useful items to collect in range`)

        result.length = Math.min(result.length, maxCount || result.length)

        return result
    }

    /**
     * Collects the item from the ground if it exists and is on the ground.
     *
     * @param {Entity} item
     * @returns {Promise<boolean>} True if an item was collected
     */
    async collectItemOnGround(item) {
        let result = false;
        if (item && item.objectType === "Item" && item.onGround) {
            const collectFunction = async (collector, collected) => {
                if (collector.username === this.username()) {
                    this.#logDebug(`I collected: ${collected.username || collected?.metadata?.length > 8 && this.getItemDefinitionById(collected?.metadata[8]?.itemId)?.name || collected.name}`);
                    result = true
                }
            }

            // Use collection events to track pickups
            this.#bot.on('playerCollect', collectFunction);
            try {
                await this.approachEntity(item)
            } catch (ex) {
                console.warn(`Failed to approach item, error: ${ex}`)
                // we failed to approach something on the ground... if we don't catch this
                // we'll get stuck trying to pick up this item we can't pick up forever
            }
            this.#bot.off('playerCollect', collectFunction);
        } else {
            this.#log(`Unable to collect item: ${item && item.name || "null"}.  Not an 'Item' or not on the ground.`)
        }
        return result
    }

    /**
     * Collects all Items on the ground within a maximum distance from the Bot.
     * @param {object} [options={}] Optional parameters
     * @param {string} [options.itemNames=[]] Find and collect only Items with this name
     * @param {boolean} [options.partialMatch=false] If itemNames is defined, find Items whose names / displayNames contain itemName. (Ex. '_boots' may find any of 'iron_boots', 'golden_boots', etc.).
     * @param {number} [options.maxDistance=50] Find and collect any Items matching the search criteria up to and including this distance from the Bot
     * @returns {Promise<Item[]>} A list of Item definitions for each Item collected from the ground (can be empty)
     */
    async findAndCollectItemsOnGround(options = {}) {
        const itemNames = options.itemNames && options.itemNames || [];
        const partialMatch = options.partialMatch || false;
        const maxDistance = options.maxDistance || 50;
        this.#logDebug(`Collecting all items on the ground within a range of ${maxDistance}`);

        const result = [];

        const collectFunction = async (collector, collected) => {
            if (collector.username === this.username()) {
                this.#logDebug(`I collected: ${collected.username || collected?.metadata?.length > 8 && this.getItemDefinitionById(collected?.metadata[8]?.itemId)?.name || collected.name}`);
                result.push(collected)
            }
        }

        // Use collection events to track pickups
        this.#bot.on('playerCollect', collectFunction);
        let itemToCollect = this.findItemsOnGroundv2({itemNames: itemNames, maxDistance: maxDistance, partialMatch: partialMatch}).shift()?.result
        while (itemToCollect) {
            try {
                await this.approachEntity(itemToCollect)
            } catch (ex) {
                console.warn(`Failed to approach item, error: ${ex}`)
                // we failed to approach something on the ground... if we don't catch this
                // we'll get stuck trying to pick up this item we can't pick up forever
            }
            // find the next item to get
            itemToCollect = this.findItemsOnGroundv2({itemNames: itemNames, maxDistance: maxDistance, partialMatch: partialMatch}).shift()?.result
        }
        this.#bot.off('playerCollect', collectFunction);

        return result;
    }

    /**
     * Returns true if the Bot has one or more of a specified Item in its inventory, or false if it does not.
     * @param {string} itemName
     * @param {object} [options={}] Optional parameters
     * @param {boolean} [options.partialMatch=false] Check for any items whose name / displayName contains itemName. (Ex. 'wooden_axe', 'stone_axe', 'diamond_axe', etc. will all satisfy itemName 'axe')
     * @param {number} [options.quantity=1] The minimum amount of this Item the Bot must have
     * @returns {boolean}
     */
    inventoryContainsItem(itemName, options = {}) {
        const partialMatch = options.partialMatch || false;
        const quantity = options.quantity || 1;
        if (quantity < 1) {
            this.#logWarn(`inventoryContainsItem: invalid quantity ${quantity}`);
            return false;
        }
        return this.getInventoryItemQuantity(itemName, {partialMatch}) >= quantity;
    }

    /**
     * Return how many of a specific item the Bot currently holds in its inventory.
     * @param {string} itemName
     * @param {object} [options={}] Optional parameters
     * @param {boolean} [options.partialMatch=false] Count any items whose name / displayName contains itemName. (Ex. 'wooden_axe', 'stone_axe', 'diamond_axe', etc. will all be included in the quantity for itemName 'axe').
     * @returns {int}
     */
    getInventoryItemQuantity(itemName, options = {}) {
        const partialMatch = options.partialMatch || false;
        let quantityAvailable = 0;
        this.getAllInventoryItems().filter((item) => {
            if (this.entityNamesMatch(itemName, item, { partialMatch })) {
                quantityAvailable += item.count;
                return true;
            }
            return false;
        });
        return quantityAvailable;
    }

    /**
     * Drop an inventory Item on the ground.
     * @param {string} itemName
     * @param {object} [options={}] Optional parameters
     * @param {boolean} [options.partialMatch=false] Drop items whose name / displayName contains itemName. (Ex. itemName 'stone' will drop 'stone', 'stone_axe', 'stone_sword', etc.)
     * @param {number} [options.quantity=1] The quantity of this Item to drop. To drop all, pass some number <0, or call `dropAllInventoryItem` instead
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
            let quantityToDrop = ( !quantity || quantity < 0 ? quantityAvailable : quantity);
            this.#logDebug(`Dropping ${quantityToDrop} of ${itemName}`);
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
                this.#logWarn(`Error while dropping ${itemName} from inventory`, err)
            }
        }
        else {
            this.#logDebug(`dropInventoryItem: No ${itemName} in inventory to drop`)
        }
    }

    /**
     * Returns true if all inventory slots are occupied.  This does not necessarily mean it is completely/totally full,
     * but it means you would need to stack items of the same type to fit anything else in the inventory.
     * @returns {boolean}
     */
    isInventoryFull() {
        return !this.#bot.inventory.firstEmptyInventorySlot()
    }

    /**
     * Get all items in the bot inventory.
     *
     * @returns {Item[]}
     */
    getAllInventoryItems() {
        return this.#bot.inventory.items()
    }

    /**
     * Drops all stacks of an Item in the bot inventory matching itemName.
     * Alias for `dropInventoryItem(itemName, {quantity: -1})`
     * @param {string} itemName The name or display name of the Item(s) to drop
     * @param {object} options={} Optional parameters
     * @param {object} [options={}] Optional parameters
     * @param {string[]} [options.itemNames=undefined] The name or display name of the Item(s) to drop, if undefined, all items will be dropped.
     * @param {boolean} [options.partialMatch=false] Drop items whose name / displayName contains itemName. (Ex. itemName 'stone' will drop 'stone', 'stone_axe', 'stone_sword', etc.)
     * @returns {Promise<void>}
     *
     * @deprecated Since 1.2.0, please use dropAllInventoryItems(options)
     */
    async dropAllInventoryItem(itemName, options = {}) {
        this.#logWarn(`dropAllInventoryItem(itemName, options): Deprecated since 1.2.0, please use dropAllInventoryItems(options)`)
        options['itemNames'] = itemName && [itemName] || undefined;
        return await this.dropAllInventoryItems(options)
    }

    /**
     * Drops all stacks of an Item in the bot inventory matching itemName.
     * Alias for `dropInventoryItem(itemName, {quantity: -1})`
     * @param {object} [options={}] Optional parameters
     * @param {string[]} [options.itemNames=undefined] The name or display name of the Item(s) to drop, if undefined, all items will be dropped.
     * @param {boolean} [options.partialMatch=false] Drop items whose name / displayName contains itemName. (Ex. itemName 'stone' will drop 'stone', 'stone_axe', 'stone_sword', etc.)
     * @returns {Promise<void>}
     */
    async dropAllInventoryItems(options = {}) {
        const partialMatch = options.partialMatch || false;
        const itemNames = options.itemNames || this.#bot.inventory.items().map(item => item.name)
        for (const itemName of itemNames) {
            await this.dropInventoryItem(itemName, {quantity: -1, partialMatch});
        }
    }

    /**
     * Craft an Item. The Bot must have enough materials to make at least one of these Items, or else recipe lookup will fail.
     * If the recipe requires a crafting station, then a craftingTable entity is required for success.  The craftingTable entity must be in reach of the bot via approachEntity.  This function does NOT approach the craftingTable.
     * @param {string} itemName The Item to craft
     * @param {object} [options={}] Optional parameters
     * @param {number} [options.quantity=1] The number of times to craft this Item. Note that this is NOT the total quantity that should be crafted (Ex. `craftItem('stick', {quantity:4})` will result in 16 sticks rather than 4)
     * @param {Block} [options.craftingTable=undefined] For recipes that require a crafting table/station. A Block Entity representing the appropriate station within reach of the Bot
     * @returns {Promise<Item | null>} The crafted Item or null if crafting failed
     */
    async craftItem(itemName, options = {}) {
        const quantity = options.quantity || 1;
        const craftingTable = options.craftingTable || undefined;

        try {
            this.isCrafting = true;
            let result = null;
            const itemId = (this.getItemDefinitionByName(itemName)).id;
            const recipes = this.#bot.recipesFor(itemId, null, null, (!!craftingTable ? craftingTable : null));
            if (recipes.length === 0) {
                this.#log(`Failed to create ${itemName}. Either the item is not valid, or the bot does not possess the required materials to craft it.`);
            } else {
                try {
                    await this.#bot.craft(recipes[0], quantity, craftingTable);
                    result = this.#bot.inventory.findInventoryItem(itemId, null, false);
                    this.#logDebug(`Crafted ${quantity} of ${itemName}`);
                } catch (err) {
                    this.#logWarn(`Error trying to craft ${itemName}: ${err}`);
                }
            }
            return result;
        } finally {
            this.isCrafting = false;
        }
    }

    /**
     * Equips an Item to the hand. The Bot must have the Item in its inventory to hold it.
     * @param {string} itemName
     * @returns {Promise<Item | null>} The held Item or null if the Bot was unable to equip the Item
     */
    async holdItem(itemName) {
        const item = this.getItemDefinitionByName(itemName);
        if (item && this.inventoryContainsItem(itemName)) {
            this.#logDebug(`Holding ${itemName}`);
            await this.#bot.equip(item.id, 'hand');
            return this.#bot.heldItem;
        }
        else {
            this.#log(`Equip failed: inventory does not contain ${itemName}`);
            return null;
        }
    }

    /**
     * Returns the contents of an open container.
     * If multiple stacks of the same Item are present in the container, they will not be collapsed in the result.
     * @param {Window} containerWindow The open container Window to withdraw items from
     * @returns {Item[]} The list of Items present in the container (can be empty)
     */
    getContainerContents(containerWindow) {
        let result = [];
        if (!containerWindow) {
            this.#logWarn(`getContainerContents: containerEntity was null or undefined`);
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
     * Opens a container, then perform the supplied useFunction before closing the container.
     * This function does NOT approach the container.  It must already be in reach of the bot
     *
     * @param {Block} containerBlock
     * @param {object} [options={}]
     * @param {function(openContainer:Window,options:object):Promise<boolean>} useContainerFunction
     * @returns {Promise<boolean>}
     */
    async openAndUseContainer( containerBlock, options={}, useContainerFunction= async (openContainer, options) => {}) {
        try {
            this.isLookingInContainer = true
            let openChest = await this.#bot.openChest(containerBlock)
            if (openChest) {
                return await useContainerFunction(openChest, options)
            }
        } catch (ex) {
            this.#logWarn("openAndUseContainer: Error opening or using container", ex)
        } finally {
            this.isLookingInContainer = false
        }
        return false
    }

    /**
     * Withdraws one or more items from a container.
     * @param {Window} containerWindow The open container Window to withdraw items from
     * @param {object} [options={}] Optional parameters
     * @param {string} [options.itemName=undefined] An Item to withdraw from the container. If not specified, will withdraw all Items
     * @param {boolean} [options.partialMatch=false] Allow partial matches to itemName. For example, 'planks' will match any Item containing 'planks' in its name ('spruce_planks', 'oak_planks', etc.)
     * @param {number} [options.quantity=undefined] If itemName is specified, withdraw up to this quantity
     * @returns {Promise<void>}
     *
     * @deprecated Since 1.2.0, RGBot now manages state while using a container/chest as documented on field isLookingInContainer, please use openAndUseContainer(options, withdrawItemsFromContainer)
     */
    async withdrawItems(containerWindow, options = {}) {
        this.#logWarn(`withdrawItems(containerWindow, options): deprecated Since 1.2.0, RGBot now manages state while using a container/chest as documented on field isLookingInContainer, please use openAndUseContainer(options, withdrawItemsFromContainer)`)
        options['itemNames'] = options.itemName && [options.itemName] || []
        await this.withdrawItemsFromContainer(containerWindow, options)
    }

    /**
     * Should be passed as the `useContainerFunction` to openAndUseContainer.  Withdraws the specified items from the container.
     * @param {Window} openContainer The open container Window
     * @param {object} [options={}] Optional parameters
     * @param {string[]} [options.itemNames=[]] An Items to act on in the container.
     * @param {boolean} [options.partialMatch=false] Allow partial matches to itemNames. For example, '_planks' will match any Item containing '_planks' in its name ('spruce_planks', 'oak_planks', etc.)
     * @param {number} [options.quantity=undefined] Withdraw up to this quantity of each unique item name
     * @returns {Promise<boolean>}
     */
    async withdrawItemsFromContainer(openContainer, options={}) {
        const itemNames = options.itemNames || [];
        const partialMatch = options.partialMatch || false;
        const quantity = options.quantity || undefined;
        if(!openContainer) {
            this.#logWarn(`withdrawItemsFromContainer: openContainer was null or undefined`);
        } else if (!openContainer.slots) {
            this.#logDebug(`withdrawItemsFromContainer: openContainer is empty`);
        } else {
            /**
             * @type {Object.<string,number>}
             */
            const quantityCollectedMap = {}

            // The first 27 slots in this window should belong to the container.
            // The following 27 slots are the bot inventory, and the last 9 are the bot hot-bar.
            // TODO: What about 'large' containers ?
            for (let i = 0; i < 27; i++) {
                const slot = openContainer.slots[i];
                if (slot && (!itemNames || itemNames.length === 0 || itemNames.find(itemName => itemName === slot.name || (partialMatch && slot.name.includes(itemName))))) {
                    let quantityCollected = quantityCollectedMap[slot.name] || 0
                    if (quantity === undefined) {
                        // if no quantity specified, grab the entire stack
                        await openContainer.withdraw(slot.type, null, slot.count);
                        quantityCollected += slot.count;
                    } else {
                        // otherwise, figure out how many we still need to withdraw
                        // don't withdraw more than quantity
                        let amountToWithdraw = quantity - quantityCollected;
                        if (amountToWithdraw > 0) {
                            amountToWithdraw = slot.count > amountToWithdraw ? amountToWithdraw : slot.count;
                            await openContainer.withdraw(slot.type, null, amountToWithdraw);
                            quantityCollected += amountToWithdraw;
                        }
                    }
                    quantityCollectedMap[slot.name] = quantityCollected
                }
            }
            return Object.entries(quantityCollectedMap).find(q => q[1] > 0)?.value || false;
        }
        return false
    }

    /**
     * Deposits one or more items into a container.
     * @param {Window} containerWindow The open container Window to deposit items into
     * @param {object} [options={}] Optional parameters
     * @param {string} [options.itemName=undefined] An Item to deposit into the container. If not specified, will deposit all Items.
     * @param {boolean} [options.partialMatch=false] Allow partial matches to itemName. For example, 'planks' will match any Item containing 'planks' in its name ('spruce_planks', 'oak_planks', etc.).
     * @param {number} [options.quantity=undefined] If itemName is specified, deposit up to this quantity.
     * @returns {Promise<void>}
     *
     * @deprecated Since 1.2.0, RGBot now manages state while using a container/chest as documented on field isLookingInContainer, please use openAndUseContainer(options, depositItemsToContainer)
     */
    async depositItems(containerWindow, options = {}) {
        this.#logWarn(`depositItems(containerWindow, options): deprecated Since 1.2.0, RGBot now manages state while using a container/chest as documented on field isLookingInContainer, please use openAndUseContainer(options, depositItemsToContainer)`)
        options['itemNames'] = options.itemName && [options.itemName] || []
        await this.depositItemsToContainer(containerWindow, options)
    }

    /**
     * Should be passed as the `useContainerFunction` to openAndUseContainer.   Deposits one or more items into the container.
     * @param {Window} openContainer The open container Window
     * @param {object} [options={}] Optional parameters
     * @param {string} [options.itemNames=[]] The items to deposit into the container. If not specified, will deposit all Items.
     * @param {boolean} [options.partialMatch=false] Allow partial matches to itemNames. For example, '_planks' will match any Item containing '_planks' in its name ('spruce_planks', 'oak_planks', etc.).
     * @param {number} [options.quantity=undefined] If itemNames is specified, deposit up to this quantity of each itemName.
     * @returns {Promise<boolean>}
     */
    async depositItemsToContainer(openContainer, options = {}) {
        const itemNames = options.itemNames || [];
        const partialMatch = options.partialMatch || false;
        const quantity = options.quantity || undefined;

        if(!openContainer) {
            this.#logWarn(`depositItemsToContainer: openContainer was null or undefined`);
        } else {
            /**
             * @type {Object.<string,number>}
             */
            const quantityDepositedMap = {}

            // mineflayer has a known bug where the game updates inventory correctly
            // but mineflayer internal bot.inventory state is not updated when a Window is open... so we need to
            // iterate over the actual window slots - we CANNOT rely on bot.inventory for this.
            // The first 27 slots in this window should belong to the container.
            // The following 27 slots are the bot inventory, and the last 9 are the bot hot-bar.
            for (let i = 26; i < 63; i++) {
                const slot = openContainer.slots[i];
                if(slot && (!itemNames || itemNames.length === 0 || itemNames.find(itemName => itemName === slot.name || (partialMatch && slot.name.includes(itemName))))) {
                    let quantityDeposited = quantityDepositedMap[slot.name] || 0
                    if(quantity === undefined) {
                        // if no quantity specified, deposit the entire stack
                        await openContainer.deposit(slot.type, null, slot.count);
                        quantityDeposited += slot.count;
                    } else {
                        // otherwise, figure out how many we still need to deposit
                        // don't deposit more than quantity
                        let amountToDeposit = quantity - quantityDeposited;
                        if(amountToDeposit > 0) {
                            amountToDeposit = slot.count > amountToDeposit ? amountToDeposit : slot.count;
                            await openContainer.deposit(slot.type, null, amountToDeposit);
                            quantityDeposited += amountToDeposit;
                        }
                    }
                    quantityDepositedMap[slot.name] = quantityDeposited
                }
            }
            return Object.entries(quantityDepositedMap).find(q => q[1] > 0)?.value || false;
        }
        return false
    }

}

module.exports = RGBot