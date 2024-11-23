/**
 * Represents a mini chicken enemy in the game.
 * Handles its movement, animations, random jumping, and death behavior.
 * @extends MovableObject
 */
class miniChicken extends MovableObject {
  y = 365;
  width = 50;
  height = 50;
  offset = {
    top: 5,
    bottom: 5,
    left: 20,
    right: 20,
  };
  energy = 2;
  isJumping = false;
  isMiniChickenDead = false;

  CHICKEN_SMALL_WALKING = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
  ];

  CHICKEN_SMALL_DEAD = ['img/3_enemies_chicken/chicken_small/2_dead/dead.png'];

  mini_chicken_sound = new Audio('audio/mini_chicken.mp3');

  /**
   * Creates an instance of miniChicken and initializes its position, speed, and animations.
   */
  constructor() {
    super().loadImage(this.CHICKEN_SMALL_WALKING[0]);
    this.loadImages(this.CHICKEN_SMALL_WALKING);
    this.loadImages(this.CHICKEN_SMALL_DEAD);
    this.x = 300 + Math.random() * 1000;
    this.speed = 0.7 + Math.random() * 0.5;
    this.animate();
    this.minichickenMovement();
    this.randomJump();
  }

  /**
   * Handles the movement of the mini chicken, moving it to the left unless it is dead or jumping.
   */
  minichickenMovement() {
    this.minichickenMovementInterval = setInterval(() => {
      if (!this.isDead() && !this.isJumping) {
        this.moveLeft();
      }
    }, 1000 / 60);
    allIntervals.push(this.minichickenMovementInterval);
  }

  /**
   * Plays the death sound when the mini chicken dies, ensuring the sound is only played once.
   */
  playDeathSound() {
    if (!this.isMiniChickenDead) {
      if (world.muted == false) {
        this.mini_chicken_sound.play();
        this.mini_chicken_sound.volume = 0.2;
      }
      this.isMiniChickenDead = true;
    }
  }

  /**
   * Animates the mini chicken based on its state (walking or dead).
   */
  animate() {
    this.minichickenAnimate = setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.CHICKEN_SMALL_DEAD);
        this.playDeathSound();
      } else {
        this.playAnimation(this.CHICKEN_SMALL_WALKING);
      }
    }, 100);
    allIntervals.push(this.minichickenAnimate);
  }

  /**
   * Makes the mini chicken randomly jump with a 50% chance.
   */
  randomJump() {
    this.randomJumpInterval = setInterval(() => {
      if (!this.isDead() && Math.random() < 0.5) {
        this.jump();
      }
    }, 1000);
    allIntervals.push(this.randomJumpInterval);
  }

  /**
   * Makes the mini chicken jump by applying an upward velocity and then applying gravity.
   */
  jump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.speedY = 10;
      this.applyGravity();
      setTimeout(() => {
        this.isJumping = false;
      }, 500);
    }
  }

  /**
   * Applies gravity to the mini chicken, making it fall after jumping.
   */
  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (this.isJumping) {
        this.y -= this.speedY;
        this.speedY -= 1;
      }
      if (this.y >= 365) {
        this.y = 365;
        this.speedY = 0;
        clearInterval(this.gravityInterval);
      }
    }, 1000 / 60);
  }
}
