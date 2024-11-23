/**
 * The main canvas element for rendering the game.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * The instance of the game world.
 * @type {World}
 */
let world;

/**
 * Instance of the keyboard input handler.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Instance of the sound manager for handling game sounds.
 * @type {SoundManager}
 */
let soundManager = new SoundManager();

/**
 * Flag indicating if the game is finished.
 * @type {boolean}
 */
let gameFinish = false;

/**
 * Array to keep track of all active intervals.
 * @type {Array<number>}
 */
let allIntervals = [];

/**
 * Starts the game by initializing the level and displaying the game elements.
 */
function startGame() {
  document.body.classList.add("game-active");
  document.getElementById("canvas").classList.remove("d-none");
  document.getElementById("muteButton").classList.remove("d-none");
  document.getElementById("fullscreenButton").classList.remove("d-none");

  if (window.innerWidth <= 1024) {
    document.getElementById("buttonsLeft").style.display = "flex";
    document.getElementById("buttonsRight").style.display = "flex";
  }

  document.getElementById("startScreen").classList.add("d-none");

  initLevel();
  init();
}

/**
 * Prevents default behavior for context menu and touch events on specific elements.
 */
const touchElements = document.querySelectorAll("button, img");

touchElements.forEach((el) => {
  el.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });

  el.addEventListener(
    "touchstart",
    function (event) {
      event.preventDefault();
    },
    { passive: false }
  );

  el.addEventListener(
    "touchend",
    function (event) {
      event.preventDefault();
    },
    { passive: false }
  );
});

/**
 * Opens the "How To Play" screen.
 */
function openHowToPlay() {
  document.getElementById("mainHTP").classList.remove("d-none");
}

/**
 * Closes the "How To Play" screen.
 */
function closeHowToPlay() {
  document.getElementById("mainHTP").classList.add("d-none");
}

/**
 * Initializes the game by setting up the canvas and creating the world instance.
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

/**
 * Displays the game winner screen, pauses all sounds, and hides game elements.
 * @param {boolean} muted - Whether the game sound is muted.
 */
function gameWinnerScreen(muted) {
  if (!gameFinish) {
    world.soundManager.pauseSound("walking_sound");
    world.soundManager.pauseSound("background_sound");
    world.stopEndbossSound();

    allIntervals.forEach(clearInterval);

    if (!muted && !keyboard.MUTE) {
      soundManager.playSound("game_winner_sound", 0.4);
    }

    const elementsToHide = [
      "endFullscreen",
      "fullscreenButton",
      "muteButton",
      "canvas",
      "endMuteButton",
      "buttonsLeft",
      "buttonsRight",
    ];

    elementsToHide.forEach((elementId) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.classList.add("d-none");
        if (elementId === "buttonsLeft" || elementId === "buttonsRight") {
          element.style.display = "none";
        }
      }
    });

    document.body.classList.remove("game-active");
    document.getElementById("gameWinnerScreen").classList.remove("d-none");
    gameFinish = true;
  }
}

/**
 * Displays the game over screen, pauses all sounds, and hides game elements.
 * @param {boolean} muted - Whether the game sound is muted.
 */
function gameOverScreen(muted) {
  if (!gameFinish) {
    // Stop all sounds and play character death animation
    stopIngameSounds();
    world.stopEndbossSound();
    world.character.playAnimation(world.character.IMAGES_DEAD);

    // After a delay of 2 seconds, show the Game Over screen
    setTimeout(() => {
      allIntervals.forEach(clearInterval);

      if (!muted && !soundManager.muted) {
        soundManager.stopSound("game_over_sound");
        soundManager.playSound("game_over_sound", 0.4);
      }

      // Hide elements
      document.body.classList.remove("game-active");
      [
        "endFullscreen",
        "fullscreenButton",
        "muteButton",
        "canvas",
        "buttonsLeft",
        "buttonsRight",
        "endMuteButton",
      ].forEach((id) => document.getElementById(id).classList.add("d-none"));

      document.getElementById("gameOverScreen").classList.remove("d-none");
      gameFinish = true;
    }, 2000);
  }
}

/**
 * Stops all in-game sounds and sets the mute flag to true.
 */
function stopIngameSounds() {
  keyboard.MUTE = true;
  world.soundManager.pauseSound("walking_sound");
  world.soundManager.pauseSound("background_sound");
}

