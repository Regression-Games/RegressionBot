## Classes

<dl>
<dt><a href="#RGBot">RGBot</a></dt>
<dd><h2><u>Glossary:</u></h2>

<p> <b><u>Mineflayer and Pathfinder</u></b><br>
   Mineflayer is a high-level JavaScript API for creating Minecraft Bots.
   Mineflayer supports third-party plugins like Pathfinder - an advanced Pathfinding library to help your Bot navigate the world.
   Regression Games uses Mineflayer and Pathfinder to create a stable and user-friendly library. Create the best Bot you can with ease. <br>
   <i>Mineflayer API documentation - <a href="https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md">https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md</a> </i><br>
   <i>Mineflayer Pathfinder API documentation - <a href="https://github.com/PrismarineJS/mineflayer-pathfinder/blob/master/readme.md">https://github.com/PrismarineJS/mineflayer-pathfinder/blob/master/readme.md</a> </i><br></p>
<p> <b><u>Vec3</u></b><br>
   Mineflayer indicates the position of an object as a point along 3 axes. These points are represented as Vec3 instances in the following format:
     {x (south), y (up), z(west)} <br>
   <i>Vec3 Documentation - <a href="https://github.com/PrismarineJS/node-vec3">https://github.com/PrismarineJS/node-vec3</a> </i><br></p>
<p> <b><u>Entity</u></b><br>
   An Entity is anything that can be dynamically spawned into the Minecraft world.
   Common Entities include other players, enemy mobs, items in your inventory or floating on the ground, and objects you can interact with such as mine-carts or beds.</p>
<p> <b><u>Block</u></b><br>
   A Block is a specific type of Entity that exist in the environment.
   Some yield materials when collected, like blocks of Coal or Diamond, while others can be interacted with like ladders and vines. <br></p>
<p> <b><u>Item</u></b><br>
   An Item represents any Entity that can be collected in the player&#39;s inventory or hands.
   These can be things like weapons and armor that the player equips, crafting materials, or items that can be placed to create a Block.
   This last example brings up an important distinction to keep in mind while creating your Bot: an object is an Item when in the bot inventory or hand, or when it has been tossed on the ground, but it is a Block once it is placed in the world.</p>
<p> <b><u>Name versus Display Name</u></b><br>
   An Entity&#39;s name is a unique identifier, and its display name is typically the same or similar identifier but in a human-readable format.
   As an example, the Ender Dragon is the readable name, or display name, of the Entity named ender_dragon. Likewise, Grass Block is the display name of the block named grass_block.
   This library provides functions to accept the name but not the display name for conciseness and efficiency</p>
</dd>
<dt><a href="#BestHarvestTool">BestHarvestTool</a></dt>
<dd><p>A result model for finding the best harvesting tool including the tool if found and the digTime for that tool/block combo.
The digTime will be Infinity if the block is not diggable with any tool the bot has.</p>
</dd>
<dt><a href="#FindResult">FindResult</a></dt>
<dd><p>The result of a findEntities, findBlocks, findItemsOnGround operation.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#DEFAULT_FIND_BLOCKS_SORT_VALUE_FUNCTION">DEFAULT_FIND_BLOCKS_SORT_VALUE_FUNCTION(distance, [pointValue], [digTime])</a> ⇒ <code>number</code></dt>
<dd><p>MC character running speed is 5 blocks per second, up to 9 with soul speed 3.
Distance to travel doesn&#39;t always mean flat ground running.
Sometimes distance implies non-linear paths or block digging, but this default gives a reasonable estimate</p>
<p>After some experimentation/white-boarding, we found that pointValue-distance-digTime gives a reasonable balance
of point return vs time to reach further blocks, which often involves digging other blocks first.</p>
</dd>
<dt><a href="#DEFAULT_FIND_ENTITIES_SORT_VALUE_FUNCTION">DEFAULT_FIND_ENTITIES_SORT_VALUE_FUNCTION(distance, pointValue, [health], [defense], [toughness])</a> ⇒ <code>number</code></dt>
<dd><p>For Reference In Minecraft: (damageTaken = damage * (1 - min(20, max(defense / 5, defense - damage / (toughness / 4 + 2)))) / 25)</p>
</dd>
<dt><a href="#DEFAULT_FIND_ITEMS_ON_GROUND_SORT_VALUE_FUNCTION">DEFAULT_FIND_ITEMS_ON_GROUND_SORT_VALUE_FUNCTION(distance, [pointValue])</a> ⇒ <code>number</code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#FindEntitiesEntityValueFunction">FindEntitiesEntityValueFunction</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#FindEntitiesSortValueFunction">FindEntitiesSortValueFunction</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#FindBlocksBlockValueFunction">FindBlocksBlockValueFunction</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#FindBlocksSortValueFunction">FindBlocksSortValueFunction</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#FindItemsOnGroundItemValueFunction">FindItemsOnGroundItemValueFunction</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#FindItemsOnGroundSortValueFunction">FindItemsOnGroundSortValueFunction</a> ⇒ <code>number</code></dt>
<dd></dd>
</dl>


<br><a name="RGBot"></a>

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
>    Common Entities include other players, enemy mobs, items in your inventory or floating on the ground, and objects you can interact with such as mine-carts or beds.
> 
>  <b><u>Block</u></b><br>
>    A Block is a specific type of Entity that exist in the environment.
>    Some yield materials when collected, like blocks of Coal or Diamond, while others can be interacted with like ladders and vines. <br>
> 
>  <b><u>Item</u></b><br>
>    An Item represents any Entity that can be collected in the player's inventory or hands.
>    These can be things like weapons and armor that the player equips, crafting materials, or items that can be placed to create a Block.
>    This last example brings up an important distinction to keep in mind while creating your Bot: an object is an Item when in the bot inventory or hand, or when it has been tossed on the ground, but it is a Block once it is placed in the world.
> 
>  <b><u>Name versus Display Name</u></b><br>
>    An Entity's name is a unique identifier, and its display name is typically the same or similar identifier but in a human-readable format.
>    As an example, the Ender Dragon is the readable name, or display name, of the Entity named ender_dragon. Likewise, Grass Block is the display name of the block named grass_block.
>    This library provides functions to accept the name but not the display name for conciseness and efficiency


