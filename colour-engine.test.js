'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { colours, colourCounts, createGame, startGame, finishPlayback, selectColour, useHint, replaySequence, nextRound, pausePlayback } = require('./colour-engine.js');

test('input is locked before starting and throughout playback', () => {
  const game = createGame();
  assert.equal(selectColour(game, 0), 'ignored');
  assert.equal(nextRound(game), false);
  assert.equal(replaySequence(game), false);
  assert.equal(finishPlayback(game), false);
  startGame(game, () => 0.5);
  assert.deepEqual(game.sequence, [2]);
  assert.equal(selectColour(game, 2), 'ignored');
  assert.equal(game.inputIndex, 0);
  assert.equal(game.completed, 0);
});

test('a completed round grows by exactly one colour and keeps the original order', () => {
  const game = createGame();
  startGame(game, () => 0);
  finishPlayback(game);
  assert.equal(selectColour(game, 0), 'success');
  assert.equal(game.completed, 1);
  assert.equal(game.phase, 'success');
  assert.equal(selectColour(game, 0), 'ignored');
  assert.equal(replaySequence(game), false);
  assert.equal(nextRound(game, () => 0.99), true);
  assert.deepEqual(game.sequence, [0, 3]);
  assert.equal(game.completed, 1);
  assert.equal(game.inputIndex, 0);
  assert.equal(nextRound(game), false);
  finishPlayback(game);
  assert.equal(selectColour(game, 0), 'correct');
  assert.equal(selectColour(game, 3), 'success');
  assert.equal(game.completed, 2);
});

test('a mistake preserves the sequence and completed score, and replay starts input from the beginning', () => {
  const game = createGame();
  startGame(game, () => 0);
  finishPlayback(game);
  selectColour(game, 0);
  nextRound(game, () => 0.5);
  finishPlayback(game);
  selectColour(game, 0);
  assert.equal(selectColour(game, 1), 'retry');
  assert.equal(game.completed, 1);
  assert.equal(game.phase, 'retry');
  assert.equal(nextRound(game), false);
  assert.equal(selectColour(game, 2), 'ignored');
  assert.equal(replaySequence(game), true);
  assert.deepEqual(game.sequence, [0, 2]);
  assert.equal(game.inputIndex, 0);
  assert.equal(selectColour(game, 0), 'ignored');
  finishPlayback(game);
  assert.equal(selectColour(game, 0), 'correct');
  assert.equal(selectColour(game, 2), 'success');
  assert.equal(game.completed, 2);
});

test('replay during a partial answer discards partial input without changing the sequence', () => {
  const game = createGame();
  startGame(game, () => 0.25);
  finishPlayback(game);
  selectColour(game, 1);
  nextRound(game, () => 0.75);
  finishPlayback(game);
  selectColour(game, 1);
  assert.equal(game.inputIndex, 1);
  assert.equal(replaySequence(game), true);
  assert.equal(replaySequence(game), false);
  assert.equal(game.inputIndex, 0);
  assert.deepEqual(game.sequence, [1, 3]);
  assert.equal(game.completed, 1);
});

test('consecutive identical colours count as separate steps', () => {
  const game = createGame();
  startGame(game, () => 0);
  finishPlayback(game);
  selectColour(game, 0);
  nextRound(game, () => 0);
  finishPlayback(game);
  assert.deepEqual(game.sequence, [0, 0]);
  assert.equal(selectColour(game, 0), 'correct');
  assert.equal(selectColour(game, 0), 'success');
  assert.equal(game.completed, 2);
});

test('paused playback cannot accept input or finish until it is replayed', () => {
  const game = createGame();
  startGame(game, () => 0.75);
  assert.equal(pausePlayback(game), true);
  assert.equal(game.phase, 'paused');
  assert.equal(pausePlayback(game), false);
  assert.equal(finishPlayback(game), false);
  assert.equal(selectColour(game, 3), 'ignored');
  assert.equal(replaySequence(game), true);
  assert.deepEqual(game.sequence, [3]);
  assert.equal(finishPlayback(game), true);
  assert.equal(pausePlayback(game), false);
  assert.equal(selectColour(game, 3), 'success');
});

test('invalid colour inputs cannot change an active answer', () => {
  const game = createGame();
  startGame(game, () => 0);
  finishPlayback(game);
  for (const value of [-1, 4, 0.5, '0', null, undefined, NaN, Infinity]) {
    assert.equal(selectColour(game, value), 'ignored');
  }
  assert.equal(game.phase, 'input');
  assert.equal(game.inputIndex, 0);
  assert.equal(colours.length, 8);
});

