export class Board {
  constructor(width = 10, height = 20) {
    this.width = width;
    this.height = height;
    this.cellSize = 32; // This could also be a parameter if needed
    this.grid = this.createEmptyGrid();
  }

  createEmptyGrid() {
    return Array.from({ length: this.height }, () => Array(this.width).fill(0));
  }

  draw(ctx) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x]) {
          ctx.fillStyle = this.grid[y][x];
          ctx.fillRect(
            x * this.cellSize,
            y * this.cellSize,
            this.cellSize,
            this.cellSize
          );
          ctx.strokeStyle = "#222";
          ctx.strokeRect(
            x * this.cellSize,
            y * this.cellSize,
            this.cellSize,
            this.cellSize
          );
        }
      }
    }
  }

  hasCollision(tetrimino, offsetX = 0, offsetY = 0) {
    for (let y = 0; y < tetrimino.size; y++) {
      for (let x = 0; x < tetrimino.size; x++) {
        if (tetrimino.matrix[y][x]) {
          const boardX = x + tetrimino.x + offsetX;
          const boardY = y + tetrimino.y + offsetY;

          if (
            boardX < 0 ||
            boardX >= this.width ||
            boardY >= this.height ||
            this.grid[boardY]?.[boardX]
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  mergeTetrimino(tetrimino) {
    for (let y = 0; y < tetrimino.size; y++) {
      for (let x = 0; x < tetrimino.size; x++) {
        if (tetrimino.matrix[y][x]) {
          this.grid[y + tetrimino.y][x + tetrimino.x] = tetrimino.color;
        }
      }
    }
  }

  clearLines() {
    let linesCleared = 0;
    outer: for (let y = this.height - 1; y >= 0; ) {
      for (let x = 0; x < this.width; x++) {
        if (!this.grid[y][x]) {
          y--;
          continue outer;
        }
      }

      this.grid.splice(y, 1);
      this.grid.unshift(Array(this.width).fill(0));
      linesCleared++;
      // y does not decrement here because the rows shifted down,
      // so the same y index needs to be checked again.
    }
    return linesCleared;
  }
}
