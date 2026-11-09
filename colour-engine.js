/* Sequence rules are independent of the display, playback timers and sound. */
(function (root) {
  'use strict';

  const colours = [
    { key: 'red', name: 'Red', shape: 'circle', symbol: '●', frequency: 262 },
    { key: 'blue', name: 'Blue', shape: 'diamond', symbol: '◆', frequency: 330 },
    { key: 'yellow', name: 'Yellow', shape: 'star', symbol: '★', frequency: 392 },
    { key: 'green', name: 'Green', shape: 'triangle', symbol: '▲', frequency: 523 },
    { key: 'purple', name: 'Purple', shape: 'square', symbol: '■', frequency: 587 },
    { key: 'orange', name: 'Orange', shape: 'plus', symbol: '✚', frequency: 659 },
    { key: 'pink', name: 'Pink', shape: 'heart', symbol: '♥', frequency: 784 },
    { key: 'teal', name: 'Teal', shape: 'crescent', symbol: '☾', frequency: 880 }
  ];
  const colourCounts = Array.from({ length: colours.length - 1 }, (_, index) => index + 2);

  function createGame(colourCount = 4) {
    if (!colourCounts.includes(colourCount)) throw new Error(`Choose between 2 and ${colours.length} colours.`);
    return { colourCount, sequence: [], inputIndex: 0, completed: 0, phase: 'ready', eliminated: [] };
  }

  function startGame(game, random = Math.random) {
    game.sequence = [Math.floor(random() * game.colourCount)];
    game.inputIndex = 0;
    game.completed = 0;
    game.phase = 'watching';
    game.eliminated = [];
  }

  function finishPlayback(game) {
    if (game.phase !== 'watching') return false;
    game.inputIndex = 0;
    game.phase = 'input';
    game.eliminated = [];
    return true;
  }

  function selectColour(game, index) {
    if (game.phase !== 'input' || !Number.isInteger(index) || index < 0 || index >= game.colourCount || game.eliminated.includes(index)) return 'ignored';
    game.eliminated = [];
    if (game.sequence[game.inputIndex] !== index) {
      game.phase = 'retry';
      return 'retry';
    }
    game.inputIndex++;
    if (game.inputIndex === game.sequence.length) {
      game.completed = game.sequence.length;
      game.phase = 'success';
      return 'success';
    }
    return 'correct';
  }

  function useHint(game, random = Math.random) {
    if (game.phase !== 'input' || game.eliminated.length) return false;
    const wrong = Array.from({ length: game.colourCount }, (_, index) => index)
      .filter(index => index !== game.sequence[game.inputIndex]);
    // Leave two choices, or just the answer when playing with two colours.
    for (let count = Math.max(1, game.colourCount - 2); count > 0; count--) {
      const index = Math.floor(random() * wrong.length);
      game.eliminated.push(wrong.splice(index, 1)[0]);
    }
    return true;
  }

  function replaySequence(game) {
    if (!['input', 'retry', 'paused'].includes(game.phase)) return false;
    game.inputIndex = 0;
    game.phase = 'watching';
    game.eliminated = [];
    return true;
  }

  function nextRound(game, random = Math.random) {
    if (game.phase !== 'success') return false;
    game.sequence.push(Math.floor(random() * game.colourCount));
    game.inputIndex = 0;
    game.phase = 'watching';
    game.eliminated = [];
    return true;
  }

  function pausePlayback(game) {
    if (game.phase !== 'watching') return false;
    game.phase = 'paused';
    return true;
  }

  const api = { colours, colourCounts, createGame, startGame, finishPlayback, selectColour, useHint, replaySequence, nextRound, pausePlayback };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KakiSequence = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
