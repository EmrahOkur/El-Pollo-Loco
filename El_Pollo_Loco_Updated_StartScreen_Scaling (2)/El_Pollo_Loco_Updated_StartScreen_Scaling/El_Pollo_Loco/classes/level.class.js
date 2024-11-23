/**
 * Class representing a game level, including enemies, clouds, background objects, coins, and bottles.
 */
class Level {
  /**
   * @type {Array} An array of enemies in the level.
   */
  enemies;

  /**
   * @type {Array} An array of cloud objects in the level.
   */
  clouds;

  /**
   * @type {Array} An array of background objects in the level.
   */
  backgroundObjects;

  /**
   * @type {Array} An array of coin objects in the level.
   */
  coins;

  /**
   * @type {Array} An array of bottle objects in the level.
   */
  bottles;

  /**
   * @type {number} The x-coordinate where the level ends.
   */
  level_end_x = 2200;

  /**
   * Creates a new Level object, initializing the level with enemies, clouds, background objects, coins, and bottles.
   * @param {Array} enemies - The enemies present in the level.
   * @param {Array} clouds - The clouds present in the level.
   * @param {Array} backgroundObjects - The background objects present in the level.
   * @param {Array} coins - The coins present in the level.
   * @param {Array} bottles - The bottles present in the level.
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}
