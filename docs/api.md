<a name="RGBot"></a>
## RGBot
> <h2><u>Glossary:</u></h2>
> 
>  <b><u>Mineflayer and Pathfinder</u></b><br>
>    Mineflayer is a high-level JavaScript API for creating Minecraft Bots.
>    Mineflayer supports third-party plugins like Pathfinder - an advanced Pathfinding library to help your Bot navigate the world.
>    Regression Games uses Mineflayer and Pathfinder to create a stable and user-friendly library. Create the best Bot you can with ease. <br>
>    <i>Mineflayer API documentation - https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md </i><br>
>    <i>Mineflayer Pathfinder API documentation - https://github.com/PrismarineJS/mineflayer-pathfinder/blob/master/readme.md </i><br>
> 
>  <b><u>Vec3</u></b><br>
>    Mineflayer indicates the position of an object as a point along 3 axes. These points are represented as Vec3 instances in the following format:
>      {x (south), y (up), z(west)} <br>
>    <i>Vec3 Documentation - https://github.com/PrismarineJS/node-vec3 </i><br>
> 
>  <b><u>Entity</u></b><br>
>    An Entity is anything that can be dynamically spawned into the Minecraft world.
>    Common Entities include other players, enemy mobs, items in your inventory or floating on the ground, and objects you can interact with such as minecarts or beds.
> 
>  <b><u>Block</u></b><br>
>    A Block is a specific type of Entity that exist in the environment.
>    Some yield materials when collected, like blocks of Coal or Diamond, while others can be interacted with like ladders and vines. <br>
> 
>  <b><u>Item</u></b><br>
>    An Item represents any Entity that can be collected in the player's inventory or hands.
>    These can be things like weapons and armor that the player equips, crafting materials, or items that can be placed to create a Block.
>    This last example brings up an important distinction to keep in mind while creating your Bot: an object is an Item when in the Bot's inventory or hand, or when it has been tossed on the ground, but it is a Block once it is placed in the world.
> 
>  <b><u>Name versus Display Name</u></b><br>
>    An Entity's name is a unique identifier, and its display name is typically the same or similar identifier but in a human-readable format.
>    As an example, the Ender Dragon is the readable name, or display name, of the Entity named ender_dragon. Likewise, Grass Block is the display name of the block named grass_block.
>    This library attempts to accept both the name and display name interchangeably wherever possible, so the identifier you use is up to your own personal tastes.


