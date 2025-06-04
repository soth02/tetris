import { SHAPES } from './shapes.js'; // Import SHAPES from shapes.js

export class Tetrimino {
  constructor(type) { // Removed default value 'I'
    let chosenType;

    if (type === undefined) {
      // No argument was passed
      const shapeKeys = Object.keys(SHAPES);
      chosenType = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
    } else if (SHAPES[type]) {
      // Type was provided and it's a valid key in SHAPES
      chosenType = type;
    } else {
      // Type was provided but it's not a valid key in SHAPES
      console.warn(`Unknown tetrimino type: ${type}, defaulting to 'I'.`); // Optional warning
      chosenType = 'I'; // Default to 'I'
    }

    const shapeData = SHAPES[chosenType];

    this.matrix = shapeData.matrix;
    this.color = shapeData.color;
    this.size = this.matrix.length; // Assuming square matrices from shapes.js
    this.x = 3; // As per test expectation (or Math.floor((10 - this.size) / 2) for centering on a 10-wide board)
    // Start completely above the visible board so even the tallest piece is hidden
    this.y = -this.size;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.matrix[y][x]) {
          ctx.fillRect((this.x + x) * 32, (this.y + y) * 32, 32, 32);
          ctx.strokeStyle = "#222";
          ctx.strokeRect((this.x + x) * 32, (this.y + y) * 32, 32, 32);
        }
      }
    }
  }

  rotate() {
    const newMatrix = Array.from({ length: this.size }, () =>
      Array(this.size).fill(0)
    );

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        newMatrix[x][this.size - 1 - y] = this.matrix[y][x];
      }
    }

    this.matrix = newMatrix;
  }
}
