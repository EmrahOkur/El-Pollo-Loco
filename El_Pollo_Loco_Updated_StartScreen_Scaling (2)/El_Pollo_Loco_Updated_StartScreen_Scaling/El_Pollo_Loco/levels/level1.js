/**
 * Initializes the level by creating all necessary objects such as enemies, clouds, backgrounds, coins, and bottles.
 */
function initLevel() {
  level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackgrounds(),
    createCoins(),
    createBottles()
  );
}

/**
 * Creates and returns an array of enemies, including chickens, mini chickens, and the end boss.
 * @returns {Array} An array of enemies for the level.
 */
function createEnemies() {
  const enemies = [];
  const numberOfChickens = 3;
  const numberOfMiniChickens = 3;
  const totalEnemies = numberOfChickens + numberOfMiniChickens;
  const endbossPosition = 2500;
  const maxPosition = 2400;
  const spacing = Math.floor(maxPosition / totalEnemies);

  for (let i = 0; i < numberOfChickens; i++) {
    let randomOffset = Math.floor(Math.random() * 100) - 50;
    let positionX = (i + 1) * spacing + randomOffset;
    enemies.push(new Chicken(positionX));
  }

  for (let i = 0; i < numberOfMiniChickens; i++) {
    let randomOffset = Math.floor(Math.random() * 100) - 50;
    let positionX = (i + 1 + numberOfChickens) * spacing + randomOffset;
    enemies.push(new miniChicken(positionX));
  }

  enemies.push(new Endboss(endbossPosition));

  return enemies;
}

/**
 * Creates and returns an array of coins for the level.
 * @returns {Array} An array of coins with random positions.
 */
function createCoins() {
  const coins = [];
  const numberOfCoins = 10;
  const maxPosition = 2400;

  for (let i = 0; i < numberOfCoins; i++) {
    let randomX = Math.floor(Math.random() * (maxPosition - 100)) + 100;
    coins.push(new Coin(randomX));
  }

  return coins;
}

/**
 * Creates and returns an array of bottles for the level.
 * @returns {Array} An array of bottles with random positions.
 */
function createBottles() {
  const bottles = [];
  const numberOfBottles = 20;
  const maxPosition = 2400;

  for (let i = 0; i < numberOfBottles; i++) {
    let randomX = Math.floor(Math.random() * (maxPosition - 100)) + 100;
    bottles.push(new Bottle(randomX));
  }

  return bottles;
}

/**
 * Creates and returns an array of background objects for the level.
 * @returns {Array} An array of background objects representing different layers.
 */
function createBackgrounds() {
  return [
    new BackgroundObject("img/5_background/layers/air.png", -719),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -719),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),
    new BackgroundObject("img/5_background/layers/air.png", 0),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/air.png", 719),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/air.png", 1438),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 1438),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 1438),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 1438),
    new BackgroundObject("img/5_background/layers/air.png", 2157),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 2157),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 2157),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 2157),
  ];
}

/**
 * Creates and returns an array of clouds for the level.
 * @returns {Array} An array of cloud objects.
 */
function createClouds() {
  return [new Cloud(), new Cloud()];
}
