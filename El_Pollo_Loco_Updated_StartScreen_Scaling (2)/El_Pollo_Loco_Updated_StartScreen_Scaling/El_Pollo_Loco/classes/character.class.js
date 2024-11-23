/**
 * Represents the main character in the game.
 * Handles character movement, animations, and interactions.
 * @extends MovableObject
 */
class Character extends MovableObject {
  height = 300;
  width = 120;
  y = 30;
  speed = 5;
  falling = false;
  offset = {
    top: 110,
    bottom: 8,
    left: 10,
    right: 20,
  };

  IMAGES_WALKING = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png',
  ];

  IMAGES_JUMPING = [
    'img/2_character_pepe/3_jump/J-31.png',
    'img/2_character_pepe/3_jump/J-32.png',
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png',
  ];

  IMAGES_DEAD = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
    'img/2_character_pepe/5_dead/D-57.png',
  ];

  IMAGES_HURT = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png',
  ];

  IMAGES_SLEEPING = [
    'img/2_character_pepe/1_idle/long_idle/I-11.png',
    'img/2_character_pepe/1_idle/long_idle/I-12.png',
    'img/2_character_pepe/1_idle/long_idle/I-13.png',
    'img/2_character_pepe/1_idle/long_idle/I-14.png',
    'img/2_character_pepe/1_idle/long_idle/I-15.png',
    'img/2_character_pepe/1_idle/long_idle/I-16.png',
    'img/2_character_pepe/1_idle/long_idle/I-17.png',
    'img/2_character_pepe/1_idle/long_idle/I-18.png',
    'img/2_character_pepe/1_idle/long_idle/I-19.png',
    'img/2_character_pepe/1_idle/long_idle/I-20.png',
  ];

  IMAGES_WAITING = [
    'img/2_character_pepe/1_idle/idle/I-1.png',
    'img/2_character_pepe/1_idle/idle/I-2.png',
    'img/2_character_pepe/1_idle/idle/I-3.png',
    'img/2_character_pepe/1_idle/idle/I-4.png',
    'img/2_character_pepe/1_idle/idle/I-5.png',
    'img/2_character_pepe/1_idle/idle/I-6.png',
    'img/2_character_pepe/1_idle/idle/I-7.png',
    'img/2_character_pepe/1_idle/idle/I-8.png',
    'img/2_character_pepe/1_idle/idle/I-9.png',
    'img/2_character_pepe/1_idle/idle/I-10.png',
  ];

  world;
  walking_sound = new Audio('audio/walking.mp3');
  jumping_sound = new Audio('audio/jump.mp3');
  broken_bottle_sound = new Audio('audio/throw.mp3');
  hurt_sound = new Audio('audio/hurt.mp3');
  snore_sound = new Audio('audio/snore.mp3');
  endboss_sound = new Audio('audio/endboss.mp3');

  /**
   * Initializes the character and loads images and sounds.
   * Also sets up animations and movement.
   */
  constructor() {
    super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_SLEEPING);
    this.loadImages(this.IMAGES_WAITING);
    this.animate();
    this.applyGravaity();
    this.pepeStandingStill();
    this.pepeMovement();
  }

  /**
   * Handles character movement based on keyboard input.
   */
  pepeMovement() {
    this.pepeMovementInterval = setInterval(() => {
      this.walking_sound.pause();
      if (this.keyboardRight()) {
        this.characterRightMovement();
      }
      if (this.keyboardLeft()) {
        this.characterLeftMovement();
      }
      if (this.keyboardJump()) {
        this.characterJumpMovement();
      }
      this.cameraFollowCharacter();
    }, 1000 / 60);
    allIntervals.push(this.pepeMovementInterval);
  }

  /**
   * Animates the character depending on its current state (e.g., dead, hurt, walking).
   */
  animate() {
    this.animatonCharacterInterval = setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
        this.triggerFallAfterDeath();
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else if (this.leftRightMoving()) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.pepeSleepingWaitingAnimations();
      }
    }, 100);
    allIntervals.push(this.animationCharacterInterval);
  }

  /**
   * Triggers the fall animation after the character dies.
   */
  triggerFallAfterDeath() {
    if (!this.falling) {
      setTimeout(() => {
        this.falling = true;
        this.applyGravityAfterDeath();
      }, 500);
    }
  }

  /**
   * Applies gravity to the character after death, causing it to fall.
   */
  applyGravityAfterDeath() {
    this.gravityAfterDeathInterval = setInterval(() => {
      this.y += 5;
      if (this.y > this.world.canvas.height) {
        clearInterval(this.gravityAfterDeathInterval);
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the character is dead.
   * @returns {boolean} True if the character's energy is 0 or less.
   */
  isDead() {
    return this.energy <= 0;
  }

  /**
   * Adjusts the camera to follow the character's movement.
   */
  cameraFollowCharacter() {
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Plays the sleeping or waiting animations when the character is inactive.
   */
  pepeSleepingWaitingAnimations() {
    this.inactivePepe = new Date().getTime() - this.lastPepeAction;

    let nearEndboss = this.world.endboss.x - this.x < 500;

    if (this.inactivePepe > 2000 && !this.world.muted && !nearEndboss) {
      this.playAnimation(this.IMAGES_SLEEPING);

      if (this.snore_sound.paused || this.snore_sound.currentTime === 0) {
        this.snore_sound.play();
        this.snore_sound.loop = true;
      }
    } else {
      this.playAnimation(this.IMAGES_WAITING);

      if (!this.snore_sound.paused) {
        this.snore_sound.pause();
        this.snore_sound.currentTime = 0;
      }
    }
  }

  /**
   * Tracks if the character is standing still and logs the last action time.
   */
  pepeStandingStill() {
    this.pepeStandingStillIntervall = setInterval(() => {
      if (this.noInteractionsWithPepe()) {
        this.lastPepeAction = new Date().getTime();
      }
    }, 100);
    allIntervals.push(this.pepeStandingStillInterval);
  }

  /**
   * Checks if the character is moving left or right.
   * @returns {boolean} True if the character is moving horizontally.
   */
  leftRightMoving() {
    return (
      this.world.keyboard.RIGHT ||
      (this.world.keyboard.LEFT && !this.isAboveGround())
    );
  }

  /**
   * Makes the character jump if not already in the air.
   */
  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 20;
    }
  }

  /**
   * Moves the character to the right.
   */
  characterRightMovement() {
    this.moveRight();
    this.otherDirection = false;
    this.playWalkingSound();
  }

  /**
   * Moves the character to the left.
   */
  characterLeftMovement() {
    this.moveLeft();
    this.otherDirection = true;
    this.playWalkingSound();
  }

  /**
   * Handles the jump movement and sound effects.
   */
  characterJumpMovement() {
    this.walking_sound.pause();
    if (world.muted == false) {
      this.jumping_sound.play();
      this.jumping_sound.volume = 0.5;
    }
    this.jump();
  }

  /**
   * Plays the walking sound if the game is not muted.
   */
  playWalkingSound() {
    if (!world.muted) {
      this.walking_sound.play();
    } else {
      this.walking_sound.pause();
    }
  }

  /**
   * Checks if the right arrow key is pressed.
   * @returns {boolean} True if the right arrow key is pressed.
   */
  keyboardRight() {
    return this.world.keyboard.RIGHT && this.x < this.world.endboss.x;
  }

  /**
   * Checks if the left arrow key is pressed.
   * @returns {boolean} True if the left arrow key is pressed.
   */
  keyboardLeft() {
    return this.world.keyboard.LEFT && this.x > 0;
  }

  /**
   * Checks if the jump key is pressed.
   * @returns {boolean} True if the jump key is pressed.
   */
  keyboardJump() {
    return this.world.keyboard.SPACE && !this.isAboveGround();
  }

  /**
   * Checks if there is any interaction with the character (movement, jump, hurt, etc.).
   * @returns {boolean} True if there is any interaction with the character.
   */
  noInteractionsWithPepe() {
    return (
      this.world.keyboard.RIGHT ||
      this.world.keyboard.LEFT ||
      this.world.keyboard.SPACE ||
      this.world.keyboard.ENTER ||
      this.isAboveGround() ||
      this.isHurt() ||
      this.isDead()
    );
  }
}
