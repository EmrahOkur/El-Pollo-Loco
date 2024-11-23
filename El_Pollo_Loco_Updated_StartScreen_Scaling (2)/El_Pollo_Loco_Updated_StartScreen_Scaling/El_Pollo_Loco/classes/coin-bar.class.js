/**
 * Class representing the coin status bar, extending the DrawableObject class.
 * @extends DrawableObject
 */
class CoinBar extends DrawableObject {
  /**
   * @type {string[]} An array of image paths representing the different states of the coin bar.
   */
  IMAGES_COIN_BAR = [
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',
  ];

  /**
   * Creates a new CoinBar object, sets its position and size, and initializes the coin bar update mechanism.
   */
  constructor() {
    super().loadImage(this.IMAGES_COIN_BAR[0]);
    this.loadImages(this.IMAGES_COIN_BAR);

    /**
     * @type {number} The x position of the coin bar.
     */
    this.x = 20;

    /**
     * @type {number} The y position of the coin bar.
     */
    this.y = 50;

    /**
     * @type {number} The width of the coin bar.
     */
    this.width = 200;

    /**
     * @type {number} The height of the coin bar.
     */
    this.height = 60;

    this.setCoinbar();
  }

  /**
   * Preloads the images for the coin bar.
   * @param {string[]} images - An array of image paths to be preloaded.
   */
  loadImages(images) {
    images.forEach((img) => {
      const image = new Image();
      image.src = img;
    });
  }

  /**
   * Updates the coin bar status based on the number of collected coins at regular intervals.
   */
  setCoinbar() {
    this.setCoinbarInterval = setInterval(() => {
      super.setBar(world.collectedCoins.length, this.IMAGES_COIN_BAR);
    }, 100);
    allIntervals.push(this.setCoinbarInterval);
  }

  /**
   * Clears the interval for updating the coin bar.
   */
  clearCoinbarInterval() {
    if (this.setCoinbarInterval) {
      clearInterval(this.setCoinbarInterval);
    }
  }
}
