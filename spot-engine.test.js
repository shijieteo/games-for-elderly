'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { WIDTH, HEIGHT, scenes, renderScene } = require('./spot-scenes.js');
const { COLUMNS, ROWS, createGame, cellFor, spot, inspectCell, hint, revealAnswers } = require('./spot-engine.js');
const centre = difference => {
  const [x, y, width, height] = difference.bounds;
  return [x + width / 2, y + height / 2];
};

test('all scenes have five independently rendered, reachable differences', () => {
  for (const [key, scene] of Object.entries(scenes)) {
    assert.equal(scene.differences.length, 5);
    assert.equal(new Set(scene.differences.map(difference => difference.id)).size, 5);
    const original = renderScene(key);
    assert.match(original, /viewBox="0 0 800 560"/);
    const rendered = new Set();
    for (const difference of scene.differences) {
      const [x, y, width, height] = difference.bounds;
      assert.ok(x >= 0 && y >= 0 && width > 0 && height > 0 && x + width <= WIDTH && y + height <= HEIGHT);
      const changed = renderScene(key, [difference.id]);
      assert.notEqual(changed, original);
      rendered.add(changed);
      const game = createGame(key);
      assert.deepEqual(spot(game, ...centre(difference)), { kind: 'found', id: difference.id });
    }
    assert.equal(rendered.size, 5);
  }
});

test('gentle games select exactly three unique changes, and omitted changes cannot be claimed', () => {
  for (const key of Object.keys(scenes)) {
    for (const random of [() => 0, () => 0.999]) {
      const game = createGame(key, 3, random);
      assert.equal(game.differences.length, 3);
      assert.equal(new Set(game.differences.map(difference => difference.id)).size, 3);
      const selected = game.differences.map(difference => difference.id);
      assert.notEqual(renderScene(key, selected), renderScene(key));
      assert.notEqual(renderScene(key, selected), renderScene(key, scenes[key].differences.map(difference => difference.id)));
      for (const omitted of scenes[key].differences.filter(difference => !selected.includes(difference.id))) {
        assert.equal(spot(game, ...centre(omitted)).kind, 'miss');
      }
    }
  }
});

test('invalid scenes, inherited names, counts and difference IDs are rejected', () => {
  for (const key of ['unknown', '__proto__', 'constructor']) {
    assert.throws(() => createGame(key));
    assert.throws(() => renderScene(key));
  }
  for (const count of [0, 1, 4, 6, '3']) assert.throws(() => createGame('home', count));
  assert.throws(() => renderScene('park', ['not-a-difference']));
});

test('a difference counts once even when the corresponding point in the other picture is selected', () => {
  const game = createGame();
  const difference = game.differences[0];
  assert.equal(spot(game, ...centre(difference)).kind, 'found');
  assert.equal(spot(game, ...centre(difference)).kind, 'duplicate');
  const cell = cellFor(difference);
  assert.equal(inspectCell(game, cell.column, cell.row).kind, 'duplicate');
  assert.deepEqual(game.found, [difference.id]);
});

test('misses and invalid coordinates leave all progress unchanged', () => {
  const game = createGame();
  assert.equal(spot(game, 0, 0).kind, 'miss');
  for (const [x, y] of [[-1, 20], [WIDTH + 1, 0], [10, HEIGHT + 1], [NaN, 20], [20, Infinity], ['100', 30]]) {
    assert.equal(spot(game, x, y).kind, 'ignored');
  }
  for (const [column, row] of [[-1, 0], [COLUMNS, 0], [0, ROWS], [0.5, 0], [0, NaN]]) {
    assert.equal(inspectCell(game, column, row).kind, 'ignored');
  }
  assert.deepEqual(game.found, []);
  assert.deepEqual(game.revealed, []);
  assert.equal(game.complete, false);
});

test('keyboard squares can find every difference in every scene and challenge', () => {
  for (const key of Object.keys(scenes)) {
    for (const count of [3, 5]) {
      const game = createGame(key, count);
      const cells = new Set();
      game.differences.forEach((difference, index) => {
        const cell = cellFor(difference);
        assert.match(cell.label, /^[A-D][1-3]$/);
        cells.add(cell.label);
        const outcome = inspectCell(game, cell.column, cell.row);
        assert.equal(outcome.kind, index === count - 1 ? 'complete' : 'found');
        assert.equal(outcome.id, difference.id);
      });
      assert.equal(cells.size, count);
      assert.equal(game.complete, true);
      assert.equal(game.found.length, count);
      assert.equal(spot(game, 0, 0).kind, 'ignored');
      assert.equal(inspectCell(game, 0, 0).kind, 'ignored');
      assert.equal(hint(game), null);
      assert.equal(revealAnswers(game), false);
    }
  }
});

test('hints cycle through unfound changes without awarding progress or showing answers', () => {
  const game = createGame('park');
  const seen = new Set();
  for (let index = 0; index < game.differences.length; index++) {
    const difference = hint(game);
    seen.add(difference.id);
    assert.equal(game.hintId, difference.id);
  }
  assert.equal(seen.size, 5);
  assert.deepEqual(game.found, []);
  assert.deepEqual(game.revealed, []);
  const current = hint(game);
  spot(game, ...centre(current));
  assert.equal(game.hintId, null);
  for (let index = 0; index < 8; index++) assert.notEqual(hint(game).id, current.id);
  assert.equal(game.found.length, 1);
});

test('revealing answers preserves independently found progress and locks the puzzle', () => {
  const game = createGame('home');
  spot(game, ...centre(game.differences[0]));
  hint(game);
  assert.equal(revealAnswers(game), true);
  assert.equal(game.found.length, 1);
  assert.equal(game.revealed.length, 4);
  assert.equal(new Set([...game.found, ...game.revealed]).size, 5);
  assert.equal(game.hintId, null);
  assert.equal(game.complete, true);
  assert.equal(spot(game, ...centre(game.differences[1])).kind, 'ignored');
  assert.equal(revealAnswers(game), false);
  assert.equal(hint(game), null);
});

test('a new puzzle has independent progress and hint state', () => {
  const previous = createGame('home', 3);
  spot(previous, ...centre(previous.differences[0]));
  hint(previous);
  revealAnswers(previous);
  const fresh = createGame('home', 3);
  assert.deepEqual(fresh.found, []);
  assert.deepEqual(fresh.revealed, []);
  assert.equal(fresh.hintId, null);
  assert.equal(fresh.complete, false);
});