test('starting fresh during a round resets the answer, sequence and completed score', () => {
  const game = createGame();
  startGame(game, () => 0);
  finishPlayback(game);
  selectColour(game, 0);
  nextRound(game, () => 0.75);
  finishPlayback(game);
  selectColour(game, 0);
  startGame(game, () => 0.5);
  assert.deepEqual(game.sequence, [2]);
  assert.equal(game.inputIndex, 0);
  assert.equal(game.completed, 0);
  assert.equal(game.phase, 'watching');
});

test('each colour count restricts sequence generation and ignores unused colour buttons', () => {
  for (const count of colourCounts) {
    const game = createGame(count);
    startGame(game, () => 0.999);
    assert.deepEqual(game.sequence, [count - 1]);
    for (let round = 1; round <= 12; round++) {
      finishPlayback(game);
      for (let index = count; index < colours.length; index++) {
        assert.equal(selectColour(game, index), 'ignored');
      }
      assert.equal(game.inputIndex, 0);
      game.sequence.forEach(index => {
        assert.ok(index >= 0 && index < count);
        selectColour(game, index);
      });
      assert.equal(game.completed, round);
      assert.equal(game.phase, 'success');
      nextRound(game, () => round % 2 ? 0 : 0.999);
    }
  }
});

test('unsupported colour counts are rejected', () => {
  for (const count of [0, 1, 9, -1, 2.5, '3', null, NaN, Infinity]) assert.throws(() => createGame(count));
  assert.equal(createGame().colourCount, 4);
});

test('hints always keep the answer, narrow the choices and cannot accumulate on the same step', () => {
  for (const count of colourCounts) {
    for (let answer = 0; answer < count; answer++) {
      for (const random of [() => 0, () => 0.999]) {
        const game = createGame(count);
        startGame(game, () => (answer + 0.1) / count);
        finishPlayback(game);
        assert.equal(useHint(game, random), true);
        assert.equal(game.eliminated.length, Math.max(1, count - 2));
        assert.equal(new Set(game.eliminated).size, game.eliminated.length);
        assert.ok(game.eliminated.every(index => index !== answer && index >= 0 && index < count));
        const eliminated = game.eliminated.slice();
        assert.equal(useHint(game, random), false);
        assert.deepEqual(game.eliminated, eliminated);
        assert.equal(game.inputIndex, 0);
        assert.equal(game.completed, 0);
        eliminated.forEach(index => assert.equal(selectColour(game, index), 'ignored'));
        assert.deepEqual(game.eliminated, eliminated);
        assert.equal(selectColour(game, answer), 'success');
        assert.equal(game.completed, 1);
        assert.deepEqual(game.eliminated, []);
      }
    }
  }
});

test('hints reset at the next step and replay, and follow the current answer rather than the first colour', () => {
  const game = createGame();
  startGame(game, () => 0);
  finishPlayback(game);
  selectColour(game, 0);
  nextRound(game, () => 0.75);
  finishPlayback(game);
  useHint(game, () => 0);
  assert.equal(selectColour(game, 0), 'correct');
  assert.deepEqual(game.eliminated, []);
  assert.equal(useHint(game, () => 0), true);
  assert.ok(!game.eliminated.includes(3));
  assert.equal(game.inputIndex, 1);
  assert.equal(replaySequence(game), true);
  assert.deepEqual(game.eliminated, []);
  assert.deepEqual(game.sequence, [0, 3]);
  finishPlayback(game);
  assert.equal(useHint(game, () => 0), true);
  assert.ok(!game.eliminated.includes(0));
  const wrong = [0, 1, 2, 3].find(index => index !== 0 && !game.eliminated.includes(index));
  assert.equal(selectColour(game, wrong), 'retry');
  assert.deepEqual(game.eliminated, []);
  replaySequence(game);
  finishPlayback(game);
  assert.equal(useHint(game), true);
  startGame(game, () => 0.5);
  assert.deepEqual(game.eliminated, []);
});

test('hints are only available during an active answer', () => {
  const game = createGame();
  assert.equal(useHint(game), false);
  startGame(game, () => 0);
  assert.equal(useHint(game), false);
  pausePlayback(game);
  assert.equal(useHint(game), false);
  replaySequence(game);
  finishPlayback(game);
  selectColour(game, 1);
  assert.equal(useHint(game), false);
  replaySequence(game);
  finishPlayback(game);
  selectColour(game, 0);
  assert.equal(useHint(game), false);
});
