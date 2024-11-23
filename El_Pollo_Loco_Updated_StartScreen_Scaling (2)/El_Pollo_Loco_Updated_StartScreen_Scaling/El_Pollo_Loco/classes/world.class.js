/**
 * Manages the game world, including the character, enemies, and objects.
 */
class World {
  character = new Character();
  endboss = new Endboss();
  level = level1;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  healthBar = new HealthBar();
  bottleBar = new BottleBar();
  endbossBar = new EndbossBar();
  endbossBarHeart = new EndbossBarHeart();
  coinBar = new CoinBar();
  throwableObjects = [];
  collectedBottles = [];
  bottlesToRemove = [];
  brockenBottle = [];
  collectedCoins = [];
  muted = false;
  collisionTimepassed;
  lastCollision;
  endbossSoundPlaying = false;
  drawableObject = new DrawableObject();

  /**
   * Initializes the world with the canvas and keyboard.
   * @param {HTMLCanvasElement} canvas
   * @param {Keyboard} keyboard
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.soundManager = new SoundManager();
    this.draw();
    this.setWorld();
    this.run();
    this.collectObjects();
  }

  /** Checks the mute state */
  isMuted() {
    this.isMutedIntervall = setInterval(() => {
      this.muted = this.keyboard.MUTE;
    }, 1000 / 60);
    allIntervals.push(this.isMutedIntervall);
  }

  /** Removes a throwable object */
  removeThrowableObject(bottle) {
    let index = this.throwableObjects.indexOf(bottle);
    if (index > -1) this.throwableObjects.splice(index, 1);
  }

  /** Collects coins and bottles */
  collectObjects() {
    this.collectObjectsInterval = setInterval(() => {
      this.checkCollectCoin();
      this.checkCollectBottle();
      this.checkCollisionThrowObject();
      this.checkCollisions();
    }, 1000 / 50);
    allIntervals.push(this.collectObjectsInterval);
  }

  /** Checks for collected coins */
  checkCollectCoin() {
    this.level.coins.forEach((coin, indexCoins) => {
      if (this.character.isColliding(coin)) {
        if (!this.muted) this.soundManager.playSound('coin_sound', 0.2);
        this.collectedCoins.push(coin);
        this.level.coins.splice(indexCoins, 1);
      }
    });
  }

  /** Checks for collected bottles */
  checkCollectBottle() {
    this.level.bottles.forEach((bottle, indexBottles) => {
      if (
        this.character.isColliding(bottle) &&
        this.collectedBottles.length < this.bottleBar.maxBottles
      ) {
        this.collectedBottles.push(bottle);
        this.level.bottles.splice(indexBottles, 1);
        this.bottleBar.updateBottleBar(this.collectedBottles.length);
      }
    });
  }

  /** Sets the world for the character */
  setWorld() {
    this.character.world = this;
  }

  /** Main game loop */
  run() {
    this.runInterval = setInterval(() => {
      this.checkThrowObjects();
      this.isMuted();
      this.backgroundMusic();
      this.checkGameEnd();
      this.checkEndbossVisibility();
    }, 150);
    allIntervals.push(this.runInterval);
  }

  /** Plays background music */
  backgroundMusic() {
    if (!this.endbossSoundPlaying && !this.muted) {
      this.soundManager.playSound('background_sound', 0.03);
    } else {
      this.soundManager.pauseSound('background_sound');
    }
  }

  /** Checks if the player throws an object */
  checkThrowObjects() {
    if (this.pressEnterAndArrayLength()) this.throwBottle();
  }

  /** Throws a bottle */
  throwBottle() {
    if (this.pressEnterAndArrayLength()) {
      let bottle = new ThrowableObject(
        this.character.x + 10,
        this.character.y + 100,
      );
      this.throwableObjects.push(bottle);
      if (this.collectedBottles.length > 0) {
        this.collectedBottles.pop();
        this.bottleBar.updateBottleBar(this.collectedBottles.length);
      }
      if (!this.muted) this.soundManager.playSound('broken_bottle_sound');
    }
  }

  /** Returns true if Enter is pressed and bottles are available */
  pressEnterAndArrayLength() {
    return this.keyboard.ENTER && this.collectedBottles.length > 0;
  }

  /** Checks collisions for throwable objects */
  checkCollisionThrowObject() {
    let bottlesToRemove = [];
    this.throwableObjects.forEach((bottle) => {
      this.checkBottleCollision(bottle, bottlesToRemove);
    });
    this.scheduleBottleRemoval(bottlesToRemove);
  }

  /** Checks bottle collisions with enemies and ground */
  checkBottleCollision(bottle, bottlesToRemove) {
    this.level.enemies.forEach((enemy) => {
      if (this.bottleHitsEnemy(enemy, bottle)) {
        this.handleBottleCollision(bottle, bottlesToRemove);
        enemy.hit();
      }
    });
    if (this.bottleHitsGround(bottle)) {
      this.handleBottleCollision(bottle, bottlesToRemove);
    }
  }

  /** Handles bottle collision */
  handleBottleCollision(bottle, bottlesToRemove) {
    bottle.startSplashAnimation();
    setTimeout(() => bottlesToRemove.push(bottle), 1000);
  }

  /** Schedules bottle removal */
  scheduleBottleRemoval(bottlesToRemove) {
    setTimeout(() => {
      bottlesToRemove.forEach((bottle) => this.removeThrowableObject(bottle));
    }, 1000);
  }

