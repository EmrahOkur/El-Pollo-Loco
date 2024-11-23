/**
 * Represents the heart icon in the end boss health bar.
 * This icon shows the health status of the end boss.
 * @extends DrawableObject
 */
class EndbossBarHeart extends DrawableObject {
  IMAGES_BOSSHEART = [
    'img/7_statusbars/2_statusbar_endboss/blue/health_endboss.png',
  ];

  /**
   * Creates an instance of EndbossBarHeart and initializes its position and size.
   */
  constructor() {
    super().loadImage(this.IMAGES_BOSSHEART[0]);
    this.x = 420;
    this.y = 5;
    this.width = 60;
    this.height = 60;
  }
}