* [RGBot](#RGBot)
    * [new RGBot(bot, matchInfoEmitter)](#new_RGBot_new)
    * [.isCrafting](#RGBot+isCrafting) : <code>boolean</code>
    * [.lastAttackTime](#RGBot+lastAttackTime) : <code>number</code>
    * [.lastAttackItem](#RGBot+lastAttackItem) : <code>Item</code>
    * [.setDebug(debug)](#RGBot+setDebug) ⇒ <code>void</code>
    * [.mineflayer()](#RGBot+mineflayer) ⇒ <code>Bot</code>
    * [.on(event, func)](#RGBot+on) ⇒ <code>void</code>
    * [.allowParkour(allowParkour)](#RGBot+allowParkour) ⇒ <code>void</code>
    * [.allowDigWhilePathing(allowDig)](#RGBot+allowDigWhilePathing) ⇒ <code>void</code>
    * [.chat(message)](#RGBot+chat) ⇒ <code>void</code>
    * [.whisper(username, message)](#RGBot+whisper) ⇒ <code>void</code>
    * [.matchInfo()](#RGBot+matchInfo) ⇒ <code>RGMatchInfo</code> \| <code>null</code>
    * [.username()](#RGBot+username) ⇒ <code>string</code>
    * [.teamForPlayer(username)](#RGBot+teamForPlayer) ⇒ <code>string</code> \| <code>null</code>
    * [.position()](#RGBot+position) ⇒ <code>Vec3</code>
    * [.wait(ticks)](#RGBot+wait) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.vecToString(position)](#RGBot+vecToString) ⇒ <code>string</code>
    * [.vecFromString(positionString)](#RGBot+vecFromString) ⇒ <code>Vec3</code> \| <code>null</code>
    * [.getEntityName(entity)](#RGBot+getEntityName) ⇒ <code>string</code> \| <code>null</code>
    * [.getItemDefinitionByName(itemName)](#RGBot+getItemDefinitionByName) ⇒ <code>Item</code> \| <code>null</code>
    * [.getItemDefinitionById(itemId)](#RGBot+getItemDefinitionById) ⇒ <code>Item</code> \| <code>null</code>
    * [.entityNamesMatch(targetName, entity, [options])](#RGBot+entityNamesMatch) ⇒ <code>boolean</code>
    * [.handlePath([pathFunc], [options])](#RGBot+handlePath) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.findEntity([options])](#RGBot+findEntity) ⇒ <code>Entity</code> \| <code>null</code>
    * [.findEntities([options])](#RGBot+findEntities) ⇒ <code>Array.&lt;FindResult.&lt;Entity&gt;&gt;</code>
    * [.approachEntity(entity, [options])](#RGBot+approachEntity) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.followEntity(entity, [options])](#RGBot+followEntity) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.avoidEntity(entity, [options])](#RGBot+avoidEntity) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.attackEntity(entity, [options])](#RGBot+attackEntity) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.waitForWeaponCoolDown()](#RGBot+waitForWeaponCoolDown) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.moveAwayFrom(position, distance)](#RGBot+moveAwayFrom) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.wander([minDistance], [maxDistance])](#RGBot+wander) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.findBlock(blockType, [options])](#RGBot+findBlock) ⇒ <code>Block</code> \| <code>null</code>
    * [.findBlocks([options])](#RGBot+findBlocks) ⇒ <code>Array.&lt;FindResult.&lt;Block&gt;&gt;</code>
    * [.approachBlock(block, [options])](#RGBot+approachBlock) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.placeBlock(blockName, targetBlock, [options])](#RGBot+placeBlock) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.equipBestHarvestTool(block)](#RGBot+equipBestHarvestTool) ⇒ <code>Promise.&lt;(Item\|null)&gt;</code>
    * [.bestHarvestTool(block)](#RGBot+bestHarvestTool) ⇒ [<code>BestHarvestTool</code>](#BestHarvestTool)
    * [.bestAttackItemMelee()](#RGBot+bestAttackItemMelee) ⇒ <code>Item</code> \| <code>null</code>
    * [.digBlock(block)](#RGBot+digBlock) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.findAndDigBlock(blockType, [options])](#RGBot+findAndDigBlock) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.approachAndDigBlock(block, [options])](#RGBot+approachAndDigBlock) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.findItemOnGround(itemName, [options])](#RGBot+findItemOnGround) ⇒ <code>Item</code> \| <code>null</code>
    * [.findItemsOnGround([options])](#RGBot+findItemsOnGround) ⇒ <code>Array.&lt;FindResult.&lt;Item&gt;&gt;</code>
    * [.collectItemOnGround(item)](#RGBot+collectItemOnGround) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.findAndCollectItemsOnGround([options])](#RGBot+findAndCollectItemsOnGround) ⇒ <code>Promise.&lt;Array.&lt;Item&gt;&gt;</code>
    * [.inventoryContainsItem(itemName, [options])](#RGBot+inventoryContainsItem) ⇒ <code>boolean</code>
    * [.getInventoryItemQuantity(itemName, [options])](#RGBot+getInventoryItemQuantity) ⇒ <code>number</code>
    * [.dropInventoryItem(itemName, [options])](#RGBot+dropInventoryItem) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.isInventorySlotsFull()](#RGBot+isInventorySlotsFull) ⇒ <code>boolean</code>
    * [.getAllInventoryItems()](#RGBot+getAllInventoryItems) ⇒ <code>Array.&lt;Item&gt;</code>
    * [.dropAllInventoryItem(itemName, [options])](#RGBot+dropAllInventoryItem) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.dropAllInventoryItems([options])](#RGBot+dropAllInventoryItems) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.craftItem(itemName, [options])](#RGBot+craftItem) ⇒ <code>Promise.&lt;(Item\|null)&gt;</code>
    * [.holdItem(itemName)](#RGBot+holdItem) ⇒ <code>Promise.&lt;(Item\|null)&gt;</code>
    * [.getContainerContents(containerWindow)](#RGBot+getContainerContents) ⇒ <code>Array.&lt;Item&gt;</code>
    * ~~[.withdrawItems(containerWindow, [options])](#RGBot+withdrawItems) ⇒ <code>Promise.&lt;void&gt;</code>~~
    * [.withdrawItemsFromContainer(containerWindow, [options])](#RGBot+withdrawItemsFromContainer) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * ~~[.depositItems(containerWindow, [options])](#RGBot+depositItems) ⇒ <code>Promise.&lt;void&gt;</code>~~
    * [.depositItemsToContainer(containerWindow, [options])](#RGBot+depositItemsToContainer) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.openContainer(containerBlock)](#RGBot+openContainer) ⇒ <code>Promise.&lt;(Window\|null)&gt;</code>
    * [.closeContainer(containerWindow)](#RGBot+closeContainer) ⇒ <code>Promise.&lt;boolean&gt;</code>


<br><a name="new_RGBot_new"></a>

### new RGBot(bot, matchInfoEmitter)

| Param | Type |
| --- | --- |
| bot | <code>Bot</code> | 
| matchInfoEmitter | <code>EventEmitter</code> | 


<br><a name="RGBot+isCrafting"></a>

### rgBot.isCrafting : <code>boolean</code>
> This is managed automatically by the craftItem(itemName, options) function.
> This value is read by the handlePath function to know if the bot is busy crafting while evaluating if it is stuck or not.
> 
> If you craft outside the handleCrafting function you should follow the example.

**Example**  
```js
try {
    bot.isCrafting = true;
    //  do crafting actions
} finally {
    bot.isCrafting = false;
}
```

<br><a name="RGBot+lastAttackTime"></a>

### rgBot.lastAttackTime : <code>number</code>
> This is managed automatically by attackEntity(entity).  This is used to manage weapon cool-downs.
> 
> If you attack outside the attackEntity function you should follow the example.

**Example**  
```js
await bot.followEntity(entity, {reach: 2})
await bot.waitForWeaponCoolDown()
let attackItem = await bot.findAndEquipBestAttackItem()
bot.lastAttackTime = Date.now()
// actually perform the attack
```

<br><a name="RGBot+lastAttackItem"></a>

### rgBot.lastAttackItem : <code>Item</code>
> This is managed automatically by attackEntity(entity).  This is used to manage weapon cool-downs.
> 
> If you attack outside the attackEntity function you should follow the example.

**Example**  
```js
await bot.followEntity(entity, {reach: 2})
await bot.waitForWeaponCoolDown()
let attackItem = await bot.findAndEquipBestAttackItem()
bot.lastAttackTime = Date.now()
bot.lastAttackItem = attackItem
// actually perform the attack
```

<br><a name="RGBot+setDebug"></a>

### rgBot.setDebug(debug) ⇒ <code>void</code>
> Enable or disable debug logs.


| Param | Type |
| --- | --- |
| debug | <code>boolean</code> | 


<br><a name="RGBot+mineflayer"></a>

### rgBot.mineflayer() ⇒ <code>Bot</code>
> Returns the mineflayer Bot instance controlled by the RGBot. Use this to interact with the mineflayer API directly.

**Returns**: <code>Bot</code> - The mineflayer Bot instance controlled by the RGBot  
**See**: [MineFlayer API](https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md)  
**Example** *(Accessing mineflayer API through mineflayer())*  
```js
// returns the bot username from mineflayer
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
> Enable or disable the ability to dig blocks while pathing to a destination. Digging is enabled by default.
> Disabling digging will allow your Bot to reach destinations without breaking important structures that stand between the bot and its goal.


| Param | Type | Description |
| --- | --- | --- |
| allowDig | <code>boolean</code> | Whether the Bot is allowed to dig Blocks in order to remove obstacles that stand in the way of its destination |


<br><a name="RGBot+chat"></a>

### rgBot.chat(message) ⇒ <code>void</code>
> Bot sends a chat message in-game. Also outputs to console if debug is enabled.


| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | The message to send |


<br><a name="RGBot+whisper"></a>

### rgBot.whisper(username, message) ⇒ <code>void</code>
> Bot sends a whisper message in-game to a specific username.  Also outputs to console if debug is enabled.


| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | The username to whisper to |
| message | <code>string</code> | The message to send |


<br><a name="RGBot+matchInfo"></a>

### rgBot.matchInfo() ⇒ <code>RGMatchInfo</code> \| <code>null</code>
> Gets the current Regression Games match info.
> This is updated every time a player_joined, player_left, match_started, match_ended, score_update event occurs on the matchInfoEmitter.
> 
> You can also listen to these events in your own bot scripts.

**Example**  
```js
matchInfoEmitter.on('player_joined', (matchInfo, playerName, team) => {
        console.log(`Player joined our match: ${playerName}-${team}`)
    })

    matchInfoEmitter.on('match_ended', async(matchInfo) => {
        const points = matchInfo?.players.find(player => player.username === bot.userName())?.metadata?.score
        console.log(`The match has ended - I scored ${points} points`)
    })
```

<br><a name="RGBot+username"></a>

### rgBot.username() ⇒ <code>string</code>
> Gets the username of this bot


<br><a name="RGBot+teamForPlayer"></a>

### rgBot.teamForPlayer(username) ⇒ <code>string</code> \| <code>null</code>
> Gets the team name for the specific player

**Returns**: <code>string</code> \| <code>null</code> - Name of the team the player is on  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | Username of the player/bot |


<br><a name="RGBot+position"></a>

### rgBot.position() ⇒ <code>Vec3</code>
> Gets the current position of the bot


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

### rgBot.getEntityName(entity) ⇒ <code>string</code> \| <code>null</code>
> Accepts an Entity and returns the name of the Entity.  This does not consider displayName, only name.
> If the entity has a 'username', returns username.


| Param | Type |
| --- | --- |
| entity | <code>Entity</code>, <code>Block</code>, <code>Item</code> | 

**Example**  
```js
// entity -> {username: "NinaTheDragon", name: "ender_dragon", displayName: "Ender Dragon"}
// returns "NinaTheDragon"
rgBot.getEntityName(entity)
```
**Example**  
```js
// entity -> {username: undefined, name: "ender_dragon", displayName: "Ender Dragon"}
// returns "ender_dragon"
rgBot.getEntityName(entity)
```
**Example**  
```js
// entity -> {username: undefined, name: "cocoa_beans", displayName: undefined}
// returns "cocoa_beans"
rgBot.getEntityName(entity)
```
**Example**  
```js
// entity -> {username: undefined, name: undefined, displayName: undefined}
// returns null
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

### rgBot.entityNamesMatch(targetName, entity, [options]) ⇒ <code>boolean</code>
> Determines whether an Entity's username or name is equal to a targetName string.  Does not consider displayName.
> Matching is case-sensitive.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| targetName | <code>string</code> |  |  |
| entity | <code>Entity</code>, <code>Item</code> |  |  |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Allow partial matches. For example, '_planks' will match any Entity containing '_planks' in its name ('spruce_planks', 'oak_planks', etc.) |

**Example** *(Full Match)*  
```js
const entity = rg.getItemDefinitionByName('iron_axe')
rgBot.entityNamesMatch('iron_axe', entity) // returns true
rgBot.entityNamesMatch('Iron Axe', entity) // returns false
```
**Example** *(Partial Match)*  
```js
const entity = rg.getItemDefinitionByName('iron_axe')
rgBot.entityNamesMatch('_axe', entity, {partialMatch: true}) // returns true
```

<br><a name="RGBot+handlePath"></a>

### rgBot.handlePath([pathFunc], [options]) ⇒ <code>Promise.&lt;boolean&gt;</code>
> Attempt pathfinding. If the Bot becomes 'stuck' then cancel pathfinding.
> The Bot is considered 'stuck' if it fails to move or perform mining/crafting/chest-interaction actions during a specified interval.

**Returns**: <code>Promise.&lt;boolean&gt;</code> - true if pathing completes, or false if pathing is cancelled or otherwise interrupted  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [pathFunc] | <code>function</code> |  | a function utilizing pathfinder to move the Bot |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.interval] | <code>number</code> | <code>5000</code> | how long in ms a Bot must be inactive to be considered 'stuck' |

**Example**  
```js
const goal = new GoalNear(entity.position.x, entity.position.y, entity.position.z, reach);
const success = await rgBot.handlePath(async () => {
 await rgBot.mineflayer().pathfinder.goto(goal);
});
```

<br><a name="RGBot+findEntity"></a>

### rgBot.findEntity([options]) ⇒ <code>Entity</code> \| <code>null</code>
> Find the nearest entity matching the search criteria.

**Returns**: <code>Entity</code> \| <code>null</code> - The nearest Entity matching the search criteria, or null if no matching Entity can be found  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.targetName] | <code>string</code> |  | Target a specific type of Entity. If not specified, then may return an Entity of any type |
| [options.attackable] | <code>boolean</code> | <code>false</code> | Only return entities that can be attacked |

**Example** *(Locate the nearest chicken)*  
```js
rgBot.findEntity({targetName: "chicken"})
```

<br><a name="RGBot+findEntities"></a>

### rgBot.findEntities([options]) ⇒ <code>Array.&lt;FindResult.&lt;Entity&gt;&gt;</code>
> Find the nearest entity matching the search criteria.

**Returns**: <code>Array.&lt;FindResult.&lt;Entity&gt;&gt;</code> - To get only the 'best' entity result, call findEntities(...).shift().  Note that the result may be null if no entities were found  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> | <code>{}</code> |  |
| [options.entityNames] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | List of targetNames to consider |
| [options.attackable] | <code>boolean</code> | <code>false</code> | Whether the entity must be attackable. If true finds only mob and player entities. |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Consider entities whose username or name partially match one of the targetNames |
| [options.maxDistance] | <code>number</code> |  | Max range to consider |
| [options.maxCount] | <code>number</code> | <code>1</code> | Max count of matching entities to consider |
| [options.entityValueFunction] | [<code>FindEntitiesEntityValueFunction</code>](#FindEntitiesEntityValueFunction) |  | Function to call to get the value of an entity based on its name (entityName). A good example function is { return scoreValueOf[entityUsername || entityName] }, where scoreValueOf is the point value or intrinsic value of the entity in the game mode being played.  If you don't want an entity considered, return a value < 0 for its value. Default value is 0 if no function is provided. |
| [options.sortValueFunction] | [<code>FindEntitiesSortValueFunction</code>](#FindEntitiesSortValueFunction) |  | Function to call to help sort the evaluation of results. Should return the best entity with the lowest sorting value.  Default is RGAlgorithms.DEFAULT_FIND_ENTITIES_SORT_VALUE_FUNCTION |


<br><a name="RGBot+approachEntity"></a>

### rgBot.approachEntity(entity, [options]) ⇒ <code>Promise.&lt;boolean&gt;</code>
> The Bot will approach the given Entity.

**Returns**: <code>Promise.&lt;boolean&gt;</code> - true if the Bot successfully reaches the Entity, else false  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| entity | <code>Entity</code> |  | The Entity to approach |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.reach] | <code>number</code> | <code>1</code> | The Bot will approach and stand within this reach of the Entity |


<br><a name="RGBot+followEntity"></a>

### rgBot.followEntity(entity, [options]) ⇒ <code>Promise.&lt;void&gt;</code>
> <i><b>Experimental - The behaviour of this API can and almost certainly will change in a future API version.</b></i>
> 
> The Bot will follow the given Entity.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| entity | <code>Entity</code> |  | The Entity to follow |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.reach] | <code>number</code> | <code>2</code> | The Bot will follow and remain within this reach of the Entity |


<br><a name="RGBot+avoidEntity"></a>

### rgBot.avoidEntity(entity, [options]) ⇒ <code>Promise.&lt;void&gt;</code>
> <i><b>Experimental - The behaviour of this API can and almost certainly will change in a future API version.</b></i>
> 
> The Bot will avoid the given Entity.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| entity | <code>Entity</code> |  | The Entity to avoid |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.reach] | <code>number</code> | <code>5</code> | The Bot will not move within this reach of the Entity |


<br><a name="RGBot+attackEntity"></a>

### rgBot.attackEntity(entity, [options]) ⇒ <code>Promise.&lt;boolean&gt;</code>
> This will move the bot to within range of the target, equip the most powerful weapon in the bot inventory,
> and attack the target 1 time.  To finish off a target, this method must be called until the target is dead.
> 
> Note: This currently only handles melee weapons

**Returns**: <code>Promise.&lt;boolean&gt;</code> - - did we successfully attack  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| entity | <code>Entity</code> |  | The entity to attack |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.reach] | <code>number</code> | <code>2</code> | How close to get to the target before attacking |
| [options.attackItem] | <code>Item</code> |  | An item in the bot inventory to use for the attack |

**Example**  
```js
let target = //<someEntity>
while (target.isValid) {
    await attackEntity(target)
}
```

<br><a name="RGBot+waitForWeaponCoolDown"></a>

### rgBot.waitForWeaponCoolDown() ⇒ <code>Promise.&lt;void&gt;</code>
> <i><b>Experimental - The behaviour of this API can and almost certainly will change in a future API version.</b></i>
> 
> This uses lastAttackTime,lastAttackItem variables to manage weapon attack cool-downs.
> This assumes that the weapon you just attacked with needs to cool-down before you can attack again,
> even if that next attack is with a different weapon.
> 
> Note: This currently only handles melee weapons


<br><a name="RGBot+moveAwayFrom"></a>

### rgBot.moveAwayFrom(position, distance) ⇒ <code>Promise.&lt;boolean&gt;</code>
> Moves the bot to at least the specified distance away from the position indicated.
> This draws a vector on the XZ plane from the position through the player and finds
> the point at the specified distance.  The bot will move to that point unless it is
> already further away than the distance.

**Returns**: <code>Promise.&lt;boolean&gt;</code> - True if the bot moved away or was already far enough away  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>Vec3</code> | The position to move away from |
| distance | <code>number</code> | How far away to move (minimum) |


<br><a name="RGBot+wander"></a>

### rgBot.wander([minDistance], [maxDistance]) ⇒ <code>Promise.&lt;boolean&gt;</code>
> Choose a random point within a minimum and maximum radius around the Bot and approach it.
> Points are calculated on the X and Z axes.

**Returns**: <code>Promise.&lt;boolean&gt;</code> - true if the Bot successfully reached its wander goal, else false  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [minDistance] | <code>number</code> | <code>10</code> | The minimum distance the point may be from the Bot |
| [maxDistance] | <code>number</code> | <code>10</code> | The maximum distance the point may be from the Bot |


<br><a name="RGBot+findBlock"></a>

### rgBot.findBlock(blockType, [options]) ⇒ <code>Block</code> \| <code>null</code>
> Attempt to locate the nearest block of the given type within a specified range from the Bot.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| blockType | <code>string</code> |  | The name or name of the block to find |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Find blocks whose name contains blockType. (Ex. 'log' may find any of 'spruce_log', 'oak_log', etc.) |
| [options.onlyFindTopBlocks] | <code>boolean</code> | <code>false</code> | Will not return any blocks that are beneath another block |
| [options.maxDistance] | <code>number</code> | <code>30</code> | Find any Blocks matching the search criteria up to and including this distance from the Bot |
| [options.skipClosest] | <code>boolean</code> | <code>false</code> | Deprecated since 1.2.0 - If you want to skip a block from the result set, please use the findBlocks(options) function and process the results.  This method makes the best effort to still interpret this parameter, but is no longer skipping the closest block, but rather the best matching block. |


<br><a name="RGBot+findBlocks"></a>

### rgBot.findBlocks([options]) ⇒ <code>Array.&lt;FindResult.&lt;Block&gt;&gt;</code>
> Returns the best block that is diggable within a maximum distance from the Bot.

**Returns**: <code>Array.&lt;FindResult.&lt;Block&gt;&gt;</code> - - the best blocks found

To get only the 'best' block result, call findBlocks(...).shift().  Note that the result may be null if no blocks were found  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> |  | optional parameters |
| [options.blockNames] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | List of blockNames to consider |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Consider blocks whose name partially matches one of the blockNames |
| [options.onlyFindTopBlocks] | <code>boolean</code> | <code>false</code> | Only find blocks that don't have a block above them. |
| [options.maxDistance] | <code>number</code> | <code>30</code> | Max range to consider.  Be careful as large values have performance implications.  30 means up to 60x60x60 (216000) blocks could be evaluated.  50 means up to 100x100x100 (1000000) blocks could be evaluated |
| [options.maxCount] | <code>number</code> | <code>1</code> | Max count of matching blocks |
| [options.blockValueFunction] | [<code>FindBlocksBlockValueFunction</code>](#FindBlocksBlockValueFunction) |  | Function to call to get the value of a block based on its name (blockName). A good example function is { return scoreValueOf[blockName] }, where scoreValueOf is the point value or intrinsic value of the block in the game mode being played.  If you don't want a block considered, return a value < 0 for its value. Default value is 0 if no function is provided. |
| [options.sortValueFunction] | [<code>FindBlocksSortValueFunction</code>](#FindBlocksSortValueFunction) |  | Function to call to help sort the evaluation of results. Should return the best entity with the lowest sorting value.  Default is RGAlgorithms.DEFAULT_FIND_BLOCKS_SORT_VALUE_FUNCTION |


<br><a name="RGBot+approachBlock"></a>

### rgBot.approachBlock(block, [options]) ⇒ <code>Promise.&lt;boolean&gt;</code>
> The Bot will approach and stand within reach of the given Block.

**Returns**: <code>Promise.&lt;boolean&gt;</code> - true if pathing was successfully completed or false if pathing could not be completed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| block | <code>Block</code> |  | The Block instance to approach |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.reach] | <code>number</code> | <code>5</code> | How close to get to the block |


<br><a name="RGBot+placeBlock"></a>

### rgBot.placeBlock(blockName, targetBlock, [options]) ⇒ <code>Promise.&lt;void&gt;</code>
> Move directly adjacent to a target Block and place another Block from the bot inventory against it.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| blockName | <code>string</code> |  | The name of the Block to place. Must be available in the bot inventory |
| targetBlock | <code>Block</code> |  | The target Block to place the new Block on/against |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.faceVector] | <code>Vec3</code> | <code>Vec3(0, 1, 0)</code> | The face of the targetBlock to place the new block against (Ex. Vec3(0, 1, 0) represents the topmost face of the targetBlock) |
| [options.reach] | <code>number</code> | <code>5</code> | The Bot will stand within this reach of the targetBlock while placing the new Block |


<br><a name="RGBot+equipBestHarvestTool"></a>

### rgBot.equipBestHarvestTool(block) ⇒ <code>Promise.&lt;(Item\|null)&gt;</code>
> Equip the best tool for harvesting the specified Block.

**Returns**: <code>Promise.&lt;(Item\|null)&gt;</code> - The tool that was equipped or null if the Bot did not have the tool in its inventory  

| Param | Type | Description |
| --- | --- | --- |
| block | <code>Block</code> | A harvestable Block instance |


<br><a name="RGBot+bestHarvestTool"></a>

### rgBot.bestHarvestTool(block) ⇒ [<code>BestHarvestTool</code>](#BestHarvestTool)
> Finds the best harvest tool in the bot inventory for mining the specified block.
> If we don't have the best tool, also checks if dig time is infinite because it can't be harvested without a tool


| Param | Type | Description |
| --- | --- | --- |
| block | <code>Block</code> | The block to evaluate the best tool for |


<br><a name="RGBot+bestAttackItemMelee"></a>

### rgBot.bestAttackItemMelee() ⇒ <code>Item</code> \| <code>null</code>
> <i><b>Experimental - The behaviour of this API can and almost certainly will change in a future API version.</b></i>
> 
> This finds the most powerful melee attack item in the bot inventory
> 
> Note: Today this only prioritizes weapon type, but does not prioritize weapon rarity/enchantments/etc


<br><a name="RGBot+digBlock"></a>

### rgBot.digBlock(block) ⇒ <code>Promise.&lt;boolean&gt;</code>
> Dig the given Block.
> This will equip the most appropriate tool in the bot inventory for this Block type.
> This function does NOT approach the block.  It must already be in reach of the bot

**Returns**: <code>Promise.&lt;boolean&gt;</code> - Whether the Block was successfully dug  

| Param | Type | Description |
| --- | --- | --- |
| block | <code>Block</code> | The Block instance to dig |


<br><a name="RGBot+findAndDigBlock"></a>

### rgBot.findAndDigBlock(blockType, [options]) ⇒ <code>Promise.&lt;boolean&gt;</code>
> Locate and dig the closest Block of a given type within a maximum distance from the Bot.
> This method will equip the most appropriate tool in the bot inventory for this Block type.
> 
> Note: In more advanced bot code implementations, you will most likely want to pass skipCollection as true and handle the choice to collect or not as a decision in your main loop's next iteration.

**Returns**: <code>Promise.&lt;boolean&gt;</code> - true if a Block was found and dug successfully or false if a Block was not found or if digging was interrupted  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| blockType | <code>string</code> |  | The name of the Block to find and dig |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Find blocks whose name contains blockType. (Ex. 'log' may find any of 'spruce_log', 'oak_log', etc.) |
| [options.onlyFindTopBlocks] | <code>boolean</code> | <code>false</code> | Will not attempt to dig any Blocks that are beneath another Block |
| [options.maxDistance] | <code>number</code> | <code>30</code> | Find any Blocks matching the search criteria up to and including this distance from the Bot |
| [options.skipCollection] | <code>boolean</code> | <code>false</code> | If true, the Bot will not explicitly attempt to collect drops from the broken Block. This allows the player to control which drops are collected and which ones are ignored |
| [options.skipClosest] | <code>boolean</code> | <code>false</code> | Deprecated since 1.2.0 - If you want to skip a block from the result set, please use the findBlocks(options) function and process the results before calling approachAndDigBlock(block, options).  This method makes the best effort to still interpret this parameter, but is no longer skipping the closest block, but rather the best matching block. |


<br><a name="RGBot+approachAndDigBlock"></a>

### rgBot.approachAndDigBlock(block, [options]) ⇒ <code>Promise.&lt;boolean&gt;</code>
> Approach (path-find to) and dig the specified block.

**Returns**: <code>Promise.&lt;boolean&gt;</code> - true if a Block was found and dug successfully or false if a Block was not found or if digging was interrupted  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| block | <code>Block</code> |  | The block instance to approach and dig |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.skipCollection] | <code>boolean</code> | <code>false</code> | If true, the Bot will not explicitly attempt to collect drops from the broken Block. This allows the player to control which drops are collected and which ones are ignored |
| [options.reach] | <code>number</code> | <code>5</code> | How close to get to the block |


<br><a name="RGBot+findItemOnGround"></a>

### rgBot.findItemOnGround(itemName, [options]) ⇒ <code>Item</code> \| <code>null</code>
> Locate the closest Item with the given name within a maximum distance from the Bot, or null if no matching Items are found.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| itemName | <code>string</code> |  | The name of the item to find |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Locate any items whose name contains itemName. (Ex. 'wooden_axe', 'stone_axe', 'diamond_axe', etc. will all satisfy itemName 'axe') |
| [options.maxDistance] | <code>number</code> | <code>30</code> | Find any Items matching the search criteria up to and including this distance from the Bot |


<br><a name="RGBot+findItemsOnGround"></a>

### rgBot.findItemsOnGround([options]) ⇒ <code>Array.&lt;FindResult.&lt;Item&gt;&gt;</code>
> Returns a list of all Items that are on the ground within a maximum distance from the Bot (can be empty).

**Returns**: <code>Array.&lt;FindResult.&lt;Item&gt;&gt;</code> - - the best items found

To get only the 'best' item to collect, call findItems(...).shift().  Note that the result may be null if no items were found  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> |  | optional parameters |
| [options.itemNames] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | Find only Items matching one of these names |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | If itemNames is defined, find Items whose name contains any of the itemNames. (Ex. '_boots' may find any of 'iron_boots', 'golden_boots', etc.) |
| [options.maxDistance] | <code>number</code> |  | find any Items matching the search criteria up to and including this distance from the Bot |
| [options.maxCount] | <code>number</code> | <code>1</code> | limit the number of items to find |
| [options.itemValueFunction] | [<code>FindItemsOnGroundItemValueFunction</code>](#FindItemsOnGroundItemValueFunction) |  | Function to call to get the value of an item based on its name (itemName). A good example function is { return scoreValueOf[itemName] }, where scoreValueOf is the point value or intrinsic value of the item in the game mode being played.  If you don't want an item considered, return a value < 0 for its value.  Default value is 0. |
| [options.sortValueFunction] | [<code>FindItemsOnGroundSortValueFunction</code>](#FindItemsOnGroundSortValueFunction) |  | Function to call to help sort the evaluation of results. Should return the best item with the lowest sorting value.  Default is RGAlgorithms.DEFAULT_FIND_ITEMS_ON_GROUND_SORT_VALUE_FUNCTION |


<br><a name="RGBot+collectItemOnGround"></a>

### rgBot.collectItemOnGround(item) ⇒ <code>Promise.&lt;boolean&gt;</code>
> Collects the item from the ground if it exists and is on the ground.

**Returns**: <code>Promise.&lt;boolean&gt;</code> - True if an item was collected  

| Param | Type |
| --- | --- |
| item | <code>Entity</code> | 


<br><a name="RGBot+findAndCollectItemsOnGround"></a>

### rgBot.findAndCollectItemsOnGround([options]) ⇒ <code>Promise.&lt;Array.&lt;Item&gt;&gt;</code>
> Collects all Items on the ground within a maximum distance from the Bot.

**Returns**: <code>Promise.&lt;Array.&lt;Item&gt;&gt;</code> - A list of Item definitions for each Item collected from the ground (can be empty)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.itemNames] | <code>string</code> | <code>&quot;[]&quot;</code> | Find and collect only Items with this name |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | If itemNames is defined, find Items whose name contain any of the itemNames. (Ex. '_boots' may find any of 'iron_boots', 'golden_boots', etc.). |
| [options.maxDistance] | <code>number</code> | <code>50</code> | Find and collect any Items matching the search criteria up to and including this distance from the Bot |


<br><a name="RGBot+inventoryContainsItem"></a>

### rgBot.inventoryContainsItem(itemName, [options]) ⇒ <code>boolean</code>
> Returns true if the Bot has one or more of a specified Item in its inventory, or false if it does not.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| itemName | <code>string</code> |  |  |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Check for any items whose name contains itemName. (Ex. 'wooden_axe', 'stone_axe', 'diamond_axe', etc. will all satisfy itemName 'axe') |
| [options.quantity] | <code>number</code> | <code>1</code> | The minimum amount of this Item the Bot must have |


<br><a name="RGBot+getInventoryItemQuantity"></a>

### rgBot.getInventoryItemQuantity(itemName, [options]) ⇒ <code>number</code>
> Return how many of a specific item the Bot currently holds in its inventory.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| itemName | <code>string</code> |  |  |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Count any items whose name contains itemName. (Ex. 'wooden_axe', 'stone_axe', 'diamond_axe', etc. will all be included in the quantity for itemName 'axe'). |


<br><a name="RGBot+dropInventoryItem"></a>

### rgBot.dropInventoryItem(itemName, [options]) ⇒ <code>Promise.&lt;void&gt;</code>
> Drop an inventory Item on the ground.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| itemName | <code>string</code> |  |  |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Drop items whose name contains itemName. (Ex. itemName 'stone' will drop 'stone', 'stone_axe', 'stone_sword', etc.) |
| [options.quantity] | <code>number</code> | <code>1</code> | The quantity of this Item to drop. To drop all, pass some number <0, or call `dropAllInventoryItem` instead |


<br><a name="RGBot+isInventorySlotsFull"></a>

### rgBot.isInventorySlotsFull() ⇒ <code>boolean</code>
> Returns true if all inventory slots are occupied.  This does not necessarily mean it is completely/totally full,
> but it means you would need to stack items of the same type to fit anything else in the inventory.


<br><a name="RGBot+getAllInventoryItems"></a>

### rgBot.getAllInventoryItems() ⇒ <code>Array.&lt;Item&gt;</code>
> Get all items in the bot inventory.


<br><a name="RGBot+dropAllInventoryItem"></a>

### rgBot.dropAllInventoryItem(itemName, [options]) ⇒ <code>Promise.&lt;void&gt;</code>
> Drops all stacks of an Item in the bot inventory matching itemName.
> Alias for `dropAllInventoryItems({itemNames: [itemName]})`


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| itemName | <code>string</code> |  | The name or display name of the Item(s) to drop |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Drop items whose name contains itemName. (Ex. itemName 'stone' will drop 'stone', 'stone_axe', 'stone_sword', etc.) |


<br><a name="RGBot+dropAllInventoryItems"></a>

### rgBot.dropAllInventoryItems([options]) ⇒ <code>Promise.&lt;void&gt;</code>
> Drops all stacks of an Item in the bot inventory matching itemName.
> Alias for `dropInventoryItem(itemName, {quantity: -1})`


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.itemNames] | <code>Array.&lt;string&gt;</code> |  | The name or display name of the Item(s) to drop, if not passed, all items will be dropped. |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Drop items whose name contains itemName. (Ex. itemName 'stone' will drop 'stone', 'stone_axe', 'stone_sword', etc.) |


<br><a name="RGBot+craftItem"></a>

### rgBot.craftItem(itemName, [options]) ⇒ <code>Promise.&lt;(Item\|null)&gt;</code>
> Craft an Item. The Bot must have enough materials to make at least one of these Items, or else recipe lookup will fail.
> If the recipe requires a crafting station, then a craftingTable entity is required for success.  The craftingTable entity must be in reach of the bot via approachEntity.  This function does NOT approach the craftingTable.

**Returns**: <code>Promise.&lt;(Item\|null)&gt;</code> - The crafted Item or null if crafting failed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| itemName | <code>string</code> |  | The Item to craft |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.quantity] | <code>number</code> | <code>1</code> | The number of times to craft this Item. Note that this is NOT the total quantity that should be crafted (Ex. `craftItem('stick', {quantity:4})` will result in 16 sticks rather than 4) |
| [options.craftingTable] | <code>Block</code> |  | For recipes that require a crafting table/station. A Block Entity representing the appropriate station within reach of the Bot |


<br><a name="RGBot+holdItem"></a>

### rgBot.holdItem(itemName) ⇒ <code>Promise.&lt;(Item\|null)&gt;</code>
> Equips an Item to the hand. The Bot must have the Item in its inventory to hold it.

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

### ~~rgBot.withdrawItems(containerWindow, [options]) ⇒ <code>Promise.&lt;void&gt;</code>~~&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🚫 Deprecated`_

> Withdraws one or more items from a container.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| containerWindow | <code>Window</code> |  | The open container Window to withdraw items from |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.itemName] | <code>string</code> |  | An Item to withdraw from the container. If not specified, will withdraw all Items |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Allow partial matches to itemName. For example, 'planks' will match any Item containing 'planks' in its name ('spruce_planks', 'oak_planks', etc.) |
| [options.quantity] | <code>number</code> |  | If itemName is specified, withdraw up to this quantity |


<br><a name="RGBot+withdrawItemsFromContainer"></a>

### rgBot.withdrawItemsFromContainer(containerWindow, [options]) ⇒ <code>Promise.&lt;boolean&gt;</code>
> Should be passed as the `useContainerFunction` to openAndUseContainer.  Withdraws the specified items from the container.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| containerWindow | <code>Window</code> |  | The open container Window |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.itemNames] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | An Items to act on in the container. |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Allow partial matches to itemNames. For example, '_planks' will match any Item containing '_planks' in its name ('spruce_planks', 'oak_planks', etc.) |
| [options.quantity] | <code>number</code> |  | Withdraw up to this quantity of each unique item name |


<br><a name="RGBot+depositItems"></a>

### ~~rgBot.depositItems(containerWindow, [options]) ⇒ <code>Promise.&lt;void&gt;</code>~~&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_`🚫 Deprecated`_

> Deposits one or more items into a container.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| containerWindow | <code>Window</code> |  | The open container Window to deposit items into |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.itemName] | <code>string</code> |  | An Item to deposit into the container. If not specified, will deposit all Items. |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Allow partial matches to itemName. For example, 'planks' will match any Item containing 'planks' in its name ('spruce_planks', 'oak_planks', etc.). |
| [options.quantity] | <code>number</code> |  | If itemName is specified, deposit up to this quantity. |


<br><a name="RGBot+depositItemsToContainer"></a>

### rgBot.depositItemsToContainer(containerWindow, [options]) ⇒ <code>Promise.&lt;boolean&gt;</code>
> Should be passed as the `useContainerFunction` to openAndUseContainer.   Deposits one or more items into the container.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| containerWindow | <code>Window</code> |  | The open container Window |
| [options] | <code>object</code> | <code>{}</code> | Optional parameters |
| [options.itemNames] | <code>string</code> | <code>&quot;[]&quot;</code> | The items to deposit into the container. If not specified, will deposit all Items. |
| [options.partialMatch] | <code>boolean</code> | <code>false</code> | Allow partial matches to itemNames. For example, '_planks' will match any Item containing '_planks' in its name ('spruce_planks', 'oak_planks', etc.). |
| [options.quantity] | <code>number</code> |  | If itemNames is specified, deposit up to this quantity of each itemName. |


<br><a name="RGBot+openContainer"></a>

### rgBot.openContainer(containerBlock) ⇒ <code>Promise.&lt;(Window\|null)&gt;</code>
> Open the specified container.  Works for chests and dispensers.
> This function does NOT approach the block.  It must already be in reach of the bot

**Returns**: <code>Promise.&lt;(Window\|null)&gt;</code> - The open containerWindow or null if unable to open.  

| Param | Type | Description |
| --- | --- | --- |
| containerBlock | <code>Block</code> | The chest or dispenser block to open |


<br><a name="RGBot+closeContainer"></a>

### rgBot.closeContainer(containerWindow) ⇒ <code>Promise.&lt;boolean&gt;</code>
> Close the specified container.  Works for any container window type.

**Returns**: <code>Promise.&lt;boolean&gt;</code> - True if the container was closed  

| Param | Type | Description |
| --- | --- | --- |
| containerWindow | <code>Window</code> | The window for the open container |


<br><a name="BestHarvestTool"></a>

## BestHarvestTool
> A result model for finding the best harvesting tool including the tool if found and the digTime for that tool/block combo.
> The digTime will be Infinity if the block is not diggable with any tool the bot has.


* [BestHarvestTool](#BestHarvestTool)
    * [new BestHarvestTool(tool, [digTime])](#new_BestHarvestTool_new)
    * [.tool](#BestHarvestTool+tool) : <code>Item</code> \| <code>null</code>
    * [.digTime](#BestHarvestTool+digTime) : <code>number</code>


<br><a name="new_BestHarvestTool_new"></a>

### new BestHarvestTool(tool, [digTime])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tool | <code>Item</code>, <code>null</code> |  | The Item best suited to dig the block.  Can be null if no tool is needed or if item is not diggable. |
| [digTime] | <code>number</code> | <code>Infinity</code> | Time in milliseconds to dig the block, Infinity if not diggable |


<br><a name="BestHarvestTool+tool"></a>

### bestHarvestTool.tool : <code>Item</code> \| <code>null</code>

<br><a name="BestHarvestTool+digTime"></a>

### bestHarvestTool.digTime : <code>number</code>

<br><a name="FindResult"></a>

## FindResult
> The result of a findEntities, findBlocks, findItemsOnGround operation.


* [FindResult](#FindResult)
    * [new FindResult(result, value)](#new_FindResult_new)
    * [.result](#FindResult+result) : <code>T</code>
    * [.value](#FindResult+value) : <code>number</code>


<br><a name="new_FindResult_new"></a>

### new FindResult(result, value)

| Param | Type | Description |
| --- | --- | --- |
| result | <code>T</code> | The result object |
| value | <code>number</code> | The value computed for this result during evaluation |


<br><a name="FindResult+result"></a>

### findResult.result : <code>T</code>

<br><a name="FindResult+value"></a>

### findResult.value : <code>number</code>

<br><a name="DEFAULT_FIND_BLOCKS_SORT_VALUE_FUNCTION"></a>

## DEFAULT\_FIND\_BLOCKS\_SORT\_VALUE\_FUNCTION(distance, [pointValue], [digTime]) ⇒ <code>number</code>
> MC character running speed is 5 blocks per second, up to 9 with soul speed 3.
> Distance to travel doesn't always mean flat ground running.
> Sometimes distance implies non-linear paths or block digging, but this default gives a reasonable estimate
> 
> After some experimentation/white-boarding, we found that pointValue-distance-digTime gives a reasonable balance
> of point return vs time to reach further blocks, which often involves digging other blocks first.

**Returns**: <code>number</code> - The sorting value computed.  The 'best' blocks should have lower sorting values  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| distance | <code>number</code> |  | Blocks away |
| [pointValue] | <code>number</code> | <code>0</code> | Score or Intrinsic value of the block being considered |
| [digTime] | <code>number</code> | <code>0</code> | milliseconds |


<br><a name="DEFAULT_FIND_ENTITIES_SORT_VALUE_FUNCTION"></a>

## DEFAULT\_FIND\_ENTITIES\_SORT\_VALUE\_FUNCTION(distance, pointValue, [health], [defense], [toughness]) ⇒ <code>number</code>
> For Reference In Minecraft: (damageTaken = damage * (1 - min(20, max(defense / 5, defense - damage / (toughness / 4 + 2)))) / 25)

**Returns**: <code>number</code> - The sorting value computed.  The 'best' target to attack should have lower sorting values  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| distance | <code>number</code> |  | Blocks away |
| pointValue | <code>number</code> |  | Score or Intrinsic value of the entity being considered |
| [health] | <code>number</code> | <code>10</code> | Health of the target (normally 0->20, passive NPCs have 10 health) |
| [defense] | <code>number</code> | <code>0</code> | Defense value of the target |
| [toughness] | <code>number</code> | <code>0</code> | Toughness value of the target |


<br><a name="DEFAULT_FIND_ITEMS_ON_GROUND_SORT_VALUE_FUNCTION"></a>

## DEFAULT\_FIND\_ITEMS\_ON\_GROUND\_SORT\_VALUE\_FUNCTION(distance, [pointValue]) ⇒ <code>number</code>
**Returns**: <code>number</code> - The sorting value computed.  The 'best' item to collect should have lower sorting values  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| distance | <code>number</code> |  | Blocks away |
| [pointValue] | <code>number</code> | <code>0</code> | Score or Intrinsic value of the block being considered |


<br><a name="FindEntitiesEntityValueFunction"></a>

## FindEntitiesEntityValueFunction ⇒ <code>number</code>

| Param | Type |
| --- | --- |
| entityName | <code>string</code> | 


<br><a name="FindEntitiesSortValueFunction"></a>

## FindEntitiesSortValueFunction ⇒ <code>number</code>

| Param | Type |
| --- | --- |
| distance | <code>number</code> | 
| pointValue | <code>number</code> | 
| health | <code>number</code> | 
| defense | <code>number</code> | 
| toughness | <code>number</code> | 


<br><a name="FindBlocksBlockValueFunction"></a>

## FindBlocksBlockValueFunction ⇒ <code>number</code>

| Param | Type |
| --- | --- |
| blockName | <code>string</code> | 


<br><a name="FindBlocksSortValueFunction"></a>

## FindBlocksSortValueFunction ⇒ <code>number</code>

| Param | Type |
| --- | --- |
| distance | <code>number</code> | 
| pointValue | <code>number</code> | 
| digTime | <code>number</code> | 


<br><a name="FindItemsOnGroundItemValueFunction"></a>

## FindItemsOnGroundItemValueFunction ⇒ <code>number</code>

| Param | Type |
| --- | --- |
| blockName | <code>string</code> | 


<br><a name="FindItemsOnGroundSortValueFunction"></a>

## FindItemsOnGroundSortValueFunction ⇒ <code>number</code>

| Param | Type |
| --- | --- |
| distance | <code>number</code> | 
| pointValue | <code>number</code> | 

