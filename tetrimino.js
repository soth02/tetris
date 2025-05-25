import { SHAPES } from './shapes.js'; // Import SHAPES from shapes.js

export class Tetrimino {
  constructor(type = 'I') { // Default to 'I' if no type is provided
    const shapeData = SHAPES[type] || SHAPES['I']; // Default to 'I' if type is unknown

    this.matrix = shapeData.matrix;
    this.color = shapeData.color;
    this.size = this.matrix.length; // Assuming square matrices from shapes.js
    this.x = 3; // As per test expectation
    this.y = 0; // As per test expectation
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
