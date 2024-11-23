/**
 * Represents the Endboss in the game.
 * Handles animations, movements, health management, and interactions with the character.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 55;
  energy = 100;
  evil_hurt_sound = new Audio('audio/evil_hurt.mp3');
  isHurtSoundPlayed = false;
  isDead = false;
  lastHurtSoundPlayed = 0;
  offset = {
    top: 70,
    bottom: 10,
    left: 60,
    right: 30,
  };

  IMAGES_ALERTA = [
    'img/4_enemie_boss_chicken/2_alert/G5.png',
    'img/4_enemie_boss_chicken/2_alert/G6.png',
    'img/4_enemie_boss_chicken/2_alert/G7.png',
    'img/4_enemie_boss_chicken/2_alert/G8.png',
    'img/4_enemie_boss_chicken/2_alert/G9.png',
    'img/4_enemie_boss_chicken/2_alert/G10.png',
    'img/4_enemie_boss_chicken/2_alert/G11.png',
    'img/4_enemie_boss_chicken/2_alert/G12.png',
  ];

  IMAGES_WALKING = [
    'img/4_enemie_boss_chicken/1_walk/G1.png',
    'img/4_enemie_boss_chicken/1_walk/G2.png',
    'img/4_enemie_boss_chicken/1_walk/G3.png',
    'img/4_enemie_boss_chicken/1_walk/G4.png',
  ];

  IMAGES_ATTACK = [
    'img/4_enemie_boss_chicken/3_attack/G13.png',
    'img/4_enemie_boss_chicken/3_attack/G14.png',
    'img/4_enemie_boss_chicken/3_attack/G15.png',
    'img/4_enemie_boss_chicken/3_attack/G16.png',
    'img/4_enemie_boss_chicken/3_attack/G17.png',
    'img/4_enemie_boss_chicken/3_attack/G18.png',
    'img/4_enemie_boss_chicken/3_attack/G19.png',
    'img/4_enemie_boss_chicken/3_attack/G20.png',
  ];

  IMAGES_HURT = [
    'img/4_enemie_boss_chicken/4_hurt/G21.png',
    'img/4_enemie_boss_chicken/4_hurt/G22.png',
    'img/4_enemie_boss_chicken/4_hurt/G23.png',
  ];

  ENDBOSS_DEAD = [
    'img/4_enemie_boss_chicken/5_dead/G24.png',
    'img/4_enemie_boss_chicken/5_dead/G25.png',
    'img/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  speed = 1.2;

  /**
   * Creates an instance of the Endboss and loads all related images.
   * Sets initial position, speed, and starts the animation and movement.
   */
  constructor() {
    super().loadImage(this.IMAGES_ALERTA[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERTA);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.ENDBOSS_DEAD);
    this.x = 2300;
    this.animate();
    this.movement();
  }

  /**
   * Animates the Endboss based on its current state (alert, walking, attacking, hurt, dead).
   */
  animate() {
    this.endbossAnimateInterval = setInterval(() => {
      if (this.energy <= 0 && !this.isDead) {
        this.speed = 0;
        this.isDead = true;
        this.playDeadAnimation();
      } else if (!this.isDead) {
        if (this.isHurt()) {
          this.playAnimation(this.IMAGES_HURT);
        } else if (this.distanceTooClose()) {
          this.playAnimation(this.IMAGES_ATTACK);
        } else if (
          this.checkDistancePepeEndboss() ||
          this.checkIfEndbossMoved()
        ) {
          this.playAnimation(this.IMAGES_WALKING);
          this.endbossBarSize();
        } else {
          this.playAnimation(this.IMAGES_ALERTA);
        }
      }
    }, 300);
    allIntervals.push(this.endbossAnimateInterval);
  }

  /**
   * Plays the dead animation of the Endboss when its energy reaches zero.
   * After the animation completes, it triggers the winner screen.
   */
  playDeadAnimation() {
    this.currentImage = 0;
    let deadAnimationInterval = setInterval(() => {
      this.playAnimation(this.ENDBOSS_DEAD);
      this.currentImage++;
      if (this.currentImage >= this.ENDBOSS_DEAD.length) {
        clearInterval(deadAnimationInterval);
        setTimeout(() => {
          this.triggerWinnerScreen();
        }, 2000);
      }
    }, 200);
  }

  /**
   * Triggers the winner screen when the Endboss is defeated.
   */
  triggerWinnerScreen() {
    gameWinnerScreen(false);
  }

  /**
   * Updates the size of the Endboss health bar.
   */
  endbossBarSize() {
    world.endbossBar.width = 250;
    world.endbossBarHeart.width = 80;
  }

  /**
   * Checks if the character is too close to the Endboss.
   * @returns {boolean} True if the character is within 150 units of the Endboss.
   */
  distanceTooClose() {
    return world.endboss.x - world.character.x <= 150;
  }

  /**
   * Handles the movement of the Endboss based on the character's position.
   * Adjusts the speed depending on the distance to the character.
   */
  movement() {
    this.endbossMovementInterval = setInterval(() => {
      if (this.energy > 0) {
        if (world.character.x < this.x) {
          this.moveLeft();
        } else {
          this.moveRight();
        }

        if (this.distanceTooClose()) {
          this.speed = 1.2;
        } else {
          this.speed = 0.9;
        }
      }
    }, 1000 / 60);
    allIntervals.push(this.endbossMovementInterval);
  }

  /**
   * Checks if the character is close enough to trigger the Endboss to start walking.
   * @returns {boolean} True if the character is near the Endboss.
   */
  checkDistancePepeEndboss() {
    return world.character.x > 1950;
  }

  /**
   * Checks if the Endboss has moved from its initial position or lost energy.
   * @returns {boolean} True if the Endboss has moved or lost energy.
   */
  checkIfEndbossMoved() {
    return world.endboss.x < 2300 || this.energy < 149;
  }

  /**
   * Reduces the Endboss's energy when it is hit and updates the health bar.
   * Plays a hurt sound if not muted.
   */
  hit() {
    let timeSinceLastHit = new Date().getTime() - this.lastHit;

    if (timeSinceLastHit > 500) {
      this.energy -= 15;
      if (this.energy < 0) {
        this.energy = 0;
      }
      this.lastHit = new Date().getTime();
      world.endbossBar.startUpdating();
      this.playHurtSound();
    }
  }

  /**
   * Plays the hurt sound effect when the Endboss is hit, unless muted or recently played.
   */
  playHurtSound() {
    let now = new Date().getTime();
    if (
      !this.isDead &&
      world.muted == false &&
      now - this.lastHurtSoundPlayed > 1000
    ) {
      this.evil_hurt_sound.volume = 1.0;
      this.evil_hurt_sound.play();
      this.lastHurtSoundPlayed = now;
    }
  }
}
