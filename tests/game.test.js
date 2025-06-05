import { Game } from '../game.js';
import { jest } from '@jest/globals';

// Helper to create a dummy canvas context
function createDummyCtx() {
  return {
    canvas: { width: 320, height: 640 },
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    clearRect: jest.fn(),
  };
}

describe('Game next piece preview', () => {
  let dummyCtx;
  beforeEach(() => {
    // Minimal DOM stubs for event listeners
    global.document = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    global.requestAnimationFrame = jest.fn();
    global.cancelAnimationFrame = jest.fn();
    global.alert = jest.fn();
    dummyCtx = createDummyCtx();
  });

  afterEach(() => {
    delete global.document;
    delete global.requestAnimationFrame;
    delete global.cancelAnimationFrame;
    delete global.alert;
  });

  it('initializes with a nextTetrimino', () => {
    const game = new Game(dummyCtx);
    expect(game.nextTetrimino).toBeDefined();
  });

  it('uses nextTetrimino when current piece locks', () => {
    const game = new Game(dummyCtx);
    const firstNext = game.nextTetrimino;

    // Force collision on downward movement
    game.board.hasCollision = jest
      .fn()
      .mockReturnValueOnce(true)
      .mockReturnValue(false);
    game.board.mergeTetrimino = jest.fn();
    game.board.clearLines = jest.fn();

    game.moveTetrimino(0, 1);

    expect(game.tetrimino).toBe(firstNext);
    expect(game.nextTetrimino).not.toBe(firstNext);
  });
});
