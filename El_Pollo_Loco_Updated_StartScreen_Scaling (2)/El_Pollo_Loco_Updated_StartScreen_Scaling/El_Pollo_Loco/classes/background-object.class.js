/**
 * Class representing a background object that extends the MovableObject class.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  /**
   * @type {number} The width of the background object.
   */
  width = 720;

  /**
   * @type {number} The height of the background object.
   */
  height = 480;

  /**
   * Creates a new background object.
   * @param {string} imagePath - The path to the background image.
   * @param {number} x - The x position of the background object.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);

    /**
     * @type {number} The x position of the background object.
     */
    this.x = x;

    /**
     * @type {number} The y position of the background object, calculated from the height of the canvas.
     */
    this.y = 480 - this.height;
  }
}
