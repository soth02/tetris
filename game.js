import { Board } from "./board.js";
import { Tetrimino } from "./tetrimino.js";

export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.board = new Board();
    this.tetrimino = new Tetrimino();
    this.gravityInterval = 500;
    this.lastDropTime = Date.now();
    this.boundKeyDownHandler = null;
    this.boundTouchStartHandler = null;
    this.boundTouchEndHandler = null;
    this.boundTouchMoveHandler = null;
    this.initControls();
  }

  start() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
    }
    this.initControls(); // Ensure controls are initialized for a new game
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
    if (this.boundKeyDownHandler) {
      this.removeControls();
    }

    let touchStartX, touchStartY, touchStartTime;
    let tapCount = 0;
    let lastTapTime = 0;
    let singleTapTimeout;

    this.boundKeyDownHandler = (event) => {
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
    };

    this.boundTouchMoveHandler = (event) => {
      event.preventDefault();
    };

    this.boundTouchStartHandler = (event) => {
      event.preventDefault();
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
      touchStartTime = Date.now(); // Record the touch start time
    };

    this.boundTouchEndHandler = (event) => {
      event.preventDefault();

      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;

      // Check for double-tap
      const currentTime = Date.now();
      if (currentTime - lastTapTime < 300) {
        // 300ms threshold for double-tap
        tapCount += 1;
      } else {
        tapCount = 1;
      }
      lastTapTime = currentTime;

      if (tapCount === 2) {
        clearTimeout(singleTapTimeout); // Cancel single tap action if double-tap detected
        while (!this.board.hasCollision(this.tetrimino, 0, 1)) {
          this.moveTetrimino(0, 1);
        }
      } else {
        singleTapTimeout = setTimeout(() => {
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
        }, 300); // 300ms delay to handle single tap actions
      }
    };

    document.addEventListener("keydown", this.boundKeyDownHandler);
    document.addEventListener("touchmove", this.boundTouchMoveHandler);
    document.addEventListener("touchstart", this.boundTouchStartHandler);
    document.addEventListener("touchend", this.boundTouchEndHandler);
  }

  removeControls() {
    if (this.boundKeyDownHandler) {
      document.removeEventListener("keydown", this.boundKeyDownHandler);
      this.boundKeyDownHandler = null;
    }
    if (this.boundTouchMoveHandler) {
      document.removeEventListener("touchmove", this.boundTouchMoveHandler);
      this.boundTouchMoveHandler = null;
    }
    if (this.boundTouchStartHandler) {
      document.removeEventListener("touchstart", this.boundTouchStartHandler);
      this.boundTouchStartHandler = null;
    }
    if (this.boundTouchEndHandler) {
      document.removeEventListener("touchend", this.boundTouchEndHandler);
      this.boundTouchEndHandler = null;
    }
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
      // --- BEGIN DEFENSIVE CLAMP ---
      // Find the lowest actual block in the tetrimino's matrix.
      let maxBlockMatrixY = 0; // Stores the largest y-index of a '1' in the matrix
      if (this.tetrimino && this.tetrimino.matrix && this.tetrimino.size > 0) {
        for (let r = 0; r < this.tetrimino.size; r++) {
          for (let c = 0; c < this.tetrimino.size; c++) {
            if (this.tetrimino.matrix[r][c]) {
              maxBlockMatrixY = Math.max(maxBlockMatrixY, r);
            }
          }
        }
      }

      // Calculate the absolute Y position of the lowest block of the tetrimino.
      const lowestBlockAbsY = this.tetrimino.y + maxBlockMatrixY;

      // If this lowest block is at or beyond the board height, adjust tetrimino.y.
      if (lowestBlockAbsY >= this.board.height) {
        const originalY = this.tetrimino.y;
        this.tetrimino.y = this.board.height - 1 - maxBlockMatrixY;
        // It's helpful to know if this clamp is ever triggered.
        console.warn(`Defensive clamp: Adjusted tetrimino.y from ${originalY} to ${this.tetrimino.y} before merge.`);
      }
      // --- END DEFENSIVE CLAMP ---
      this.board.mergeTetrimino(this.tetrimino);
      this.board.clearLines();
      this.tetrimino = new Tetrimino(); // New piece is spawned

      // --- BEGIN GAME OVER CHECK DIAGNOSTICS ---
      console.log("--- GAME OVER CHECK DIAGNOSTICS ---");
      console.log("New Tetrimino X:", this.tetrimino.x);
      console.log("New Tetrimino Y:", this.tetrimino.y);
      console.log("New Tetrimino Size:", this.tetrimino.size);
      console.log("New Tetrimino Matrix:", JSON.stringify(this.tetrimino.matrix));
      console.log("Board Grid (Top 4 Rows):");
      if (this.board && this.board.grid) {
        for (let i = 0; i < 4 && i < this.board.grid.length; i++) {
          console.log(`Row ${i}:`, JSON.stringify(this.board.grid[i]));
        }
      }
      // Note: The result of hasCollision might be different if the tetrimino chosen by new Tetrimino() is random
      // and happens to be one that fits vs one that doesn't.
      // For consistent diagnostics in a specific scenario, one might need to temporarily fix the new Tetrimino type.
      console.log("Upcoming Collision Check Result for New Tetrimino:", this.board.hasCollision(this.tetrimino));
      console.log("--- END DIAGNOSTICS ---");
      // --- END GAME OVER CHECK DIAGNOSTICS ---

      if (this.board.hasCollision(this.tetrimino)) { // GAME OVER CHECK
        this.gameOver();
      }
    }
  }

  rotateTetrimino() {
    // 1. Deep copy the current tetrimino matrix
    const originalMatrix = JSON.parse(JSON.stringify(this.tetrimino.matrix));
    // It's also good practice to save original x,y in case all kicks fail,
    // though the current problem description only asks to revert matrix.
    // const originalX = this.tetrimino.x;
    // const originalY = this.tetrimino.y;

    // 2. Call rotate() to change the tetrimino's internal matrix
    this.tetrimino.rotate();

    // 3. Check for collision at the new orientation without any kick
    if (!this.board.hasCollision(this.tetrimino, 0, 0)) { // Check with (0,0) offset
      return; // No collision, rotation successful
    }

    // 4. If there is a collision, attempt wall kicks.
    const kicks = [0, 1, -1, 2, -2]; // Kicks to try (0 is already checked effectively)

    for (const kickX of kicks) {
      // a. If kickX === 0, we've already checked this state (no offset) and it collided.
      if (kickX === 0) {
        continue;
      }

      // b. Check if (!this.board.hasCollision(this.tetrimino, kickX, 0))
      if (!this.board.hasCollision(this.tetrimino, kickX, 0)) {
        // c. If no collision with the kick, apply the kick and return
        this.tetrimino.x += kickX;
        return; // Rotation successful with kick
      }
    }

    // 5. If all kicks fail, revert the tetrimino's matrix to the originalMatrix
    this.tetrimino.matrix = originalMatrix;
    // If originalX/Y were saved:
    // this.tetrimino.x = originalX;
    // this.tetrimino.y = originalY;
  }

  gameOver() {
    alert("Game Over");
    cancelAnimationFrame(this.gameLoopId);
    this.gameLoopId = null;
    this.removeControls();
    this.board = new Board();
    this.tetrimino = new Tetrimino();
  }
}
