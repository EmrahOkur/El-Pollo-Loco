/**
 * Represents a drawable object in the game.
 * This class provides methods for loading images, drawing objects on the canvas, and handling animations.
 */
class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  /**
   * Loads a single image and sets it as the current image.
   * @param {string} path - The path of the image to load.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the current image on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The rendering context for the canvas.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Loads an array of images and caches them.
   * @param {string[]} array - An array of image paths to load.
   */
  loadImages(array) {
    array.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Sets an image from the image bar based on the given array.
   * @param {number} array - The value used to determine the image index.
   * @param {string[]} imageBar - The array of image paths representing the bar.
   */
  setBar(array, imageBar) {
    const index = Math.min(Math.floor(array / 2), imageBar.length - 1);
    this.loadImage(imageBar[index]);
  }

  /**
   * Adds multiple objects to the map by drawing them on the canvas.
   * @param {Object[]} objects - An array of objects to draw.
   * @param {CanvasRenderingContext2D} ctx - The rendering context for the canvas.
   */
  addObjectsToMap(objects, ctx) {
    objects.forEach((obj) => {
      this.addToMap(obj, ctx);
    });
  }

  /**
   * Draws a movable object on the map and flips the image if necessary.
   * @param {Object} movableObject - The object to draw.
   * @param {CanvasRenderingContext2D} ctx - The rendering context for the canvas.
   */
  addToMap(movableObject, ctx) {
    if (movableObject.otherDirection) {
      this.flipImage(movableObject, ctx);
    }
    movableObject.draw(ctx);

    if (movableObject.otherDirection) {
      this.flipImageBack(movableObject, ctx);
    }
  }

  /**
   * Flips the image horizontally for objects moving in the other direction.
   * @param {Object} movableObject - The object whose image will be flipped.
   * @param {CanvasRenderingContext2D} ctx - The rendering context for the canvas.
   */
  flipImage(movableObject, ctx) {
    ctx.save();
    ctx.translate(movableObject.width, 0);
    ctx.scale(-1, 1);
    movableObject.x = movableObject.x * -1;
  }

  /**
   * Restores the image flip after drawing the object.
   * @param {Object} movableObject - The object whose image will be restored.
   * @param {CanvasRenderingContext2D} ctx - The rendering context for the canvas.
   */
  flipImageBack(movableObject, ctx) {
    movableObject.x = movableObject.x * -1;
    ctx.restore();
  }

  /**
   * Sets the percentage for the health bar and updates the image accordingly.
   * @param {number} percentage - The current percentage of health.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_HEALTH[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the correct image index for the health bar based on the percentage.
   * @returns {number} The index of the health bar image.
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
