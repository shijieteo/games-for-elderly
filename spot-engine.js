/* Pure rules shared by pointer input, keyboard squares and the facilitator. */
(function (root) {
  'use strict';
  const { WIDTH, HEIGHT, scenes } = typeof module !== 'undefined' && module.exports
    ? require('./spot-scenes.js') : root.KakiSpotScenes;
  const COLUMNS = 4;
  const ROWS = 3;

  function createGame(scene = 'kopitiam', count = 5, random = Math.random) {
    if (!Object.hasOwn(scenes, scene) || ![3, 5].includes(count)) throw new Error('Choose a valid scene and 3 or 5 differences.');
    const pool = scenes[scene].differences.slice();
    for (let index = pool.length - 1; index > 0; index--) {
      const other = Math.floor(random() * (index + 1));
      [pool[index], pool[other]] = [pool[other], pool[index]];
    }
    const selected = new Set(pool.slice(0, count).map(difference => difference.id));
    return { scene, differences: scenes[scene].differences.filter(difference => selected.has(difference.id)), found: [], revealed: [], hintId: null, complete: false };
  }

  function cellFor(difference) {
    const [x, y, width, height] = difference.bounds;
    const column = Math.min(COLUMNS - 1, Math.floor((x + width / 2) / WIDTH * COLUMNS));
    const row = Math.min(ROWS - 1, Math.floor((y + height / 2) / HEIGHT * ROWS));
    return { column, row, label: `${String.fromCharCode(65 + column)}${row + 1}` };
  }

  function mark(game, difference) {
    if (!difference) return { kind: 'miss' };
    if (game.found.includes(difference.id)) return { kind: 'duplicate', id: difference.id };
    game.found.push(difference.id);
    if (game.hintId === difference.id) game.hintId = null;
    game.complete = game.found.length === game.differences.length;
    return { kind: game.complete ? 'complete' : 'found', id: difference.id };
  }

  function spot(game, x, y) {
    if (game.complete || !Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > WIDTH || y < 0 || y > HEIGHT) return { kind: 'ignored' };
    return mark(game, game.differences.find(difference => {
      const [left, top, width, height] = difference.bounds;
      return x >= left && x <= left + width && y >= top && y <= top + height;
    }));
  }

  function inspectCell(game, column, row) {
    if (game.complete || !Number.isInteger(column) || !Number.isInteger(row) || column < 0 || column >= COLUMNS || row < 0 || row >= ROWS) return { kind: 'ignored' };
    const inCell = game.differences.filter(difference => {
      const cell = cellFor(difference);
      return cell.column === column && cell.row === row;
    });
    return mark(game, inCell.find(difference => !game.found.includes(difference.id)) || inCell[0]);
  }

  function hint(game) {
    if (game.complete) return null;
    const remaining = game.differences.filter(difference => !game.found.includes(difference.id));
    const index = remaining.findIndex(difference => difference.id === game.hintId);
    const next = remaining[(index + 1) % remaining.length];
    game.hintId = next.id;
    return next;
  }

  function revealAnswers(game) {
    if (game.complete) return false;
    game.revealed = game.differences.filter(difference => !game.found.includes(difference.id)).map(difference => difference.id);
    game.hintId = null;
    game.complete = true;
    return true;
  }

  const api = { COLUMNS, ROWS, createGame, cellFor, spot, inspectCell, hint, revealAnswers };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KakiSpot = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
