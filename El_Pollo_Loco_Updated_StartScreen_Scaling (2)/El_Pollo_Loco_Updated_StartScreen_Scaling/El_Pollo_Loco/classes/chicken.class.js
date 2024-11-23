/**
 * Class representing a chicken enemy, extending the MovableObject class.
 * @extends MovableObject
 */
class Chicken extends MovableObject {
  /**
   * @type {number} The vertical position of the chicken.
   */
  y = 360;

  /**
   * @type {number} The height of the chicken.
   */
  height = 55;

  /**
   * @type {number} The width of the chicken.
   */
  width = 70;

  /**
   * @type {Object} The offset values for collision detection.
   * @property {number} top - Top offset.
   * @property {number} bottom - Bottom offset.
   * @property {number} left - Left offset.
   * @property {number} right - Right offset.
   */
  offset = {
    top: 5,
    bottom: 5,
    left: 25,
    right: 25,
  };

  /**
   * @type {boolean} Indicates whether the chicken is dead.
   */
  isChickenDeath = false;

  /**
   * @type {number} The energy level of the chicken (used for health or damage).
   */
  energy = 2;

  /**
   * @type {string[]} Array of image paths for the chicken's walking animation.
   */
  CHICKEN_WALKING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  /**
   * @type {string[]} Array of image paths for the chicken's dead animation.
   */
  CHICKEN_DEAD = ['img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];

  /**
   * Creates a new chicken object, sets its position and speed, and starts its movement and animation.
   */
  constructor() {
    super().loadImage(this.CHICKEN_WALKING[0]);
    this.soundManager = soundManager;
    this.loadImages(this.CHICKEN_WALKING);
    this.loadImages(this.CHICKEN_DEAD);

    /**
     * @type {number} The x position of the chicken, randomized between 600 and 1400.
     */
    this.x = 600 + Math.random() * 800;

    /**
     * @type {number} The speed of the chicken, randomized between 0.3 and 0.8.
     */
    this.speed = 0.3 + Math.random() * 0.5;

    this.animate();
    this.chickenMovement();
  }

  /**
   * Manages the chicken's movement and animation, and handles the death state.
   */
  chickenMovement() {
    this.chickenMovementInterval = setInterval(() => {
      if (!this.isDead()) {
        this.moveLeft();
        this.playAnimation(this.CHICKEN_WALKING);
      } else {
        this.playAnimation(this.CHICKEN_DEAD);
        this.playDeathSound();
        this.clearIntervals();
      }
    }, 1000 / 60);
    allIntervals.push(this.chickenMovementInterval);
  }

  /**
   * Clears the movement and animation intervals of the chicken.
   */
  clearIntervals() {
    clearInterval(this.chickenMovementInterval);
    clearInterval(this.chickenAnimateInterval);
  }

  /**
   * Plays the death sound for the chicken if it has not been played yet.
   */
  playDeathSound() {
    if (!this.isChickenDeath) {
      if (!this.soundManager.muted) {
        this.soundManager.playSound('kill_chicken_sound', 0.2);
      }
      this.isChickenDeath = true;
    }
  }

  /**
   * Manages the chicken's animation state based on whether it is dead or walking.
   */
  animate() {
    this.chickenAnimateInterval = setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.CHICKEN_DEAD);
      } else {
        this.playAnimation(this.CHICKEN_WALKING);
      }
    }, 100);
    allIntervals.push(this.chickenAnimateInterval);
  }

  /**
   * Checks if the chicken is dead based on its energy level.
   * @returns {boolean} Whether the chicken is dead.
   */
  isDead() {
    return this.energy <= 0;
  }
}
