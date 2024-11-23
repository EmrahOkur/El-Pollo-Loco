/**
 * Represents the keyboard input for the game.
 * Tracks the state of specific keys to control the character's movement and actions.
 * @extends MovableObject
 */
class Keyboard extends MovableObject {
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  SPACE = false;
  D = false;

  /**
   * Initializes the Keyboard class to track the state of movement and action keys.
   */
  constructor() {
    super();
  }
}
