# Framework Philosophies

This document outlines the goals, ideas, and roadmap for the rg-bot library (as well as our public-facing libraries in general). This is a living document, and we encourage players to participate and contribute to this document.

## Core Facts

The success of this library is dictated by its adherence to several core facts. Our goal is to make sure that these facts inform changes to the library. Any change that violates one or more of these facts must be re-evaluated.

Note that some of these facts require testing the library against real users. We don't need to evaluate these specific items every time a change occurs in the library, but we should make that evaluation often.

#### Fact 1: 80% of users with more than 6 months and less than 1 year of JavaScript experience should be able to articulate what a provided example / template does.
This fact ensures that the average new player with limited coding experience can engage with and understand bots on the Regression Games platform. This goal is measured by conducting interviews and surveys with players and potential players. The player should be able to _roughly describe_ the algorithm in a given example - we define this as understanding most of the algorithm. See the following example:

```javascript
const animalsToHunt = ["chicken", "pig", "cow", "sheep", "player"];

async function huntAnimals() {
    let nearbyAnimals = bot.findEntities({entityNames: animalsToHunt, maxDistance: 100});
    console.log(nearbyAnimals)
    if (nearbyAnimals.length == 0) {
        bot.chat("Could not find animals nearby... try wandering around first with `bot.wander()`")
        return
    }
    let animalToAttack = nearbyAnimals[0].result
    bot.chat("Hunting a " + animalToAttack.name)
    let attackCount = 0
    while (animalToAttack.isValid) 
        if (attackCount > 100) {
            bot.chat("Could not kill animal, stopping. Try hunting a new animal.")
            return;
        }
        await bot.attackEntity(animalToAttack)
    }
    bot.chat("Finished attacking the " + animalToAttack.type, ", moving on the next victim")
    let itemsOnGround = await bot.findAndCollectItemsOnGround()
    bot.chat(`Picked up ${itemsOnGround.length} items off the ground`)
    return await huntAnimals()
}

```

**Acceptable Answers**

```
This code finds animals such as chickens, hunts them, then picks up dropped items. If it can't find an animal, it instead wanders around until it can.
```
```
The bot finds animals, kills them, and then picks up items the animals drop.
```
```
The bot finds animals and kills them if it can find them (otherwise it doesn't do anything)
```

**Unacceptable Answers**
```
The bot hunts animals.  # This indicates they read the function name rather than understanding the code
```
```
I'm not sure, something about hunting
```
```
It finds animals and picks up items off the ground
```

**Measurement Approach:** Survey / Interview

**Desired sample size per test**: 10-15 users

**Most recent test results:** We should include the **average** of all the examples, and a table of the specific templates and examples (i.e. each example bot).

Example Prompt for the Interviewee
```
Please describe what this bot does. Try to use a full sentence, and cover (at a high level) the entire algorithm, not just one piece of it.
```

### Fact 2: 95% of users with great than 1 year of JavaScript experience should be able to articulate what the provided examples / templates do
This fact ensures that players with an intermediate level of coding experience can engage with and understand bots on the Regression Games platform. This goal is measured by conducting interviews and surveys with players and potential players. The player should be able to _roughly describe_ the algorithm in a given example -we define this as understanding most of the algorithm.

This test is the same as **Fact 1** but requires a higher success rate because the targeted players are expected to be more experienced with JavaScript.

**Measurement Approach:** Survey / Interview

**Desired sample size per test**: 10-15 users

**Most recent test results:** We should include the **average** of all the examples, and a table of the specific templates and examples (i.e. each example bot).


### Fact 3: A user that encounters an error within our library that they must recover from should immediately have one next step available to them
This fact ensures that a player never gets stuck due to a library-related issue. Players should be able to focus on their strategies rather than the intricacies of the library. When a fatal error occurs which requires handling in the user's code, we must attempt to point them in the right direction towards resolution. Examples of this include:
* Logging errors with a direct suggestion on how to fix the root cause of the error (e.g. "Invalid item name. Make sure that the item name is a valid id (e.g 'spruce_log') instead of a displayed name (e.g. 'Spruce Log'). The list of valid items can be found at https://...")
* Logging errors that include links to documentation for next steps (e.g. "... To see approaches to fix this, visit https://...")
* Explaining it more simple terms **why** it failed

