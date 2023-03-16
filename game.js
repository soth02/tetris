import { Board } from "./board.js";
import { Tetrimino } from "./tetrimino.js";

export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.board = new Board();
    this.tetrimino = new Tetrimino();
    this.gravityInterval = 500;
    this.lastDropTime = Date.now();
    this.initControls();
  }

  start() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
    }
    this.board = new Board();
    this.tetrimino = new Tetrimino();
    this.gameLoop();
  }

  gameLoop() {
    this.update();
    this.draw();
    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  initControls() {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
          this.rotateTetrimino();
          break;
        case "ArrowDown":
          this.moveTetrimino(0, 1);
          break;
        case "ArrowLeft":
          this.moveTetrimino(-1, 0);
          break;
        case "ArrowRight":
          this.moveTetrimino(1, 0);
          break;
      }
    });

    let touchStartX, touchStartY;

    document.addEventListener("touchstart", (event) => {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    });

    document.addEventListener("touchend", (event) => {
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          this.moveTetrimino(1, 0);
        } else {
          this.moveTetrimino(-1, 0);
        }
      } else {
        if (deltaY > 0) {
          this.moveTetrimino(0, 1);
        } else {
          this.rotateTetrimino();
        }
      }
    });
  }

  update() {
    if (Date.now() - this.lastDropTime > this.gravityInterval) {
      this.moveTetrimino(0, 1);
      this.lastDropTime = Date.now();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.board.draw(this.ctx);
    this.tetrimino.draw(this.ctx);
  }

  moveTetrimino(deltaX, deltaY) {
    if (!this.board.hasCollision(this.tetrimino, deltaX, deltaY)) {
      this.tetrimino.x += deltaX;
      this.tetrimino.y += deltaY;
    } else if (deltaY > 0) {
      this.board.mergeTetrimino(this.tetrimino);
      this.board.clearLines();
      this.tetrimino = new Tetrimino();

      if (this.board.hasCollision(this.tetrimino)) {
        this.gameOver();
      }
    }
  }

  rotateTetrimino() {
    const oldRotation = this.tetrimino.rotation;
    this.tetrimino.rotate();
    if (this.board.hasCollision(this.tetrimino)) {
      this.tetrimino.rotation = oldRotation;
    }
  }

  gameOver() {
    alert("Game Over");
    this.board = new Board();
    this.tetrimino = new Tetrimino(this.ctx);
  }
}
