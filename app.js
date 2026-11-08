(function () {
  'use strict';
  const { themes, createGame, selectCard, resolveMismatch } = window.KakiGame;
  const $ = id => document.getElementById(id);
  const form = $('settings-form');
  const grid = $('tile-grid');
  const storageKey = 'kaki-match-settings-v1';
  const defaults = { theme: 'food', size: 8, pace: 2000, sound: false };
  let settings = { ...defaults };
  let game;
  let buttons = [];
  let turnTimeout;
  let peekTimeout;
  let winTimeout;
  let peeking = false;
  let startedAt = null;
  let finishedSeconds = 0;
  let audioContext;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved === 'object') {
      if (Object.hasOwn(themes, saved.theme)) settings.theme = saved.theme;
      if ([8, 12, 16, 24].includes(saved.size)) settings.size = saved.size;
      if ([1000, 2000, 3000].includes(saved.pace)) settings.pace = saved.pace;
      settings.sound = saved.sound === true;
    }
  } catch { /* The game also works when browser storage is unavailable. */ }

  function saveSettings() {
    try { localStorage.setItem(storageKey, JSON.stringify(settings)); } catch { /* Optional persistence. */ }
  }

  function formatTime(seconds) {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }

  function elapsed() {
    return startedAt === null ? 0 : Math.floor((performance.now() - startedAt) / 1000);
  }

  function message(text) { $('game-message').textContent = text; }

  function sound(kind) {
    if (!settings.sound) return;
    try {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return;
      audioContext = audioContext || new Context();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      const notes = kind === 'complete' ? [523, 659, 784, 1047] : kind === 'match' ? [523, 659] : [392];
      notes.forEach((frequency, i) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const at = audioContext.currentTime + i * 0.14;
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, at);
        gain.gain.linearRampToValueAtTime(0.07, at + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, at + 0.25);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(at);
        oscillator.stop(at + 0.26);
      });
    } catch { /* Sound is optional, including on browsers without audio support. */ }
  }

  function updateSoundButton() {
    $('sound-button').textContent = `Sound: ${settings.sound ? 'on' : 'off'}`;
    $('sound-button').setAttribute('aria-pressed', String(settings.sound));
  }

  function renderCards() {
    game.cards.forEach((card, index) => {
      const revealed = card.matched || peeking || game.selected.includes(index);
      const button = buttons[index];
      button.classList.toggle('is-revealed', revealed);
      button.classList.toggle('is-matched', card.matched);
      button.setAttribute('aria-label', `Tile ${index + 1}: ${revealed ? `${card.name}, ${card.local}${card.matched ? ', matched' : ''}` : 'face down'}`);
      button.setAttribute('aria-disabled', String(card.matched || peeking || game.locked || game.complete));
    });
    $('pairs-found').textContent = game.pairs;
    $('turns').textContent = game.turns;
    $('progress').setAttribute('aria-valuenow', game.pairs);
    $('progress-fill').style.width = `${game.pairs / (game.cards.length / 2) * 100}%`;
    $('peek-button').disabled = peeking || game.locked || game.complete;
  }

  function startGame(moveFocus = false) {
    clearTimeout(turnTimeout);
    clearTimeout(peekTimeout);
    clearTimeout(winTimeout);
    peeking = false;
    startedAt = null;
    finishedSeconds = 0;
    game = createGame(settings.theme, settings.size);
    $('timer').textContent = '0:00';
    $('theme-caption').textContent = themes[settings.theme].caption;
    $('game-title').textContent = themes[settings.theme].title;
    $('pairs-total').textContent = ` / ${settings.size / 2}`;
    $('progress').setAttribute('aria-valuemax', settings.size / 2);
    $('board-note').textContent = "Same picture? That's a pair!";
    $('peek-button').innerHTML = '<span aria-hidden="true">☼</span> Take a little peek';
    grid.classList.toggle('large-grid', settings.size === 24);
    grid.replaceChildren();
    buttons = game.cards.map((card, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tile';
      button.dataset.index = index;
      // All card content is from the fixed, local theme definitions.
      button.innerHTML = `<span class="tile-inner" aria-hidden="true"><span class="tile-back"><span class="tile-back-flower">✿</span></span><span class="tile-front"><span class="tile-emoji">${card.emoji}</span><span class="tile-name">${card.name}</span><span class="tile-local" lang="zh-Hans">${card.local}</span></span></span>`;
      grid.append(button);
      return button;
    });
    renderCards();
    message('Pick any two tiles to find a pair.');
    if (moveFocus) {
      $('game').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      buttons[0].focus({ preventScroll: true });
    }
  }

  function finish() {
    finishedSeconds = elapsed();
    $('timer').textContent = formatTime(finishedSeconds);
    message(`Well done! You found all ${game.pairs} pairs in ${game.turns} turns.`);
    $('board-note').textContent = 'All matched. Lovely work!';
    sound('complete');
    winTimeout = setTimeout(() => {
      $('win-summary').textContent = `You found all ${game.pairs} pairs in ${game.turns} turns, with ${formatTime(finishedSeconds)} of happy play.`;
      if ($('help-dialog').open) $('help-dialog').close();
      $('win-dialog').showModal();
    }, 650);
  }

  grid.addEventListener('click', event => {
    const button = event.target.closest('button[data-index]');
    if (!button || peeking) return;
    const index = Number(button.dataset.index);
    const outcome = selectCard(game, index);
    if (outcome === 'ignored') return;
    if (startedAt === null) startedAt = performance.now();
    renderCards();
    if (outcome === 'first') {
      message(`${game.cards[index].name}. Now choose another tile.`);
      sound('flip');
    } else if (outcome === 'match') {
      message(`A lovely match! Two ${game.cards[index].name} tiles. Keep going.`);
      sound('match');
    } else if (outcome === 'complete') {
      finish();
    } else {
      const names = game.selected.map(i => game.cards[i].name).join(' and ');
      message(`${names}. Different pictures — have another try!`);
      turnTimeout = setTimeout(() => {
        resolveMismatch(game);
        renderCards();
        message('Pick any two tiles. You can do it!');
      }, settings.pace);
    }
  });

  grid.addEventListener('keydown', event => {
    const button = event.target.closest('button[data-index]');
    if (!button) return;
    const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    const steps = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns };
    let next;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = buttons.length - 1;
    else if (event.key in steps) next = Math.max(0, Math.min(buttons.length - 1, Number(button.dataset.index) + steps[event.key]));
    else return;
    event.preventDefault();
    buttons[next].focus();
  });

  $('peek-button').addEventListener('click', () => {
    if (peeking || game.locked || game.complete) return;
    peeking = true;
    renderCards();
    $('peek-button').textContent = 'Have a look…';
    message('A little peek! All pictures will stay visible for 5 seconds.');
    peekTimeout = setTimeout(() => {
      peeking = false;
      renderCards();
      $('peek-button').innerHTML = '<span aria-hidden="true">☼</span> Take a little peek';
      message(game.selected.length ? 'Now choose a second tile to find your pair.' : 'Ready when you are. Pick any two tiles.');
    }, 5000);
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!game.complete && (game.turns > 0 || game.selected.length > 0) && !window.confirm('Start a new game? This will clear your current board.')) return;
    const data = new FormData(form);
    settings = { ...settings, theme: data.get('theme'), size: Number(data.get('size')), pace: Number(data.get('pace')) };
    saveSettings();
    startGame(true);
  });

  $('sound-button').addEventListener('click', () => {
    settings.sound = !settings.sound;
    updateSoundButton();
    saveSettings();
    if (settings.sound) sound('match');
  });
  $('help-button').addEventListener('click', () => $('help-dialog').showModal());
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  $('play-again').addEventListener('click', () => {
    $('win-dialog').close();
    startGame(true);
  });

  form.querySelector(`input[name="theme"][value="${settings.theme}"]`).checked = true;
  form.querySelector(`input[name="size"][value="${settings.size}"]`).checked = true;
  $('pace').value = settings.pace;
  updateSoundButton();
  startGame();
  setInterval(() => {
    if (game && !game.complete) $('timer').textContent = formatTime(elapsed());
  }, 1000);
})();
