import { Board } from '../board.js';

describe('Board', () => {
  describe('constructor', () => {
    it('should initialize with the correct width and height', () => {
      const board = new Board(10, 20);
      expect(board.width).toBe(10);
      expect(board.height).toBe(20);
    });

    it('should create an empty grid', () => {
      const board = new Board(10, 20);
      expect(board.grid).toBeDefined();
      expect(board.grid.length).toBe(20); // height
      expect(board.grid[0].length).toBe(10); // width
      // Check if all cells are initialized to 0
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
          expect(board.grid[y][x]).toBe(0);
        }
      }
    });
  });

  describe('createEmptyGrid', () => {
    it('should create a grid with the board dimensions', () => {
      const board = new Board(5, 10); 
      // createEmptyGrid uses board.width and board.height internally
      const grid = board.createEmptyGrid(); 
      expect(grid.length).toBe(10); // board.height
      expect(grid[0].length).toBe(5); // board.width
    });

    it('should initialize all cells to 0 for a new board grid', () => {
      const board = new Board(5, 10);
      // The constructor calls createEmptyGrid, so board.grid is what we test
      const grid = board.grid;
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 5; x++) {
          expect(grid[y][x]).toBe(0);
        }
      }
    });
  });

  describe('hasCollision', () => {
    let board;
    // Add size property to mockTetrimino
    const mockTetrimino = {
      matrix: [[1, 1], [1, 1]], // A 2x2 square
      x: 0,
      y: 0,
      size: 2, // Explicitly define size
    };

    beforeEach(() => {
      board = new Board(10, 20);
    });

    it('should return false for no collision on an empty board', () => {
      const tetrimino = { ...mockTetrimino, x: 4, y: 10 };
      expect(board.hasCollision(tetrimino)).toBe(false);
    });

    it('should detect collision with the left boundary', () => {
      const tetrimino = { ...mockTetrimino, x: -1, y: 10 };
      expect(board.hasCollision(tetrimino)).toBe(true);
    });

    it('should detect collision with the right boundary', () => {
      // Tetrimino width is 2 (size), board width is 10. So x = 9 should collide.
      // boardX = x (9) + tetrimino.x (0) = 9. If matrix[y][1] is 1, then boardX becomes 9+1 = 10, which is >= this.width
      const tetrimino = { ...mockTetrimino, x: 9, y: 10 };
      expect(board.hasCollision(tetrimino)).toBe(true);
    });
    
    it('should not collide with the right boundary if tetrimino is just at the edge', () => {
      // Tetrimino width is 2, board width is 10. So x = 8 should not collide.
      // boardX = x (8) + tetrimino.x (0) = 8. If matrix[y][1] is 1, then boardX becomes 8+1=9, which is < this.width
      const tetrimino = { ...mockTetrimino, x: 8, y: 10 };
      expect(board.hasCollision(tetrimino)).toBe(false);
    });

    it('should detect collision with the bottom boundary', () => {
      // Tetrimino height is 2 (size), board height is 20. So y = 19 should collide.
      // boardY = y (19) + tetrimino.y (0) = 19. If matrix[1][x] is 1, then boardY becomes 19+1=20, which is >= this.height
      const tetrimino = { ...mockTetrimino, x: 4, y: 19 };
      expect(board.hasCollision(tetrimino)).toBe(true);
    });

    it('should not collide with the bottom boundary if tetrimino is just at the edge', () => {
      // Tetrimino height is 2, board height is 20. So y = 18 should not collide.
      const tetrimino = { ...mockTetrimino, x: 4, y: 18 };
      expect(board.hasCollision(tetrimino)).toBe(false);
    });

    it('should detect collision with existing blocks on the board', () => {
      // Place a block at (5, 15)
      board.grid[15][5] = 1;
      // mockTetrimino is 2x2. If its x=4, y=14:
      // matrix[1][1] (value 1) corresponds to board cell grid[14+1][4+1] = grid[15][5]
      const tetrimino = { ...mockTetrimino, x: 4, y: 14 }; 
      expect(board.hasCollision(tetrimino)).toBe(true);
    });

    it('should return false when tetrimino is within bounds and no overlap with existing blocks', () => {
      board.grid[15][5] = 1; // Existing block
      const tetrimino = { ...mockTetrimino, x: 0, y: 0 }; // Different position
      expect(board.hasCollision(tetrimino)).toBe(false);
    });

     it('should handle tetriminos with empty cells within their matrix', () => {
      const tetriminoWithEmptyCell = {
        matrix: [
          [0, 1, 0], 
          [1, 1, 1],
          [0, 0, 0] // Pad to make it square 3x3 for current board.js logic
        ],
        x: 0,
        y: 0,
        size: 3, 
      };
      board.grid[0][0] = 1; // Block that would collide with tetrimino[0][0] if it were solid
      expect(board.hasCollision(tetriminoWithEmptyCell)).toBe(false);
      
      board.grid[0][1] = 1; // Block that collides with tetriminoWithEmptyCell.matrix[0][1]
      expect(board.hasCollision(tetriminoWithEmptyCell)).toBe(true);
    });

    it('should detect collision when a rotated shape would pass through the left wall', () => {
      const board = new Board(10, 20);
      // Vertical I-shape, size 4. Active part is in column 1 of its matrix.
      // SHAPES.I.matrix = [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]
      const verticalIShape = {
        matrix: [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
        ],
        x: -1, // Positioned such that its '1's are at board column 0. (-1 + 1 = 0)
        y: 0,
        size: 4,
        color: 'cyan'
      };

      // Check that the initial position is NOT a collision.
      // boardX for matrix[0][1] = verticalIShape.x + 1 = -1 + 1 = 0. Valid.
      expect(board.hasCollision(verticalIShape)).toBe(false);

      // Hypothetically rotated I-shape (becomes horizontal)
      // SHAPES.I.matrix rotated = [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]]
      const rotatedHorizontalIShape = {
        matrix: [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        x: verticalIShape.x, // Still at x = -1
        y: verticalIShape.y, // Still at y = 0
        size: 4,
        color: 'cyan'
      };
      
      // Now, check collision for this rotated shape.
      // The '1' at rotatedHorizontalIShape.matrix[1][0] is at boardX = rotatedHorizontalIShape.x + 0 = -1.
      // This should be a collision.
      // This test will fail if hasCollision returns false.
      expect(board.hasCollision(rotatedHorizontalIShape)).toBe(true); 
    });

    it('BUG: should detect collision when a rotated I-shape is positioned to be through the left wall', () => {
      // This test is designed to FAIL, demonstrating the bug where hasCollision
      // might not correctly detect a collision for a shape whose x-coordinate
      // combined with its local block coordinates results in a negative board x-coordinate.
      const board = new Board(10, 20); // Standard board

      // Rotated I-shape (horizontal)
      const horizontalIShape = {
        matrix: [ // Standard 4x4 representation for I, horizontal
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        x: -1, // Positioned such that its first block (matrix[1][0]) is at board column -1
        y: 0,
        size: 4, // Correct size for the 4x4 matrix
        color: 'cyan'
      };
      
      // The '1' at horizontalIShape.matrix[1][0] is at boardX = horizontalIShape.x + 0 = -1.
      // This should be a collision.
      // We expect hasCollision to return true.
      // If the bug exists (hasCollision returns false), this assertion will fail.
      expect(board.hasCollision(horizontalIShape)).toBe(true); 
    });

    it('should correctly assess collision for an I-tetromino simulating rotation and wall kick', () => {
      const board = new Board(10, 20);

      // This matrix represents a horizontal I-shape (e.g., after a vertical I-shape rotates)
      const horizontalIShapeMatrix = [
        [0, 0, 0, 0],
        [1, 1, 1, 1], // Active blocks
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      const tetrimino = {
        matrix: horizontalIShapeMatrix,
        y: 0, // Positioned at the top
        size: 4,
        color: 'cyan' // Color doesn't affect collision
      };

      // Scenario 1: Rotated piece, no kick, results in collision with left wall.
      // If the piece (after rotation) were at x = -1.
      // The block at matrix[1][0] would be at boardX = -1 (tetrimino.x) + 0 (localX) = -1.
      tetrimino.x = -1;
      expect(board.hasCollision(tetrimino)).toBe(true);

      // Scenario 2: Rotated piece, with a kick of +1 to the right, avoids collision.
      // If the piece (after rotation and kick) is now at x = 0.
      // The block at matrix[1][0] would be at boardX = 0 (tetrimino.x) + 0 (localX) = 0.
      tetrimino.x = 0;
      expect(board.hasCollision(tetrimino)).toBe(false);
    });
  });

  describe('mergeTetrimino', () => {
    let board;
    // Add size property to mockTetrimino
    const mockTetrimino = {
      matrix: [[1, 1], [0, 1]], // An L-shape
      x: 3,
      y: 5,
      color: 3, // Example color
      size: 2, // Explicitly define size
    };

    beforeEach(() => {
      board = new Board(10, 20);
    });

    it('should correctly place the tetrimino blocks onto the board grid', () => {
      board.mergeTetrimino(mockTetrimino);

      // Check the cells where the tetrimino should be
      // Matrix: [[1, 1], [0, 1]] at x:3, y:5
      // (3,5) -> 1
      // (4,5) -> 1
      // (3,6) -> 0 (empty in tetrimino matrix)
      // (4,6) -> 1
      expect(board.grid[5][3]).toBe(mockTetrimino.color); // y, x
      expect(board.grid[5][4]).toBe(mockTetrimino.color); // y, x
      expect(board.grid[6][3]).toBe(0); // Should remain empty
      expect(board.grid[6][4]).toBe(mockTetrimino.color); // y, x
    });

    it('should not overwrite existing blocks if tetrimino matrix cell is 0', () => {
      board.grid[5][3] = 7; // Pre-existing block
      board.mergeTetrimino(mockTetrimino);

      expect(board.grid[5][3]).toBe(mockTetrimino.color); // Overwritten because tetrimino matrix is 1
      expect(board.grid[6][3]).toBe(0); // Tetrimino matrix is 0 here, so this cell is not touched by merge
      
      // Place another tetrimino that has an empty cell over an existing block
      const tetriminoWithEmptyCellForMerge = { // Use a different variable name
        matrix: [
          [0, 1], // 2x2
          [1, 1]
        ],
        x: 0,
        y: 0,
        color: 2,
        size: 2 // Add size
      };
      board.grid[0][0] = 5; // existing block
      board.mergeTetrimino(tetriminoWithEmptyCellForMerge);
      expect(board.grid[0][0]).toBe(5); // Should not be overwritten by tetrimino's empty cell
      expect(board.grid[0][1]).toBe(2); // Should be tetrimino color
    });
    
    it('should apply the tetrimino color to the board grid', () => {
      const coloredTetrimino = {
        matrix: [[1]],
        x: 0,
        y: 0,
        color: 5,
        size: 1 // Add size
      };
      board.mergeTetrimino(coloredTetrimino);
      expect(board.grid[0][0]).toBe(5);
    });
  });

  describe('clearLines', () => {
    let board;

    beforeEach(() => {
      board = new Board(5, 10); // Using a smaller board for easier testing
    });

    it('should return 0 and not change the grid if no lines are full', () => {
      board.grid[9] = [1, 1, 0, 1, 1]; // Almost full line at the bottom
      board.grid[8] = [0, 1, 1, 0, 0];
      const initialGrid = JSON.parse(JSON.stringify(board.grid));
      const linesCleared = board.clearLines();
      
      expect(linesCleared).toBe(0);
      expect(board.grid).toEqual(initialGrid);
    });

    it('should clear a single full line and shift rows down', () => {
      // Make the last row full
      board.grid[9] = [1, 2, 3, 4, 5]; 
      // Add some blocks in rows above
      board.grid[8] = [0, 6, 0, 6, 0];
      // board.grid[0] = [7, 7, 7, 7, 7]; // REMOVE this line to ensure only one line is cleared
      board.grid[0] = [7,0,7,0,7]; // Make this line not full

      const linesCleared = board.clearLines();
      expect(linesCleared).toBe(1);

      // Check that the last row is now the previous second to last row
      expect(board.grid[9]).toEqual([0, 6, 0, 6, 0]);
      // Check that the top row is now empty (shifted down)
      expect(board.grid[0]).toEqual([0,0,0,0,0]); // New empty line
      // Check that the previous top row is now at index 1 (if it wasn't cleared)
      expect(board.grid[1]).toEqual([7,0,7,0,7]); 
    });

    it('should clear multiple full lines and shift rows down correctly', () => {
      board = new Board(3, 5); //  width 3, height 5
      // grid:
      // [0,0,0]  y=0
      // [1,1,1]  y=1 (should be cleared)
      // [2,0,2]  y=2
      // [3,3,3]  y=3 (should be cleared)
      // [4,4,4]  y=4 (should be cleared)
      board.grid[0] = [0,0,0];
      board.grid[1] = [1,1,1]; 
      board.grid[2] = [2,0,2];
      board.grid[3] = [3,3,3];
      board.grid[4] = [4,4,4];
      
      const linesCleared = board.clearLines();
      expect(linesCleared).toBe(3);

      // Expected grid after clearing lines 1, 3, 4
      // [0,0,0] -> shifts to y=2 (was y=0)
      // [2,0,2] -> shifts to y=3 (was y=2)
      // New empty lines at y=0, y=1, y=4 (or rather y=0,1,2 after shift)
      // Actually, new empty lines will be at the top.
      // Expected:
      // [0,0,0] (new)
      // [0,0,0] (new)
      // [0,0,0] (new)
      // [0,0,0] (from original y=0)
      // [2,0,2] (from original y=2)

      expect(board.grid[0]).toEqual([0,0,0]); // New empty line
      expect(board.grid[1]).toEqual([0,0,0]); // New empty line
      expect(board.grid[2]).toEqual([0,0,0]); // New empty line
      expect(board.grid[3]).toEqual([0,0,0]); // Original y=0 shifted down
      expect(board.grid[4]).toEqual([2,0,2]); // Original y=2 shifted down
    });

    it('should clear all lines if the entire board is full', () => {
      board = new Board(2,3);
      board.grid[0] = [1,1];
      board.grid[1] = [2,2];
      board.grid[2] = [3,3];

      const linesCleared = board.clearLines();
      expect(linesCleared).toBe(3);
      
      // All lines should be empty
      expect(board.grid[0]).toEqual([0,0]);
      expect(board.grid[1]).toEqual([0,0]);
      expect(board.grid[2]).toEqual([0,0]);
    });

    it('should handle clearing lines when the top-most line is full', () => {
      board = new Board(2, 3);
      board.grid[0] = [1, 1]; // Top line is full
      board.grid[1] = [0, 2];
      board.grid[2] = [3, 0];

      const linesCleared = board.clearLines();
      expect(linesCleared).toBe(1);
      expect(board.grid[0]).toEqual([0,0]); // New empty line at the top
      expect(board.grid[1]).toEqual([0,2]); // Shifted from original y=1
      expect(board.grid[2]).toEqual([3,0]); // Shifted from original y=2
    });
  });
});