Acceptable examples of providing recovery options to the user:
* [Explicitly stating that an error is expected](https://github.com/Regression-Games/RegressionBot/blob/e2bddcc37950a9f2ee5718ff5aa4dda549c5f008/lib/RGBot.js#L1088)
* [Stating why an action failed in simple terms](https://github.com/Regression-Games/RegressionBot/blob/e2bddcc37950a9f2ee5718ff5aa4dda549c5f008/lib/RGBot.js#L1102)

**Measurement Approach:** Internal Audit

**Most recent test results:** 

(Dec 27, 2022) Out of **17** explicit errors, **9** provided next steps or more info = **53%** success rate.

Failed cases:
* [When attacking an enemy fails](https://github.com/Regression-Games/RegressionBot/blob/e2bddcc37950a9f2ee5718ff5aa4dda549c5f008/lib/RGBot.js#L735)
* [When approaching a block fails](https://github.com/Regression-Games/RegressionBot/blob/e2bddcc37950a9f2ee5718ff5aa4dda549c5f008/lib/RGBot.js#L956)
* [When equipping a tool fails](https://github.com/Regression-Games/RegressionBot/blob/e2bddcc37950a9f2ee5718ff5aa4dda549c5f008/lib/RGBot.js#L1005)
* [When equipping a tool fails](https://github.com/Regression-Games/RegressionBot/blob/e2bddcc37950a9f2ee5718ff5aa4dda549c5f008/lib/RGBot.js#L1099)
* [When approaching and digging a block fails](https://github.com/Regression-Games/RegressionBot/blob/e2bddcc37950a9f2ee5718ff5aa4dda549c5f008/lib/RGBot.js#L1172)
* [When collecting an item fails](https://github.com/Regression-Games/RegressionBot/blob/e2bddcc37950a9f2ee5718ff5aa4dda549c5f008/lib/RGBot.js#L1332)
* [When dropping an item fails](https://github.com/Regression-Games/RegressionBot/blob/e2bddcc37950a9f2ee5718ff5aa4dda549c5f008/lib/RGBot.js#L1417)
* [Error when crafting an item](https://github.com/Regression-Games/RegressionBot/blob/e2bddcc37950a9f2ee5718ff5aa4dda549c5f008/lib/RGBot.js#L1498)

## Link to Survey for Fact Checking

https://d7y6yysps34.typeform.com/to/feG9z7kp

## Design Patterns

### Promises and Callbacks

Most of our functions and design patterns should use an `async/await` pattern for Promises when possible. For example:

**DON'T IMPLEMENT**
```javascript
bot.findAndDigBlock('dirt', (block) => {
    ...
})
```
**DON'T PROVIDE AS AN EXAMPLE**
```javascript
bot.findAndDigBlock('dirt')
  .then((block) => {...})
```

**DO**
```javascript
let block = await bot.findAndDigBlock('dirt')
```

In the case where a user-provided block of code **needs** to be passed to a library function, this is fine. This should really only happen when the operation requires some sort of context that needs managing (such as opening a chest, e.g. there is a before and after operation). For example:

**DO**
```javascript
bot.openAndInteractWithChest(chest, (chest) => {
    chest.place(...)
});
```

In the cases of these context-aware operations (opening and closing a chest, mounting and unmounting a horse, etc..) we should still provide the context-unaware functions, which the user can use themselves). These are useful for sending new players quick code examples that they can understand.

**ALSO DO**
```javascript
let openChest;
try {
    openChest = bot.openChest(chest);
    openChest.place(...)
} catch(err) {
    ...
} finally {
    bot.closeChest(openChest); // or openChest.close()
}
```

## Variable and Function Naming

Our preference is to be over-specifying and over-describing functions. In other words, we don't mind having longer function names if the code then becomes more readable and less ambiguous. We should strive to make sure that our code **does what it says, and says what it does.**

For example:

```
// Find and dig a block
bot.findAndDigBlock() // Good
bot.digBlock() // Bad

// Approach a player
bot.approachEntity() // Good
bot.approach() // Bad

// Clear the inventory of all items
bot.dropAllInventoryItems() // Good
bot.dropInventory() // Bad
```
