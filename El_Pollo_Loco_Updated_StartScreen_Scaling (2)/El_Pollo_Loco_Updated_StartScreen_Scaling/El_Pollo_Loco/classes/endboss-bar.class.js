/**
 * Represents the health bar for the end boss.
 * Displays the end boss's current health status with an image that changes based on the percentage of health.
 * @extends DrawableObject
 */
class EndbossBar extends DrawableObject {
  IMAGES_BOSSHEALTH = [
    'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
    'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
    'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
    'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
    'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
    'img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
  ];

  IMAGES_BOSSHEART = [
    'img/7_statusbars/2_statusbar_endboss/blue/health_endboss.png',
  ];

  /**
   * Creates an instance of EndbossBar and initializes the health bar images and position.
   * Sets the initial health to 100%.
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES_BOSSHEART[0]);
    this.loadImages(this.IMAGES_BOSSHEALTH);
    this.x = 420;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  /**
   * Updates the health bar image based on the percentage of health.
   * @param {number} percentage - The current health percentage of the end boss.
   */
  setPercentage(percentage) {
    let index = this.resolveImageIndex(percentage);
    let path = this.IMAGES_BOSSHEALTH[index];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the index of the health bar image based on the percentage of health.
   * @param {number} percentage - The current health percentage.
   * @returns {number} The index of the corresponding health bar image.
   */
  resolveImageIndex(percentage) {
    if (percentage >= 100) {
      return 5;
    } else if (percentage > 80) {
      return 4;
    } else if (percentage > 60) {
      return 3;
    } else if (percentage > 40) {
      return 2;
    } else if (percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Updates the boss's health percentage based on its current energy.
   * Retrieves the current energy of the boss from the game world.
   */
  updateBossHealth() {
    let boss = world.level.enemies[6];
    let bossMaxHealth = 130;
    let healthPercentage = (boss.energy / bossMaxHealth) * 100;
    this.setPercentage(healthPercentage);
  }

  /**
   * Starts periodically updating the boss's health bar based on its health status.
   * The health bar is updated every 100 milliseconds.
   */
  startUpdating() {
    this.updateInterval = setInterval(() => {
      this.updateBossHealth();
    }, 100);
    allIntervals.push(this.updateInterval);
  }
}
