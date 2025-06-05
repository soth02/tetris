import { Game } from "./game.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const nextCanvas = document.getElementById("nextCanvas");
const nextCtx = nextCanvas.getContext("2d");
const game = new Game(ctx, nextCtx);

document.getElementById("startGame").addEventListener("click", () => {
  game.start();
});

// game.start();
