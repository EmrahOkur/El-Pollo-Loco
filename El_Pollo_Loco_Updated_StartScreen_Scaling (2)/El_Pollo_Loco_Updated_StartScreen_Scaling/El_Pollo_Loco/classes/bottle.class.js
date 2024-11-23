/**
 * Class representing a bottle object that extends the MovableObject class.
 * @extends MovableObject
 */
class Bottle extends MovableObject {
  /**
   * @type {number} The width of the bottle object.
   */
  width = 70;

  /**
   * @type {number} The height of the bottle object.
   */
  height = 70;

  /**
   * @type {Object} The offset values for the bottle object.
   * @property {number} top - The top offset.
   * @property {number} bottom - The bottom offset.
   * @property {number} left - The left offset.
   * @property {number} right - The right offset.
   */
  offset = {
    top: 15,
    bottom: 11,
    left: 25,
    right: 20,
  };

  /**
   * @type {string[]} An array of image paths for the bottle's appearance.
   */
  BOTTLE_IMAGE = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
  ];

  /**
   * @type {number} The index of the current image displayed for the bottle.
   */
  currentImageIndex = 0;

  /**
   * Creates a new bottle object, randomly positions it, and starts the rotation animation.
   */
  constructor() {
    super().loadImage(this.BOTTLE_IMAGE[0]);

    /**
     * @type {number} The x position of the bottle, randomized.
     */
    this.x = Math.random() * 2000;

    /**
     * @type {number} The y position of the bottle, fixed at 360.
     */
    this.y = 360;

    this.animateRotation();
  }

  /**
   * Animates the bottle rotation by changing the image at regular intervals.
   */
  animateRotation() {
    this.rotationInterval = setInterval(() => {
      this.currentImageIndex++;
      if (this.currentImageIndex >= this.BOTTLE_IMAGE.length) {
        this.currentImageIndex = 0;
      }
      this.loadImage(this.BOTTLE_IMAGE[this.currentImageIndex]);
    }, 800);
  }

  /**
   * Stops the bottle rotation animation by clearing the interval.
   */
  stopRotation() {
    clearInterval(this.rotationInterval);
  }
}
