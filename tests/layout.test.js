import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

describe('UI layout', () => {
  test('start button text is Start', () => {
    const startBtn = document.getElementById('startGame');
    expect(startBtn.textContent.trim()).toBe('Start');
  });

  test('nextCanvas is before gameCanvas', () => {
    const container = document.querySelector('.board-container');
    const children = Array.from(container.children);
    const nextIndex = children.findIndex(el => el.id === 'nextCanvas');
    const gameIndex = children.findIndex(el => el.id === 'gameCanvas');
    expect(nextIndex).toBeLessThan(gameIndex);
  });

  test('title has fancy-title class', () => {
    const title = document.querySelector('h1');
    expect(title.classList.contains('fancy-title')).toBe(true);
  });

  test('start button is positioned after the board container within game-container', () => {
    const gameContainer = document.querySelector('.game-container');
    expect(gameContainer).not.toBeNull();
    const children = Array.from(gameContainer.children);
    const boardIndex = children.findIndex(el => el.classList.contains('board-container'));
    const buttonIndex = children.findIndex(el => el.id === 'startGame');
    expect(boardIndex).toBeLessThan(buttonIndex);
  });

  test('start button has increased font size in CSS', () => {
    const css = fs.readFileSync(path.resolve(__dirname, '../style.css'), 'utf8');
    const rule = /#startGame\s*{[^}]*font-size:\s*2rem;/;
    expect(rule.test(css)).toBe(true);
  });
});
