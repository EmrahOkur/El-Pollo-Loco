/**
 * Represents a collectible coin object in the game.
 * The coin has a random position and plays an animation.
 * @extends MovableObject
 */
class Coin extends MovableObject {
  width = 100;
  height = 100;
  offset = {
    top: 35,
    bottom: 35,
    left: 35,
    right: 35,
  };

  COIN_IMAGE = ['img/8_coin/coin_1.png', 'img/8_coin/coin_2.png'];

  /**
   * Creates an instance of Coin and sets its initial random position.
   */
  constructor() {
    super().loadImage(this.COIN_IMAGE[0]);
    this.loadImages(this.COIN_IMAGE);
    this.y = 160 + Math.random() * 100;
    this.x = 500 + Math.random() * 1800;
  }
}
