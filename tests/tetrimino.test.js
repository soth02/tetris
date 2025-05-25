import { Tetrimino } from '../tetrimino.js';
import { SHAPES } from '../shapes.js'; // Assuming SHAPES are used for constructor

describe('Tetrimino', () => {
  describe('constructor', () => {
    it('should create a tetrimino with a valid shape, color, and size from SHAPES', () => {
      // Example: Using the 'T' shape from SHAPES
      const shapeT = SHAPES['T'];
      const tetrimino = new Tetrimino('T'); // Assuming constructor takes shape type

      expect(tetrimino.matrix).toEqual(shapeT.matrix);
      expect(tetrimino.color).toEqual(shapeT.color);
      expect(tetrimino.size).toBe(shapeT.matrix.length); // Assuming size is derived from matrix length (square)
    });

    it('should initialize with correct default position (x, y)', () => {
      const tetrimino = new Tetrimino('L'); // Any shape type
      // Assuming default x is roughly center of board (e.g., boardWidth/2 - size/2)
      // and y is 0.
      // For now, let's check if they are numbers. Specific values depend on board context.
      // The current tetrimino.js constructor sets x = 3, y = 0.
      expect(tetrimino.x).toBe(3);
      expect(tetrimino.y).toBe(0);
    });

    it('should handle unknown shape types gracefully (e.g., default to a specific shape or throw error)', () => {
      // This depends on the implementation in tetrimino.js
      // Assuming it might default to 'I' or throw an error.
      // If it throws, we can test for that. If it defaults, test for the default.
      // Current tetrimino.js defaults to 'I' shape if type is not found.
      const tetrimino = new Tetrimino('UNKNOWN_SHAPE');
      const shapeI = SHAPES['I'];
      expect(tetrimino.matrix).toEqual(shapeI.matrix);
      expect(tetrimino.color).toEqual(shapeI.color);
      expect(tetrimino.size).toBe(shapeI.matrix.length);
    });
  });

  describe('rotate', () => {
    it('should rotate the matrix 90 degrees clockwise', () => {
      const tetrimino = new Tetrimino('L');
      // Original L:
      // [[0, 0, 1],
      //  [1, 1, 1],
      //  [0, 0, 0]]
      const initialMatrix = JSON.parse(JSON.stringify(tetrimino.matrix)); // Deep copy

      tetrimino.rotate();
      // Expected L after 1 rotation:
      // [[0, 1, 0],
      //  [0, 1, 0],
      //  [0, 1, 1]]
      // Rotated L:
      // [[0,0,0],
      //  [1,1,1],
      //  [1,0,0]]
      const expectedMatrix = [
        [0,0,0],
        [1,1,1],
        [1,0,0]
      ];
      expect(tetrimino.matrix).toEqual(expectedMatrix);
      expect(tetrimino.size).toBe(initialMatrix.length); // Size should remain the same
    });

    it('should rotate an I shape correctly (long bar)', () => {
      const tetrimino = new Tetrimino('I');
      // Original I (can vary, let's use a 4x4 representation from shapes.js):
      // [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]] (Horizontal)
      // or from current shapes.js:
      // [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]] (Vertical)
      // Let's assume the vertical one from shapes.js for Tetrimino('I')
      const initialMatrix = JSON.parse(JSON.stringify(tetrimino.matrix));

      tetrimino.rotate();
      // Expected I after 1 rotation (from shapes.js vertical I):
      // [[0,0,0,0],
      //  [0,0,0,0],
      //  [1,1,1,1],
      //  [0,0,0,0]]  -- This is if it were horizontal, let's trace carefully
      // shapes.js 'I':
      //  [0,1,0,0],
      //  [0,1,0,0],
      //  [0,1,0,0],
      //  [0,1,0,0],
      // Rotated:
      //  [0,0,0,0],
      //  [1,1,1,1],
      //  [0,0,0,0],
      //  [0,0,0,0]
      const expectedMatrix = [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
      ];
      expect(tetrimino.matrix).toEqual(expectedMatrix);
      expect(tetrimino.size).toBe(initialMatrix.length);
    });

    it('should return to original state after 4 rotations (for a non-symmetrical shape like L)', () => {
      const tetrimino = new Tetrimino('L');
      const originalMatrix = JSON.parse(JSON.stringify(tetrimino.matrix));

      tetrimino.rotate();
      tetrimino.rotate();
      tetrimino.rotate();
      tetrimino.rotate();

      expect(tetrimino.matrix).toEqual(originalMatrix);
    });
    
    it('should handle rotation of O shape (should not change)', () => {
      const tetrimino = new Tetrimino('O');
       // O shape:
      // [[1,1],
      //  [1,1]]
      const originalMatrix = JSON.parse(JSON.stringify(tetrimino.matrix));
      tetrimino.rotate();
      expect(tetrimino.matrix).toEqual(originalMatrix);
      expect(tetrimino.size).toBe(originalMatrix.length);
    });
  });

  describe('random shape generation', () => {
    it('should generate a variety of shapes when no type is specified', () => {
      const numberOfTrials = 100;
      const minimumUniqueShapesExpected = 5; // There are 7 shapes in SHAPES
      // If random selection is good, we expect to see at least 5 unique ones in 100 trials.
      // (Probability of not seeing a specific shape in 100 trials, if 1/7 chance: (6/7)^100 is very small)

      const uniqueColors = new Set();

      for (let i = 0; i < numberOfTrials; i++) {
        const tetrimino = new Tetrimino(); // Constructor with no argument
        uniqueColors.add(tetrimino.color);
      }

      // Check if the number of unique colors (representing unique shapes) meets the expectation
      expect(uniqueColors.size).toBeGreaterThanOrEqual(minimumUniqueShapesExpected);
    });
  });
});
