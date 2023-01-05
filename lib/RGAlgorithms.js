/**
 * MC character running speed is 5 blocks per second, up to 9 with soul speed 3.
 * Distance to travel doesn't always mean flat ground running.
 * Sometimes distance implies non-linear paths or block digging, but this default gives a reasonable estimate
 *
 * After some experimentation/white-boarding, we found that pointValue-distance-digTime gives a reasonable balance
 * of point return vs time to reach further blocks, which often involves digging other blocks first.
 *
 * @param {number} distance Blocks away
 * @param {number} [pointValue=0] Score or Intrinsic value of the block being considered
 * @param {number} [digTime=0] milliseconds
 * @returns {number} The sorting value computed.  The 'best' blocks should have lower sorting values
 */
const DEFAULT_FIND_BLOCKS_SORT_VALUE_FUNCTION = (distance, pointValue=0, digTime=0) => {return -1 * (pointValue - distance - digTime/1000)}

/**
 *
 * For Reference In Minecraft: (damageTaken = damage * (1 - min(20, max(defense / 5, defense - damage / (toughness / 4 + 2)))) / 25)
 *
 * @param {number} distance Blocks away
 * @param {number} pointValue Score or Intrinsic value of the entity being considered
 * @param {number} [health=10] Health of the target (normally 0->20, passive NPCs have 10 health)
 * @param {number} [defense=0] Defense value of the target
 * @param {number} [toughness=0] Toughness value of the target
 * @returns {number} The sorting value computed.  The 'best' target to attack should have lower sorting values
 */
// Note: 10 is the passive animal HP and half of max HP for entities
const DEFAULT_FIND_ENTITIES_SORT_VALUE_FUNCTION = (distance, pointValue, health=10, defense=0, toughness=0) => {return -1 * ((pointValue * 2) - (health / 2) - (distance * 1.1)) }

/**
 *
 * @param {number} distance Blocks away
 * @param {number} [pointValue=0] Score or Intrinsic value of the block being considered
 * @returns {number} The sorting value computed.  The 'best' item to collect should have lower sorting values
 */
const DEFAULT_FIND_ITEMS_ON_GROUND_SORT_VALUE_FUNCTION = (distance, pointValue=0) => {return -1 * ((pointValue * 2) - (distance * 1.1)) }

module.exports = { DEFAULT_FIND_BLOCKS_SORT_VALUE_FUNCTION, DEFAULT_FIND_ENTITIES_SORT_VALUE_FUNCTION, DEFAULT_FIND_ITEMS_ON_GROUND_SORT_VALUE_FUNCTION }