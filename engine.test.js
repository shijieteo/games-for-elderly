'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { themes, createGame, selectCard, resolveMismatch } = require('./engine.js');

test('every theme and size makes a deck with exactly two of each selected picture', () => {
  for (const theme of Object.keys(themes)) {
    for (const size of [8, 12, 16, 24]) {
      const game = createGame(theme, size);
      assert.equal(game.cards.length, size);
      assert.equal(new Set(game.cards.map(card => card.id)).size, size);
      const counts = new Map();
      for (const card of game.cards) counts.set(card.key, (counts.get(card.key) || 0) + 1);
      assert.equal(counts.size, size / 2);
      assert.ok([...counts.values()].every(count => count === 2));
    }
  }
});

test('invalid settings and inherited property names are rejected', () => {
  for (const theme of ['unknown', 'constructor', '__proto__']) {
    assert.throws(() => createGame(theme, 8));
  }
  for (const size of [0, 7, 10, 100, '8']) assert.throws(() => createGame('food', size));
});

test('a tile cannot match itself or increment turns on repeated selection', () => {
  const game = createGame('food', 8);
  assert.equal(selectCard(game, 0), 'first');
  assert.equal(selectCard(game, 0), 'ignored');
  assert.equal(selectCard(game, -1), 'ignored');
  assert.equal(selectCard(game, 99), 'ignored');
  assert.equal(game.turns, 0);
  assert.equal(game.pairs, 0);
  assert.deepEqual(game.selected, [0]);
});

test('a mismatch locks the board until resolved and counts exactly one turn', () => {
  const game = createGame('places', 12);
  const different = game.cards.findIndex(card => card.key !== game.cards[0].key);
  selectCard(game, 0);
  assert.equal(selectCard(game, different), 'mismatch');
  assert.equal(game.turns, 1);
  assert.equal(game.locked, true);
  const third = game.cards.findIndex((_, i) => i !== 0 && i !== different);
  assert.equal(selectCard(game, third), 'ignored');
  assert.equal(game.pairs, 0);
  resolveMismatch(game);
  assert.deepEqual(game.selected, []);
  assert.equal(game.locked, false);
  assert.equal(selectCard(game, third), 'first');
});

test('all pairs can be completed, matched tiles cannot be reused, and a new game resets progress', () => {
  const game = createGame('everyday', 24);
  const keys = [...new Set(game.cards.map(card => card.key))];
  keys.forEach((key, pairIndex) => {
    const indices = game.cards.flatMap((card, index) => card.key === key ? [index] : []);
    assert.equal(selectCard(game, indices[0]), 'first');
    assert.equal(selectCard(game, indices[1]), pairIndex === keys.length - 1 ? 'complete' : 'match');
    assert.equal(selectCard(game, indices[0]), 'ignored');
    assert.equal(game.pairs, pairIndex + 1);
    assert.equal(game.turns, pairIndex + 1);
  });
  assert.equal(game.complete, true);
  assert.ok(game.cards.every(card => card.matched));
  const fresh = createGame('everyday', 24);
  assert.equal(fresh.complete, false);
  assert.equal(fresh.pairs, 0);
  assert.equal(fresh.turns, 0);
  assert.ok(fresh.cards.every(card => !card.matched));
});

test('teams share one two-tile guess and pass the turn only after a mismatch is hidden', () => {
  const game = createGame('food', 8, Math.random, 'teams');
  const different = game.cards.findIndex(card => card.key !== game.cards[0].key);
  assert.equal(selectCard(game, 0), 'first');
  assert.equal(game.activeTeam, 0);
  assert.equal(selectCard(game, 0), 'ignored');
  assert.equal(selectCard(game, different), 'mismatch');
  assert.equal(game.activeTeam, 0);
  assert.equal(selectCard(game, 2), 'ignored');
  assert.deepEqual(game.teamScores, [0, 0]);
  resolveMismatch(game);
  assert.equal(game.activeTeam, 1);
  assert.equal(game.turns, 1);
  resolveMismatch(game);
  assert.equal(game.activeTeam, 1);
});

test('each team earns its own pairs and alternates even after a correct guess', () => {
  const game = createGame('places', 8, Math.random, 'teams');
  const keys = [...new Set(game.cards.map(card => card.key))];
  keys.forEach((key, turn) => {
    const pair = game.cards.flatMap((card, index) => card.key === key ? [index] : []);
    assert.equal(game.activeTeam, turn % 2);
    assert.equal(selectCard(game, pair[0]), 'first');
    assert.equal(selectCard(game, pair[1]), turn === 3 ? 'complete' : 'match');
    assert.equal(game.teamScores[turn % 2], Math.floor(turn / 2) + 1);
    assert.equal(game.teamScores.reduce((sum, score) => sum + score, 0), game.pairs);
    const nextTeam = game.activeTeam;
    assert.equal(selectCard(game, pair[0]), 'ignored');
    assert.equal(game.activeTeam, nextTeam);
  });
  assert.deepEqual(game.teamScores, [2, 2]);
  assert.equal(game.activeTeam, 1);
  assert.equal(game.complete, true);
  const fresh = createGame('places', 8, Math.random, 'teams');
  assert.equal(fresh.activeTeam, 0);
  assert.deepEqual(fresh.teamScores, [0, 0]);
});

test('solo play does not track team points or alternate teams, and invalid modes are rejected', () => {
  const game = createGame('everyday', 8);
  const pair = game.cards.flatMap((card, index) => card.key === game.cards[0].key ? [index] : []);
  selectCard(game, pair[0]);
  selectCard(game, pair[1]);
  assert.equal(game.mode, 'solo');
  assert.equal(game.activeTeam, 0);
  assert.deepEqual(game.teamScores, [0, 0]);
  assert.throws(() => createGame('food', 8, Math.random, 'invalid'));
});