  /** Checks if bottle hits an enemy */
  bottleHitsEnemy(enemy, bottle) {
    return bottle.isColliding(enemy);
  }

  /** Checks if bottle hits the ground */
  bottleHitsGround(bottle) {
    return bottle.y > 330 && bottle.y < 370;
  }

  /** Checks for collisions with enemies */
  checkCollisions() {
    this.level.enemies.forEach((enemy, indexEnemy) => {
      if (this.aboutGroundCollideEnemies(enemy, indexEnemy)) {
        this.handleKillingHeadJump(indexEnemy);
      } else if (
        this.collideEnemy(enemy, indexEnemy) &&
        !this.character.isHurt()
      ) {
        this.handleEnemyCollision(enemy);
      }
    });
  }

  /** Handles head jump on enemies */
  handleKillingHeadJump(indexEnemy) {
    this.killingHeadJump(indexEnemy);
    this.level.enemies[indexEnemy].energy = 0;
  }

  /** Handles collision with enemies */
  handleEnemyCollision(enemy) {
    this.character.energy -= enemy instanceof Endboss ? 40 : 10;
    this.character.energy = Math.max(this.character.energy, 0);
    if (!this.muted) this.soundManager.playSound('hurt_sound', 0.5);
    this.healthBar.setPercentage((this.character.energy / 100) * 100);
    this.character.lastHit = new Date().getTime();
    if (this.character.energy <= 0) gameOverScreen(this.muted);
  }

  /** Checks visibility of the endboss */
  checkEndbossVisibility() {
    if (this.endboss.x - this.character.x < 500 && this.endboss.energy > 0) {
      if (this.soundManager.sounds.endboss_sound.paused && !this.muted) {
        this.soundManager.pauseSound('background_sound');
        this.soundManager.sounds.endboss_sound.currentTime = 0;
        this.soundManager.playSound('endboss_sound', 0.2);
        this.endbossSoundPlaying = true;
      }
    } else {
      this.stopEndbossSound();
    }
  }

  /** Stops the endboss sound */
  stopEndbossSound() {
    this.soundManager.stopSound('endboss_sound');
    this.endbossSoundPlaying = false;
  }

  /** Checks if the character collides with an enemy */
  collideEnemy(enemy) {
    return this.character.isColliding(enemy) && enemy.energy > 0;
  }

  /** Checks head jump collision with enemies */
  aboutGroundCollideEnemies(enemy, indexEnemy) {
    return (
      this.character.isAboveGround() &&
      this.character.isColliding(enemy) &&
      this.isNotEndboss(enemy) &&
      this.level.enemies[indexEnemy].energy > 1
    );
  }

  /** Checks if enemy is not endboss */
  isNotEndboss(enemy) {
    return enemy != this.level.enemies[6];
  }

  /**
   * Handles character's jump when landing on an enemy's head.
   * Sets the enemy's energy to zero, indicating the enemy is killed.
   * @param {number} indexEnemy - The index of the enemy in the enemies array.
   */
  killingHeadJump(indexEnemy) {
    let enemy = this.level.enemies[indexEnemy];
    this.character.y = enemy.y - this.character.height;
    this.character.speedY = -5;
    setTimeout(() => {
      enemy.energy = 0;
      this.character.speedY = 0;
    }, 100);
  }

  /**
   * Draws all game objects on the canvas, including background objects, character, enemies, health bars, etc.
   * Uses the camera position to adjust the view.
   * Uses requestAnimationFrame for continuous drawing of the game screen.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.drawableObject.addObjectsToMap(this.level.backgroundObjects, this.ctx);
    this.drawableObject.addObjectsToMap(this.level.clouds, this.ctx);
    this.drawableObject.addObjectsToMap(this.level.coins, this.ctx);
    this.drawableObject.addObjectsToMap(this.level.bottles, this.ctx);
    this.drawableObject.addObjectsToMap(this.level.enemies, this.ctx);
    this.drawableObject.addObjectsToMap(this.throwableObjects, this.ctx);
    this.drawableObject.addObjectsToMap(this.brockenBottle, this.ctx);
    this.drawableObject.addToMap(this.character, this.ctx);

    this.ctx.translate(-this.camera_x, 0);
    this.drawableObject.addToMap(this.healthBar, this.ctx);

    if (this.endboss.x - this.character.x < 500) {
      this.drawableObject.addToMap(this.endbossBar, this.ctx);
    }

    this.drawableObject.addToMap(this.bottleBar, this.ctx);
    this.drawableObject.addToMap(this.coinBar, this.ctx);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Checks the conditions for ending the game.
   * Ends the game when either the end boss is dead or the character's energy reaches zero.
   */
  checkGameEnd() {
    this.checkGameEndInterval = setInterval(() => {
      if (this.level.enemies[6].energy <= 0 && !this.level.enemies[6].isDead) {
        this.level.enemies[6].isDead = true;
        this.level.enemies[6].playDeadAnimation();
      } else if (this.character.energy <= 0) {
        gameOverScreen(this.muted);
      }
    }, 200);
    allIntervals.push(this.checkGameEndInterval);
  }

  /**
   * Resets the game state by clearing collected items and throwable objects.
   * Prepares the game for a new session.
   */
  resetGame() {
    this.throwableObjects = [];
    this.collectedBottles = [];
    this.collectedCoins = [];
  }
}