* [RGBot](#RGBot)
    * [.setDebug(debug)](#RGBot+setDebug) ⇒ <code>void</code>
    * [.mineflayer()](#RGBot+mineflayer) ⇒ <code>Bot</code>
    * [.on(event, func)](#RGBot+on) ⇒ <code>void</code>
    * [.allowParkour(allowParkour)](#RGBot+allowParkour) ⇒ <code>void</code>
    * [.allowDigWhilePathing(allowDig)](#RGBot+allowDigWhilePathing) ⇒ <code>void</code>
    * [.chat(message)](#RGBot+chat) ⇒ <code>void</code>
    * [.wait(ticks)](#RGBot+wait) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.vecToString(position)](#RGBot+vecToString) ⇒ <code>string</code>
    * [.vecFromString(positionString)](#RGBot+vecFromString) ⇒ <code>Vec3</code> \| <code>null</code>
    * [.getEntityName(entity)](#RGBot+getEntityName) ⇒ <code>string</code> \| <code>undefined</code>
    * [.getItemDefinitionByName(itemName)](#RGBot+getItemDefinitionByName) ⇒ <code>Item</code> \| <code>null</code>
    * [.getItemDefinitionById(itemId)](#RGBot+getItemDefinitionById) ⇒ <code>Item</code> \| <code>null</code>
    * [.entityNamesMatch(targetName, entity, options)](#RGBot+entityNamesMatch) ⇒ <code>boolean</code>
    * [.handlePath(pathFunc, options)](#RGBot+handlePath) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.findEntity(options)](#RGBot+findEntity) ⇒ <code>Entity</code> \| <code>null</code>
    * [.approachEntity(entity, options)](#RGBot+approachEntity) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.followEntity(entity, options)](#RGBot+followEntity) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.avoidEntity(entity, options)](#RGBot+avoidEntity) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.attackEntity(entity)](#RGBot+attackEntity) ⇒ <code>void</code>
    * [.wander(minDistance, maxDistance)](#RGBot+wander) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.findBlock(blockType, options)](#RGBot+findBlock) ⇒ <code>Block</code> \| <code>null</code>
    * [.approachBlock(block, options)](#RGBot+approachBlock) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.placeBlock(blockName, targetBlock, options)](#RGBot+placeBlock) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.equipBestHarvestTool(block)](#RGBot+equipBestHarvestTool) ⇒ <code>Promise.&lt;(Item\|null)&gt;</code>
    * [.digBlock(block)](#RGBot+digBlock) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.findAndDigBlock(blockType, options)](#RGBot+findAndDigBlock) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.findItemOnGround(itemName, options)](#RGBot+findItemOnGround) ⇒ <code>Item</code> \| <code>null</code>
    * [.findItemsOnGround(options)](#RGBot+findItemsOnGround) ⇒ <code>Array.&lt;Item&gt;</code>
    * [.findAndCollectItemsOnGround(options)](#RGBot+findAndCollectItemsOnGround) ⇒ <code>Promise.&lt;Array.&lt;Item&gt;&gt;</code>
    * [.inventoryContainsItem(itemName, options)](#RGBot+inventoryContainsItem) ⇒ <code>boolean</code>
    * [.getInventoryItemQuantity(itemName, options)](#RGBot+getInventoryItemQuantity) ⇒ <code>int</code>
    * [.dropInventoryItem(itemName, options)](#RGBot+dropInventoryItem) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.dropAllInventoryItem(itemName, options)](#RGBot+dropAllInventoryItem) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.craftItem(itemName, options)](#RGBot+craftItem) ⇒ <code>Promise.&lt;(Item\|null)&gt;</code>
    * [.holdItem(itemName)](#RGBot+holdItem) ⇒ <code>Promise.&lt;(Item\|null)&gt;</code>
    * [.getContainerContents(containerWindow)](#RGBot+getContainerContents) ⇒ <code>Array.&lt;Item&gt;</code>
    * [.withdrawItems(containerWindow, options)](#RGBot+withdrawItems) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.depositItems(containerWindow, options)](#RGBot+depositItems) ⇒ <code>Promise.&lt;void&gt;</code>


<br><a name="RGBot+setDebug"></a>

### rgBot.setDebug(debug) ⇒ <code>void</code>
> Enable or disable debug logs.


| Param | Type |
| --- | --- |
| debug | <code>boolean</code> | 


<br><a name="RGBot+mineflayer"></a>

### rgBot.mineflayer() ⇒ <code>Bot</code>
> Returns the mineflayer Bot instance controlled by the RGBot. Use this to interact with mineflayer's API directly.

**Returns**: <code>Bot</code> - The mineflayer Bot instance controlled by the RGBot  
**See**: [MineFlayer API](https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md)  
**Example** *(Accessing mineflayer API through mineflayer())*  
```js
// returns the bot's username from mineflayer
rgBot.mineflayer().username
```

<br><a name="RGBot+on"></a>

### rgBot.on(event, func) ⇒ <code>void</code>
> Listen for an event and invoke a function when it fires.


| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event to listen for |
| func | <code>function</code> | Function that is invoked when event fires |

**Example** *(Reacting to the spawn event)*  
```js
rgBot.on('spawn', () => { rgBot.chat('Hello World!') })
```

<br><a name="RGBot+allowParkour"></a>

### rgBot.allowParkour(allowParkour) ⇒ <code>void</code>
> Enable or disable use of parkour while pathing to a destination. Parkour is disabled by default.
> Parkour movements include moving vertically over trees and other structures rather than walking around them, and jumping over gaps instead of laying Blocks to cross them.
> Enabling parkour may allow your Bot to reach destinations faster and place fewer blocks to achieve upwards movement.
> However, this is more likely to cause the Bot to become stuck during pathing and may require additional logic to handle movement issues.


| Param | Type | Description |
| --- | --- | --- |
| allowParkour | <code>boolean</code> | Whether the Bot is allowed to use parkour movements to reach a destination |


<br><a name="RGBot+allowDigWhilePathing"></a>

### rgBot.allowDigWhilePathing(allowDig) ⇒ <code>void</code>
> Enable or disable the Bot's ability to dig blocks while pathing to a destination. Digging is enabled by default.
> Disabling digging will allow your Bot to reach destinations without breaking important structures that stand between the bot and its goal.


| Param | Type | Description |
| --- | --- | --- |
| allowDig | <code>boolean</code> | Whether the Bot is allowed to dig Blocks in order to remove obstacles that stand in the way of its destination |


<br><a name="RGBot+chat"></a>

### rgBot.chat(message) ⇒ <code>void</code>
> Bot sends a chat message in-game. Also outputs to console if debug is enabled.


| Param | Type |
| --- | --- |
| message | <code>string</code> | 


<br><a name="RGBot+wait"></a>

### rgBot.wait(ticks) ⇒ <code>Promise.&lt;void&gt;</code>
> Waits for the specified number of in-game ticks before continuing.
> Minecraft normally runs at 20 ticks per second, with an in-game day lasting 24,0000 ticks (20 minutes).
> This is similar to the standard JavaScript setTimeout function but runs on the physics timer of the Bot specifically.
> This is useful for waiting on the server to update a Block or spawn drops when you break a Block.


| Param | Type | Description |
| --- | --- | --- |
| ticks | <code>number</code> | The number of in-game ticks to wait |


<br><a name="RGBot+vecToString"></a>

### rgBot.vecToString(position) ⇒ <code>string</code>
> Represent a Vec3 position as a string in the format 'x, y, z'.

**Returns**: <code>string</code> - A string representation of the Vec3 position  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vec3</code> | A Vec3 object representing the position of some Entity |

**Example**  
```js
// returns "15.0, 63, -22.2"
rgBot.vecToString(new Vec(15.0, 63, -22.2))
```

<br><a name="RGBot+vecFromString"></a>

### rgBot.vecFromString(positionString) ⇒ <code>Vec3</code> \| <code>null</code>
> Accepts a string in the format 'x, y, z' and returns a Vec3 object representing that position.
> This is useful for creating chat commands that involve specific coordinates from the Player.

**Returns**: <code>Vec3</code> \| <code>null</code> - A Vec3 representation of the position string, or null if the positionString was invalid  

| Param | Type |
| --- | --- |
| positionString | <code>string</code> | 

**Example**  
```js
// returns new Vec(15.0, 63, -22.2)
rgBot.vecFromString("15.0, 63, -22.2")
```

<br><a name="RGBot+getEntityName"></a>

### rgBot.getEntityName(entity) ⇒ <code>string</code> \| <code>undefined</code>
> Accepts an Entity and returns the displayName of the Entity, or its name if it has no displayName.


| Param | Type |
| --- | --- |
| entity | <code>Entity</code>, <code>Block</code>, <code>Item</code> | 

**Example**  
```js
// entity -> {name: "ender_dragon", displayName: "Ender Dragon"}
// returns "Ender Dragon"
rgBot.getEntityName(entity)
```
**Example**  
```js
// entity -> {name: "cocoa_beans", displayName: undefined}
// returns "cocoa_beans"
rgBot.getEntityName(entity)
```
**Example**  
```js
// entity -> {name: undefined, displayName: undefined}
// returns undefined
rgBot.getEntityName(entity)
```

<br><a name="RGBot+getItemDefinitionByName"></a>

### rgBot.getItemDefinitionByName(itemName) ⇒ <code>Item</code> \| <code>null</code>
> Accepts the name of an Item and returns the corresponding Entity definition for the Item.
> If the Item isn't defined in minecraft's data, returns null instead.

**Returns**: <code>Item</code> \| <code>null</code> - The Item's definition (<i>not</i> an Item instance)  

| Param | Type | Description |
| --- | --- | --- |
| itemName | <code>string</code> | The name of the Item to lookup (<i>not</i> its display name) |

**Example**  
```js
// returns {"id":102,"displayName":"Spruce Log","name":"spruce_log","stackSize":64}
rgBot.getItemDefinitionByName('spruce_log')
```

<br><a name="RGBot+getItemDefinitionById"></a>

### rgBot.getItemDefinitionById(itemId) ⇒ <code>Item</code> \| <code>null</code>
> Accepts the id of an Item and returns the corresponding Entity definition for the Item.
> If the Item isn't defined in minecraft's data, returns null instead.

**Returns**: <code>Item</code> \| <code>null</code> - The Item's definition (<i>not</i> an Item instance)  

| Param | Type | Description |
| --- | --- | --- |
| itemId | <code>number</code> | The item's unique numerical id |

**Example**  
```js
// returns {"id":102,"displayName":"Spruce Log","name":"spruce_log","stackSize":64}
rgBot.getItemDefinitionByName(102)
```

<br><a name="RGBot+entityNamesMatch"></a>

### rgBot.entityNamesMatch(targetName, entity, options) ⇒ <code>boolean</code>
> Determines whether an Entity's name and/or displayName are equal to a targetName string.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| targetName | <code>string</code> |  |  |
| entity | <code>Entity</code> |  |  |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Allow partial matches. For example, 'planks' will match any Entity containing 'planks' in its name ('spruce_planks', 'oak_planks', etc.) |

**Example** *(Full Match)*  
```js
const entity = rg.getItemDefinitionByName('iron_axe')
rgBot.entityNamesMatch('iron_axe', entity) // returns true
rgBot.entityNamesMatch('Iron Axe', entity) // returns true
```
**Example** *(Partial Match)*  
```js
const entity = rg.getItemDefinitionByName('iron_axe')
rgBot.entityNamesMatch('axe', entity, {partialMatch: true}) // returns true
```

<br><a name="RGBot+handlePath"></a>

### rgBot.handlePath(pathFunc, options) ⇒ <code>Promise.&lt;boolean&gt;</code>
> Attempt pathfinding using a custom goal. If the Bot becomes 'stuck' then cancel pathfinding.
> The Bot is considered 'stuck' if it fails to move or perform mining/building actions during a specified interval.

**Returns**: <code>Promise.&lt;boolean&gt;</code> - true if pathing completes, or false if pathing is cancelled or is otherwise interrupted  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pathFunc | <code>function</code> |  | A function utilizing pathfinder to move the Bot |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.interval] | <code>number</code> | <code>5000</code> | How long in ms a Bot must be inactive to be considered 'stuck' |

**Example**  
```js
const goal = new GoalNear(entity.position.x, entity.position.y, entity.position.z, reach);
const success = await rgBot.handlePath(async () => {
 await rgBot.mineflayer().pathfinder.goto(goal);
});
```

<br><a name="RGBot+findEntity"></a>

### rgBot.findEntity(options) ⇒ <code>Entity</code> \| <code>null</code>
> <i><b>Experimental</b></i>
> 
> Find the nearest entity matching the search criteria.

**Returns**: <code>Entity</code> \| <code>null</code> - The nearest Entity matching the search criteria, or null if no matching Entity can be found  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.targetName] | <code>string</code> |  | Target a specific type of Entity. If not specified, then may return an Entity of any type |
| [options.attackable] | <code>boolean</code> | <code>false</code> | Only return entities that can be attacked |

**Example** *(Locate the nearest chicken)*  
```js
rgBot.findEntity({targetName: "chicken"})
```

<br><a name="RGBot+approachEntity"></a>

### rgBot.approachEntity(entity, options) ⇒ <code>Promise.&lt;boolean&gt;</code>
> The Bot will approach the given Entity.

**Returns**: <code>Promise.&lt;boolean&gt;</code> - true if the Bot successfully reaches the Entity, else false  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| entity | <code>Entity</code>, <code>Item</code> |  | The Entity to approach |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.reach] | <code>number</code> | <code>1</code> | The Bot will approach and stand within this reach of the Entity |


<br><a name="RGBot+followEntity"></a>

### rgBot.followEntity(entity, options) ⇒ <code>Promise.&lt;void&gt;</code>
> <i><b>Experimental</b></i>
> 
> The Bot will follow the given Entity.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| entity | <code>Entity</code> |  | The Entity to follow |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.reach] | <code>number</code> | <code>2</code> | The Bot will follow and remain within this reach of the Entity |


<br><a name="RGBot+avoidEntity"></a>

### rgBot.avoidEntity(entity, options) ⇒ <code>Promise.&lt;void&gt;</code>
> <i><b>Experimental</b></i>
> 
> The Bot will avoid the given Entity.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| entity | <code>Entity</code> |  | The Entity to avoid |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.reach] | <code>number</code> | <code>5</code> | The Bot will not move within this reach of the Entity |


<br><a name="RGBot+attackEntity"></a>

### rgBot.attackEntity(entity) ⇒ <code>void</code>
> <i><b>Experimental</b></i>
> 
> The Bot will attack the given Entity one time.
> This <i>will not</i> move the Bot towards its target: calling [`followEntity`](`followEntity`) is recommended for staying within attack range of the target as it moves.


| Param | Type |
| --- | --- |
| entity | <code>Entity</code> | 


<br><a name="RGBot+wander"></a>

### rgBot.wander(minDistance, maxDistance) ⇒ <code>Promise.&lt;boolean&gt;</code>
> Choose a random point within a minimum and maximum radius around the Bot and approach it.
> Points are calculated on the X and Z axes.

**Returns**: <code>Promise.&lt;boolean&gt;</code> - true if the Bot successfully reached its wander goal, else false  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| minDistance | <code>number</code> | <code>10</code> | The minimum distance the point may be from the Bot |
| maxDistance | <code>number</code> | <code>10</code> | The maximum distance the point may be from the Bot |


<br><a name="RGBot+findBlock"></a>

### rgBot.findBlock(blockType, options) ⇒ <code>Block</code> \| <code>null</code>
> Attempt to locate the nearest block of the given type within a specified range from the Bot.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| blockType | <code>string</code> |  | The displayName or name of the block to find |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Find blocks whose name / displayName contains blockType. (Ex. 'log' may find any of 'spruce_log', 'oak_log', etc.) |
| [options.onlyFindTopBlocks] | <code>boolean</code> | <code>false</code> | Will not return any blocks that are beneath another block |
| [options.maxDistance] | <code>number</code> | <code>50</code> | Find any Blocks matching the search criteria up to and including this distance from the Bot |
| [options.skipClosest] | <code>boolean</code> | <code>false</code> | Will attempt to locate the next-closest Block. This can be used to skip the closest Block when the Bot encounters an issue collecting it |


<br><a name="RGBot+approachBlock"></a>

### rgBot.approachBlock(block, options) ⇒ <code>Promise.&lt;boolean&gt;</code>
> The Bot will approach and stand within reach of the given Block.

**Returns**: <code>Promise.&lt;boolean&gt;</code> - true if pathing was successfully completed or false if pathing could not be completed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| block | <code>Block</code> |  | The Block instance to approach |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.reach] | <code>number</code> | <code>5</code> |  |


<br><a name="RGBot+placeBlock"></a>

### rgBot.placeBlock(blockName, targetBlock, options) ⇒ <code>Promise.&lt;void&gt;</code>
> Move directly adjacent to a target Block and place another Block from the Bot's inventory against it.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| blockName | <code>string</code> |  | The name of the Block to place. Must be available in the Bot's inventory |
| targetBlock | <code>Block</code> |  | The target Block to place the new Block on/against |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.faceVector] | <code>Vec3</code> | <code>Vec3(0, 1, 0)</code> | The face of the targetBlock to place the new block against (Ex. Vec3(0, 1, 0) represents the topmost face of the targetBlock) |
| [options.reach] | <code>number</code> | <code>5</code> | The Bot will stand within this reach of the targetBlock while placing the new Block |


<br><a name="RGBot+equipBestHarvestTool"></a>

### rgBot.equipBestHarvestTool(block) ⇒ <code>Promise.&lt;(Item\|null)&gt;</code>
> Equip the best tool for harvesting the specified Block.

**Returns**: <code>Promise.&lt;(Item\|null)&gt;</code> - The tool that was equipped or null if the Bot did not have the tool in its inventory  

| Param | Type | Description |
| --- | --- | --- |
| block | <code>Block</code> | A harvestable Block instance |


<br><a name="RGBot+digBlock"></a>

### rgBot.digBlock(block) ⇒ <code>Promise.&lt;boolean&gt;</code>
> Dig the given Block.
> This will equip the most appropriate tool in the Bot's inventory for this Block type.

**Returns**: <code>Promise.&lt;boolean&gt;</code> - Whether the Block was successfully dug  

| Param | Type | Description |
| --- | --- | --- |
| block | <code>Block</code> | The Block instance to dig |


<br><a name="RGBot+findAndDigBlock"></a>

### rgBot.findAndDigBlock(blockType, options) ⇒ <code>Promise.&lt;boolean&gt;</code>
> Locate and dig the closest Block of a given type within a maximum distance from the Bot.
> This method will equip the most appropriate tool in the Bot's inventory for this Block type.

**Returns**: <code>Promise.&lt;boolean&gt;</code> - true if a Block was found and dug successfully or false if a Block was not found or if digging was interrupted  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| blockType | <code>string</code> |  | The name of the Block to find and dig |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Find blocks whose name / displayName contains blockType. (Ex. 'log' may find any of 'spruce_log', 'oak_log', etc.) |
| [options.onlyFindTopBlocks] | <code>boolean</code> | <code>false</code> | Will not attempt to dig any Blocks that are beneath another Block |
| [options.maxDistance] | <code>number</code> | <code>50</code> | Find any Blocks matching the search criteria up to and including this distance from the Bot |
| [options.skipCollection] | <code>boolean</code> | <code>false</code> | If true, the Bot will not explicitly attempt to collect drops from the broken Block. This allows the player to control which drops are collected and which ones are ignored |
| [options.skipClosest] | <code>boolean</code> | <code>false</code> | Will attempt to locate the next-closest Block. This can be used to skip the closest Block when the Bot encounters an issue collecting it |


<br><a name="RGBot+findItemOnGround"></a>

### rgBot.findItemOnGround(itemName, options) ⇒ <code>Item</code> \| <code>null</code>
> Locate the closest Item with the given name within a maximum distance from the Bot, or null if no matching Items are found.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| itemName | <code>string</code> |  |  |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Locate any items whose name / displayName contains itemName. (Ex. 'wooden_axe', 'stone_axe', 'diamond_axe', etc. will all satisfy itemName 'axe') |
| [options.maxDistance] | <code>number</code> | <code>30</code> | Find any Items matching the search criteria up to and including this distance from the Bot |


<br><a name="RGBot+findItemsOnGround"></a>

### rgBot.findItemsOnGround(options) ⇒ <code>Array.&lt;Item&gt;</code>
> Returns a list of all Items that are on the ground within a maximum distance from the Bot (can be empty).

**Returns**: <code>Array.&lt;Item&gt;</code> - The list of Items found on the ground (can be empty)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.itemName] | <code>string</code> |  | Find only Items with this name |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | If itemName is defined, find Items whose names / displayNames contain itemName. (Ex. 'boots' may find any of 'iron_boots', 'golden_boots', etc.) |
| [options.maxDistance] | <code>number</code> | <code>50</code> | Find any Items matching the search criteria up to and including this distance from the Bot |


<br><a name="RGBot+findAndCollectItemsOnGround"></a>

### rgBot.findAndCollectItemsOnGround(options) ⇒ <code>Promise.&lt;Array.&lt;Item&gt;&gt;</code>
> Collects all Items on the ground within a maximum distance from the Bot.

**Returns**: <code>Promise.&lt;Array.&lt;Item&gt;&gt;</code> - A list of Item definitions for each Item collected from the ground (can be empty)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.itemName] | <code>string</code> |  | Find and collect only Items with this name |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | If itemName is defined, find Items whose names / displayNames contain itemName. (Ex. 'boots' may find any of 'iron_boots', 'golden_boots', etc.). |
| [options.maxDistance] | <code>number</code> | <code>50</code> | Find and collect any Items matching the search criteria up to and including this distance from the Bot |


<br><a name="RGBot+inventoryContainsItem"></a>

### rgBot.inventoryContainsItem(itemName, options) ⇒ <code>boolean</code>
> Returns true if the Bot has one or more of a specified Item in its inventory, or false if it does not.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| itemName | <code>string</code> |  |  |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Check for any items whose name / displayName contains itemName. (Ex. 'wooden_axe', 'stone_axe', 'diamond_axe', etc. will all satisfy itemName 'axe') |
| [options.quantity] | <code>number</code> | <code>1</code> | The minimum amount of this Item the Bot must have |


<br><a name="RGBot+getInventoryItemQuantity"></a>

### rgBot.getInventoryItemQuantity(itemName, options) ⇒ <code>int</code>
> Return how many of a specific item the Bot currently holds in its inventory.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| itemName | <code>string</code> |  |  |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Count any items whose name / displayName contains itemName. (Ex. 'wooden_axe', 'stone_axe', 'diamond_axe', etc. will all be included in the quantity for itemName 'axe'). |


<br><a name="RGBot+dropInventoryItem"></a>

### rgBot.dropInventoryItem(itemName, options) ⇒ <code>Promise.&lt;void&gt;</code>
> Drop an inventory Item on the ground.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| itemName | <code>string</code> |  |  |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Drop items whose name / displayName contains itemName. (Ex. itemName 'stone' will drop 'stone', 'stone_axe', 'stone_sword', etc.) |
| [options.quantity] | <code>number</code> | <code>1</code> | The quantity of this Item to drop. To drop all, use -1 or call `dropAllInventoryItem` instead |


<br><a name="RGBot+dropAllInventoryItem"></a>

### rgBot.dropAllInventoryItem(itemName, options) ⇒ <code>Promise.&lt;void&gt;</code>
> Drops all stacks of an Item in the Bot's inventory matching itemName.
> Alias for `dropInventoryItem(itemName, {quantity: -1})`


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| itemName | <code>string</code> |  | The name or display name of the Item(s) to drop |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Drop items whose name / displayName contains itemName. (Ex. itemName 'stone' will drop 'stone', 'stone_axe', 'stone_sword', etc.) |


<br><a name="RGBot+craftItem"></a>

### rgBot.craftItem(itemName, options) ⇒ <code>Promise.&lt;(Item\|null)&gt;</code>
> Craft an Item. The Bot must have enough materials to make at least one of these Items, or else recipe lookup will fail.
> If the recipe requires a crafting station, then a craftingTable entity is required for success.

**Returns**: <code>Promise.&lt;(Item\|null)&gt;</code> - The crafted Item or null if crafting failed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| itemName | <code>string</code> |  | The Item to craft |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.quantity] | <code>number</code> | <code>1</code> | The number of times to craft this Item. Note that this is NOT the total quantity that should be crafted (Ex. `craftItem('stick', 4)` will result in 16 sticks rather than 4) |
| [options.craftingTable] | <code>Block</code> |  | For recipes that require a crafting table/station. A Block Entity representing the appropriate station within reach of the Bot |


<br><a name="RGBot+holdItem"></a>

### rgBot.holdItem(itemName) ⇒ <code>Promise.&lt;(Item\|null)&gt;</code>
> Equips an Item to the Bot's hand. The Bot must have the Item in its inventory to hold it.

**Returns**: <code>Promise.&lt;(Item\|null)&gt;</code> - The held Item or null if the Bot was unable to equip the Item  

| Param | Type |
| --- | --- |
| itemName | <code>string</code> | 


<br><a name="RGBot+getContainerContents"></a>

### rgBot.getContainerContents(containerWindow) ⇒ <code>Array.&lt;Item&gt;</code>
> Returns the contents of an open container.
> If multiple stacks of the same Item are present in the container, they will not be collapsed in the result.

**Returns**: <code>Array.&lt;Item&gt;</code> - The list of Items present in the container (can be empty)  

| Param | Type | Description |
| --- | --- | --- |
| containerWindow | <code>Window</code> | The open container Window to withdraw items from |


<br><a name="RGBot+withdrawItems"></a>

### rgBot.withdrawItems(containerWindow, options) ⇒ <code>Promise.&lt;void&gt;</code>
> Withdraws one or more items from a container.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| containerWindow | <code>Window</code> |  | The open container Window to withdraw items from |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.itemName] | <code>string</code> |  | An Item to withdraw from the container. If not specified, will withdraw all Items |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Allow partial matches to itemName. For example, 'planks' will match any Item containing 'planks' in its name ('spruce_planks', 'oak_planks', etc.) |
| [options.quantity] | <code>number</code> |  | If itemName is specified, withdraw up to this quantity |


<br><a name="RGBot+depositItems"></a>

### rgBot.depositItems(containerWindow, options) ⇒ <code>Promise.&lt;void&gt;</code>
> Deposits one or more items into a container.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| containerWindow | <code>Window</code> |  | The open container Window to deposit items into |
| options | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.itemName] | <code>string</code> |  | An Item to deposit into the container. If not specified, will deposit all Items. |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Allow partial matches to itemName. For example, 'planks' will match any Item containing 'planks' in its name ('spruce_planks', 'oak_planks', etc.). |
| [options.quantity] | <code>number</code> |  | If itemName is specified, deposit up to this quantity. |

