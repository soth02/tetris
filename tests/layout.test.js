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
});
