/**
 *
 * A result model for finding the best harvesting tool including the tool if found and the digTime for that tool/block combo.
 * The digTime will be Infinity if the block is not diggable with any tool the bot has.
 *
 * @param  {Item|null} tool The Item best suited to dig the block.  Can be null if no tool is needed or if item is not diggable.
 * @param  {number} digTime Time in seconds to dig the block, Infinity if not diggable
 */
class BestHarvestTool {
    constructor(tool, digTime = Infinity) {
        this.tool = tool
        this.digTime = digTime
    }

    /**
     * @type {Item}
     */
    tool;

    /**
     * @type {number}
     */
    digTime;
}

/**
 * The result of a findEntities, findBlocks, findItemsOnGround on ground operation.
 *
 * @param {Entity|Item|Block} result The result object
 * @param {number} value The value computed for this result during evaluation
 */
const FindResult = class {

    constructor(result, value) {
        this.result = result
        this.value = value
    }

    /**
     * @type {Entity|Item|Block}
     */
    result;

    /**
     * @type {number}
     */
    value;
}

module.exports = { BestHarvestTool, FindResult }