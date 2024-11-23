/**
 * Represents a throwable object, such as a bottle, in the game.
 * Handles throwing, animations, and collisions with enemies.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  currentImageIndex = 0;

  BOTTLE_ROTATION = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
  ];

  BOTTLE_SPLASH = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
  ];

  offset = {
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
  };

  /**
   * Creates an instance of ThrowableObject.
   * @param {number} x - The x-coordinate for the initial position.
   * @param {number} y - The y-coordinate for the initial position.
   */
  constructor(x, y) {
    super().loadImage(this.BOTTLE_ROTATION[0]);
    this.loadImages(this.BOTTLE_ROTATION);
    this.loadImages(this.BOTTLE_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.throw();
    this.animateRotation();
  }

  /**
   * Initiates the throw action, checking which direction the character is facing.
   * Removes a bottle from the collected bottles after the throw.
   */
  throw() {
    if (this.hasBottlesAndLooksRight()) {
      this.throwRightAnimation();
      world.collectedBottles.splice(0, 1);
    }
    if (this.hasBottlesAndLooksLeft()) {
      this.throwLeftAnimation();
      world.collectedBottles.splice(0, 1);
    }
  }

  /**
   * Checks if the player has bottles and is facing right.
   * @returns {boolean} True if the player has bottles and is facing right.
   */
  hasBottlesAndLooksRight() {
    return world.collectedBottles.length > 0 && !world.character.otherDirection;
  }

  /**
   * Checks if the player has bottles and is facing left.
   * @returns {boolean} True if the player has bottles and is facing left.
   */
  hasBottlesAndLooksLeft() {
    return world.collectedBottles.length > 0 && world.character.otherDirection;
  }

  /**
   * Handles the animation and movement of the object when thrown to the left.
   */
  throwLeftAnimation() {
    this.throwLeftAnimationInterval1 = setInterval(() => {
      this.playAnimation(this.BOTTLE_ROTATION);
    }, 150);
    allIntervals.push(this.throwLeftAnimationInterval1);
    this.speedY = -15;
    this.applyGravaityOtherDirection();
    this.throwLeftAnimationInterval2 = setInterval(() => {
      this.x -= 5;
    }, 1000 / 60);
    allIntervals.push(this.throwLeftAnimationInterval2);
  }

  /**
   * Handles the animation and movement of the object when thrown to the right.
   */
  throwRightAnimation() {
    this.throwRightAnimationInterval1 = setInterval(() => {
      this.playAnimation(this.BOTTLE_ROTATION);
    }, 150);
    allIntervals.push(this.throwRightAnimationInterval1);
    this.speedY = 18;
    this.applyGravaity();
    this.throwRightAnimationInterval2 = setInterval(() => {
      this.x += 8;
    }, 1000 / 60);
    allIntervals.push(this.throwRightAnimationInterval2);
  }

  /**
   * Stops all movement and rotation animations for the throwable object.
   */
  stopAllMovements() {
    clearInterval(this.throwRightAnimationInterval1);
    clearInterval(this.throwRightAnimationInterval2);
    clearInterval(this.throwLeftAnimationInterval1);
    clearInterval(this.throwLeftAnimationInterval2);
    clearInterval(this.rotationInterval);
  }

  /**
   * Starts the splash animation when the object hits something, stopping all other movements.
   */
  startSplashAnimation() {
    this.stopAllMovements();
    this.splashAnimationInterval = setInterval(() => {
      this.playAnimation(this.BOTTLE_SPLASH);
    }, 150);

    setTimeout(() => {
      clearInterval(this.splashAnimationInterval);
      world.removeThrowableObject(this);
    }, 1000);
  }

  /**
   * Animates the rotation of the bottle while it is being thrown.
   */
  animateRotation() {
    this.rotationInterval = setInterval(() => {
      this.currentImageIndex++;
      if (this.currentImageIndex >= this.BOTTLE_ROTATION.length) {
        this.currentImageIndex = 0;
      }
      this.loadImage(this.BOTTLE_ROTATION[this.currentImageIndex]);
    }, 150);
  }

  /**
   * Checks if the object collides with an enemy and starts the splash animation if a collision is detected.
   * @param {MovableObject} enemy - The enemy object to check collision with.
   */
  checkCollisionWithEnemy(enemy) {
    if (this.isColliding(enemy)) {
      this.startSplashAnimation();
    }
  }

  /**
   * Checks if the object is colliding with the enemy.
   * @param {MovableObject} enemy - The enemy to check collision with.
   * @returns {boolean} True if the object is colliding with the enemy.
   */
  isColliding(enemy) {
    return (
      this.x + this.width > enemy.x &&
      this.x < enemy.x + enemy.width &&
      this.y + this.height > enemy.y &&
      this.y < enemy.y + enemy.height
    );
  }
}
