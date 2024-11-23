/**
 * Manages all sound effects and background music in the game.
 * Handles playing, pausing, stopping, muting, and unmuting sounds.
 */
class SoundManager {
  constructor() {
    this.sounds = {};
    this.muted = false;

    // Initialize all sounds
    this.sounds.background_sound = new Audio('audio/El_Pollo_Loco.mp3');
    this.sounds.coin_sound = new Audio('audio/coin.mp3');
    this.sounds.broken_bottle_sound = new Audio('audio/throw.mp3');
    this.sounds.kill_chicken_sound = new Audio('audio/chicken.mp3');
    this.sounds.walking_sound = new Audio('audio/walking.mp3');
    this.sounds.jumping_sound = new Audio('audio/jump.mp3');
    this.sounds.hurt_sound = new Audio('audio/hurt.mp3');
    this.sounds.snore_sound = new Audio('audio/snore.mp3');
    this.sounds.endboss_sound = new Audio('audio/endboss.mp3');
    this.sounds.mini_chicken_sound = new Audio('audio/mini_chicken.mp3');
    this.sounds.evil_hurt_sound = new Audio('audio/evil_hurt.mp3');
    this.sounds.game_winner_sound = new Audio('audio/win.mp3');
    this.sounds.game_over_sound = new Audio('audio/game_over.mp3');
  }

  /**
   * Plays a specified sound if not muted.
   * @param {string} soundName - The name of the sound to play.
   * @param {number} [volume=1] - The volume level for the sound (default is 1).
   */
  playSound(soundName, volume = 1) {
    if (!this.muted && this.sounds[soundName]) {
      this.sounds[soundName].volume = volume;
      this.sounds[soundName].play();
    }
  }

  /**
   * Pauses the specified sound.
   * @param {string} soundName - The name of the sound to pause.
   */
  pauseSound(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].pause();
    }
  }

  /**
   * Stops the specified sound and resets its playback position.
   * @param {string} soundName - The name of the sound to stop.
   */
  stopSound(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].pause();
      this.sounds[soundName].currentTime = 0;
    }
  }

  /**
   * Mutes all sounds by pausing them.
   */
  mute() {
    this.muted = true;
    Object.values(this.sounds).forEach((sound) => {
      sound.pause();
    });
  }

  /**
   * Unmutes all sounds.
   */
  unmute() {
    this.muted = false;
  }
}
