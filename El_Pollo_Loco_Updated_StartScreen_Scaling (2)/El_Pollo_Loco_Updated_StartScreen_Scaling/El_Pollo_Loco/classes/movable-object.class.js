/**
 * Represents a movable object in the game.
 * Handles movement, gravity, collisions, and animations.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  speed = 0.175;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /**
   * Reduces the object's energy when it is hit.
   * Sets the energy to 0 if it falls below 0, and updates the time of the last hit.
   */
  hit() {
    this.energy -= 10;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Moves the object slightly backward when it is hit, and makes it jump if the character is high enough.
   */
  hitsBack() {
    this.x -= 1;
    if (this.world.character.y >= 160) {
      this.speedY = 20;
    }
  }

  /**
   * Makes the object jump by applying upward velocity and playing a jump sound if not muted.
   */
  headJump() {
    if (world.muted == false) {
      this.reJump_sound.play();
      this.reJump_sound.volume = 0.2;
    }
    this.speedY = 10;
  }

  /**
   * Checks if the object has been hurt in the last 1000 milliseconds.
   * @returns {boolean} True if the object was hit recently.
   */
  isHurt() {
    let timePassedSinceLastHit = new Date().getTime() - this.lastHit;
    return timePassedSinceLastHit < 1000;
  }

  /**
   * Checks if the object is dead (energy is 0).
   * @returns {boolean} True if the object is dead.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Applies gravity to the object, making it fall when above the ground.
   */
  applyGravaity() {
    this.applyGravaityInterval = setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
    allIntervals.push(this.applyGravaityInterval);
  }

  /**
   * Applies gravity in the opposite direction, making the object rise when necessary.
   */
  applyGravaityOtherDirection() {
    this.applyGravaityOtherDirectionInterval = setInterval(() => {
      if (this.isAboveGround() || this.speedY < 0) {
        this.y += this.speedY;
        this.speedY += this.acceleration;
      }
    }, 1000 / 25);
    allIntervals.push(this.applyGravaityOtherDirectionInterval);
  }

  /**
   * Checks if the object is above the ground.
   * For throwable objects, it always returns true.
   * @returns {boolean} True if the object is above the ground.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 130;
    }
  }

  /**
   * Checks if the object is colliding with another movable object.
   * @param {MovableObject} mo - The other movable object to check collision with.
   * @returns {boolean} True if the objects are colliding.
   */
  isColliding(mo) {
    if (!mo || !this.width || !this.height || !mo.width || !mo.height)
      return false;
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  /**
   * Moves the object to the right.
   * Also sets the direction flag to false (indicating rightward movement).
   */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Plays the animation by cycling through a series of images.
   * @param {string[]} images - An array of image paths to cycle through.
   */
  playAnimation(images) {
    if (!this.currentImage) this.currentImage = 0;
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Makes the object jump by applying an upward velocity.
   */
  jump() {
    this.speedY = 30;
  }
}
