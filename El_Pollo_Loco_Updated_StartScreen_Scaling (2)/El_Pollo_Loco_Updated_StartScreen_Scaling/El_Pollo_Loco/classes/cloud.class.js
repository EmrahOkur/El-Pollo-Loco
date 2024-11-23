/**
 * Class representing a cloud object that extends the MovableObject class.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  /**
   * @type {number} The vertical position of the cloud.
   */
  y = 0;

  /**
   * @type {number} The height of the cloud.
   */
  height = 480;

  /**
   * @type {number} The width of the cloud.
   */
  width = 1440;

  /**
   * Creates a new cloud object, sets its random horizontal position, and starts its animation.
   */
  constructor() {
    super().loadImage('img/5_background/layers/4_clouds/full.png');

    /**
     * @type {number} The x position of the cloud, randomized between 10 and 2010.
     */
    this.x = 10 + Math.random() * 2000;

    this.animate();
  }

  /**
   * Animates the cloud by moving it to the left at a set interval.
   */
  animate() {
    this.cloudAnimateInterval = setInterval(() => {
      this.moveLeft();
    }, 1000 / 30);
    allIntervals.push(this.cloudAnimateInterval);
  }

  /**
   * Clears the interval for cloud movement.
   */
  clearInterval() {
    clearInterval(this.cloudAnimateInterval);
  }
}