/**
 * Returns to the start screen, resets the game state, and hides game-related elements.
 */
function backToStartScreen() {
  world.resetGame();
  keyboard.MUTE = false;
  document.body.classList.remove("game-active");
  [
    "canvas",
    "muteButton",
    "fullscreenButton",
    "gameOverScreen",
    "buttonsLeft",
    "buttonsRight",
    "gameWinnerScreen",
  ].forEach((id) => document.getElementById(id).classList.add("d-none"));
  document.getElementById("startScreen").classList.remove("d-none");
  gameFinish = false;
}

/**
 * Mutes the game sounds and updates the mute button visibility.
 */
function muteGame() {
  document.getElementById("endMuteButton").classList.remove("d-none");
  document.getElementById("muteButton").classList.add("d-none");
  soundManager.mute();
  keyboard.MUTE = true;
}

/**
 * Unmutes the game sounds and updates the mute button visibility.
 */
function endMuteGame() {
  document.getElementById("muteButton").classList.remove("d-none");
  document.getElementById("endMuteButton").classList.add("d-none");
  soundManager.unmute();
  keyboard.MUTE = false;
}

/**
 * Requests fullscreen mode for the game and updates fullscreen button visibility.
 */
function fullscreenGame() {
  let fullscreenElement = document.getElementById("fullscreen");

  if (fullscreenElement.requestFullscreen) {
    fullscreenElement.requestFullscreen();
  } else if (fullscreenElement.mozRequestFullScreen) {
    fullscreenElement.mozRequestFullScreen();
  } else if (fullscreenElement.webkitRequestFullscreen) {
    fullscreenElement.webkitRequestFullscreen();
  } else if (fullscreenElement.msRequestFullscreen) {
    fullscreenElement.msRequestFullscreen();
  }

  document.getElementById("fullscreenButton").classList.add("d-none");
  document.getElementById("endFullscreen").classList.remove("d-none");
}

/**
 * Exits fullscreen mode for the game and updates fullscreen button visibility.
 */
function endFullscreenGame() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }

  document.getElementById("fullscreenButton").classList.remove("d-none");
  document.getElementById("endFullscreen").classList.add("d-none");
}

/**
 * Simulates a key press event, either keydown or keyup.
 * @param {number} keyCode - The keycode of the key to simulate.
 * @param {string} type - The type of event ("keydown" or "keyup").
 */
function simulateKeyPressed(keyCode, type) {
  let e = document.createEvent("HTMLEvents");
  e.initEvent(type, true, false);
  e.keyCode = keyCode;
  document.dispatchEvent(e);

  const isPressed = type === "keydown";

  updateKeyState(e.keyCode, isPressed);
}

/**
 * Restarts the game by resetting the game state and reinitializing the level.
 */
function restartGame() {
  world.resetGame();
  gameFinish = false;
  keyboard.MUTE = false;

  document.body.classList.add("game-active");
  ["canvas", "muteButton", "fullscreenButton"].forEach((id) =>
    document.getElementById(id).classList.remove("d-none")
  );
  ["startScreen", "gameOverScreen", "gameWinnerScreen"].forEach((id) =>
    document.getElementById(id).classList.add("d-none")
  );

  ["buttonsLeft", "buttonsRight"].forEach((id) => {
    document.getElementById(id).style.display =
      window.innerWidth <= 1024 ? "flex" : "none";
  });

  initLevel();
  init();
}

/**
 * Updates the state of a key based on whether it is pressed or released.
 * @param {number} keyCode - The keycode of the key to update.
 * @param {boolean} isPressed - Whether the key is pressed.
 */
function updateKeyState(keyCode, isPressed) {
  switch (keyCode) {
    case 39:
    case 68:
      keyboard.RIGHT = isPressed;
      break;
    case 37:
    case 65:
      keyboard.LEFT = isPressed;
      break;
    case 32:
      keyboard.SPACE = isPressed;
      break;
    case 13:
      keyboard.ENTER = isPressed;
      break;
  }
}

/**
 * Event listener for keydown events to update key states.
 */
window.addEventListener("keydown", (e) => {
  updateKeyState(e.keyCode, true);
});

/**
 * Event listener for keyup events to update key states.
 */
window.addEventListener("keyup", (e) => {
  updateKeyState(e.keyCode, false);
});
