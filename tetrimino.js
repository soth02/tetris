const SHAPES = [
  [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  [
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [1, 1, 1],
    [1, 0, 0],
    [0, 0, 0],
  ],
  [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 0],
  ],
];

const COLORS = ["#00f", "#f00", "#0f0", "#ff0", "#0ff", "#f0f", "#f80"];

export class Tetrimino {
  constructor() {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    this.matrix = SHAPES[shapeIndex];
    this.color = COLORS[shapeIndex];
    this.size = this.matrix.length;
    this.x = Math.floor((10 - this.size) / 2);
    this.y = 0;
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
