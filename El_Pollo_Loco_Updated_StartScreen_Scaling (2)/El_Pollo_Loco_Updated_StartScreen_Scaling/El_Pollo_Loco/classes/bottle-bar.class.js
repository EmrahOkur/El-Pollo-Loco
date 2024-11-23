/**
 * Class representing a bottle status bar that extends the DrawableObject class.
 * @extends DrawableObject
 */
class BottleBar extends DrawableObject {
  /**
   * @type {number} The interval for updating the bottle bar.
   */
  setBottlebarInterval;

  /**
   * @type {string[]} An array of image paths representing the bottle bar at different levels.
   */
  IMAGES_BOTTLEBAR = [
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
  ];

  /**
   * @type {number} The maximum number of bottles that can be collected.
   */
  maxBottles = 15;

  /**
   * Creates a new bottle bar object and initializes its position and appearance.
   */
  constructor() {
    super().loadImage(this.IMAGES_BOTTLEBAR[0]);
    this.loadImages(this.IMAGES_BOTTLEBAR);

    /**
     * @type {number} The x position of the bottle bar.
     */
    this.x = 20;

    /**
     * @type {number} The y position of the bottle bar.
     */
    this.y = 100;

    /**
     * @type {number} The width of the bottle bar.
     */
    this.width = 200;

    /**
     * @type {number} The height of the bottle bar.
     */
    this.height = 60;

    this.updateBottleBar(0);
  }

  /**
   * Updates the bottle bar based on the number of collected bottles.
   * @param {number} collectedBottles - The number of bottles collected by the player.
   */
  updateBottleBar(collectedBottles) {
    let percentage = (collectedBottles / this.maxBottles) * 100;
    this.updateBottleBarStatus(percentage);
  }

  /**
   * Updates the appearance of the bottle bar based on the percentage of bottles collected.
   * @param {number} percentage - The percentage of collected bottles.
   */
  updateBottleBarStatus(percentage) {
    if (percentage >= 100) {
      this.loadImage(this.IMAGES_BOTTLEBAR[5]);
    } else if (percentage >= 80) {
      this.loadImage(this.IMAGES_BOTTLEBAR[4]);
    } else if (percentage >= 60) {
      this.loadImage(this.IMAGES_BOTTLEBAR[3]);
    } else if (percentage >= 40) {
      this.loadImage(this.IMAGES_BOTTLEBAR[2]);
    } else if (percentage >= 20) {
      this.loadImage(this.IMAGES_BOTTLEBAR[1]);
    } else {
      this.loadImage(this.IMAGES_BOTTLEBAR[0]);
    }
  }
}
