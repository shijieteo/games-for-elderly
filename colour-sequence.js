(function () {
  'use strict';

  const { colours, colourCounts, createGame, startGame, finishPlayback, selectColour, useHint, replaySequence, nextRound, pausePlayback } = window.KakiSequence;
  const $ = id => document.getElementById(id);
  const pads = [...document.querySelectorAll('[data-colour]')];
  const storageKey = 'kaki-colour-sequence-v1';
  const paces = { relaxed: { on: 1200, gap: 450 }, gentle: { on: 1800, gap: 650 }, quick: { on: 700, gap: 350 } };
  const settings = { pace: 'relaxed', sound: false, best: 0, colourCount: 4 };
  let playbackTimer;
  let feedbackTimer;
  let audioContext;
  const notes = new Set();

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved === 'object') {
      if (Object.hasOwn(paces, saved.pace)) settings.pace = saved.pace;
      if (colourCounts.includes(saved.colourCount)) settings.colourCount = saved.colourCount;
      settings.sound = saved.sound === true;
      if (Number.isSafeInteger(saved.best) && saved.best >= 0) settings.best = saved.best;
    }
  } catch { /* Play also works without browser storage. */ }

  let game = createGame(settings.colourCount);

  function saveSettings() {
    try { localStorage.setItem(storageKey, JSON.stringify(settings)); } catch { /* Persistence is optional. */ }
  }

  function prepareAudio() {
    if (!settings.sound) return;
    try {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return;
      audioContext = audioContext || new Context();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    } catch { /* The visual game works even if audio is unavailable. */ }
  }

  function tone(index, duration = 0.3) {
    if (!settings.sound || !audioContext) return;
    try {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const at = audioContext.currentTime;
      oscillator.type = 'sine';
      oscillator.frequency.value = colours[index].frequency;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(0.09, at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, at + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      notes.add(oscillator);
      oscillator.onended = () => { notes.delete(oscillator); oscillator.disconnect(); gain.disconnect(); };
      oscillator.start(at);
      oscillator.stop(at + duration + 0.03);
    } catch { /* Sound is an optional cue. */ }
  }

  function stopNotes() {
    notes.forEach(note => { try { note.stop(); } catch { /* Already stopped. */ } });
    notes.clear();
  }

  function clearLights() {
    pads.forEach(pad => pad.classList.remove('is-lit'));
  }

  function clearTimers() {
    clearTimeout(playbackTimer);
    clearTimeout(feedbackTimer);
    clearLights();
  }

  function announce(text) {
    $('sequence-message').textContent = text;
  }

  function badge(text) {
    $('phase-badge').textContent = text;
    $('phase-badge').classList.toggle('is-watching', game.phase === 'watching');
  }

  function spotlight(symbol, title, caption, colour) {
    $('sequence-spotlight').className = `sequence-spotlight${colour ? ` is-colour colour-${colour.key}` : ''}`;
    $('spotlight-symbol').textContent = symbol;
    $('spotlight-title').textContent = title;
    $('spotlight-caption').textContent = caption;
  }

  function buildSteps() {
    $('sequence-steps').replaceChildren(...game.sequence.map((_, index) => {
      const step = document.createElement('li');
      step.textContent = index + 1;
      return step;
    }));
  }

  function progress(completed = 0, current = -1) {
    [...$('sequence-steps').children].forEach((step, index) => {
      step.classList.toggle('is-complete', index < completed);
      step.classList.toggle('is-current', index === current);
      step.textContent = index < completed ? '✓' : index + 1;
    });
    // Scroll only the step strip, never the page or the player's controls.
    const activeStep = $('sequence-steps').children[current >= 0 ? current : completed - 1];
    if (activeStep) {
      const strip = $('sequence-steps');
      strip.scrollLeft = Math.max(0, activeStep.offsetLeft - strip.offsetLeft - strip.clientWidth / 2 + activeStep.clientWidth / 2);
    }
  }

  function renderControls() {
    pads.forEach((pad, index) => {
      const eliminated = game.eliminated.includes(index);
      pad.hidden = index >= game.colourCount;
      pad.classList.toggle('is-eliminated', eliminated);
      pad.querySelector('.pad-excluded').hidden = !eliminated;
      pad.setAttribute('aria-disabled', String(game.phase !== 'input' || eliminated));
      pad.setAttribute('aria-label', `${colours[index].name}, ${colours[index].shape}. Keyboard shortcut ${index + 1}${eliminated ? '. Ruled out by hint' : ''}`);
      pad.tabIndex = eliminated ? -1 : 0;
    });
    $('colour-pads').dataset.count = game.colourCount;
    $('colour-pads').classList.toggle('is-expanded', game.colourCount > 4);
    $('sequence-action').hidden = !['ready', 'success'].includes(game.phase);
    $('sequence-action').innerHTML = game.phase === 'success'
      ? 'Next round <span aria-hidden="true">→</span>' : 'Start game <span aria-hidden="true">→</span>';
    $('sequence-replay').disabled = !['input', 'retry', 'paused'].includes(game.phase);
    $('sequence-hint').hidden = ['ready', 'success'].includes(game.phase);
    $('sequence-hint').disabled = game.phase !== 'input' || game.eliminated.length > 0;
    $('sequence-hint').textContent = game.eliminated.length ? 'Hint shown ✓' : 'A little hint';
    $('sequence-reset').hidden = game.phase === 'ready';
    $('sequence-pace').disabled = game.phase === 'watching';
    $('sequence-colour-count').disabled = game.phase !== 'ready';
    $('sequence-length').textContent = game.sequence.length || '—';
    $('sequence-score').textContent = game.completed;
    $('sequence-best').textContent = settings.best;
    $('keyboard-hint').innerHTML = `Tap a colour, or use keys ${Array.from({ length: game.colourCount }, (_, index) => `<kbd>${index + 1}</kbd>`).join(' ')} when it’s your turn.`;
  }

  function showInput() {
    if (!finishPlayback(game)) return;
    renderControls();
    badge('YOUR TURN');
    progress();
    spotlight('✦', 'Your turn', 'Tap the colours in the order you saw them.');
    $('display-step').textContent = `0 of ${game.sequence.length} repeated`;
    announce(`Your turn! Repeat ${game.sequence.length === 1 ? 'the colour' : `all ${game.sequence.length} colours`} in the same order. Take your time.`);
    if (document.activeElement === $('sequence-game')) pads[0].focus({ preventScroll: true });
  }

  function playSequence() {
    clearTimers();
    stopNotes();
    prepareAudio();
    renderControls();
    buildSteps();
    badge('WATCH CLOSELY');
    $('display-step').textContent = `${game.sequence.length} ${game.sequence.length === 1 ? 'colour' : 'colours'} to remember`;
    spotlight('✦', 'Watch closely', 'The colours will appear here, one at a time.');
    announce(`Watch closely. Remember ${game.sequence.length} ${game.sequence.length === 1 ? 'colour' : 'colours'}.`);
    $('sequence-game').focus({ preventScroll: true });
    const pace = paces[settings.pace];

    function playStep(index) {
      if (game.phase !== 'watching') return;
      const colour = colours[game.sequence[index]];
      const step = `Colour ${index + 1} of ${game.sequence.length}`;
      spotlight(colour.symbol, colour.name, `${step} · ${colour.shape}`, colour);
      $('display-step').textContent = step;
      pads[game.sequence[index]].classList.add('is-lit');
      progress(index, index);
      announce(`${step}: ${colour.name}, ${colour.shape}.`);
      tone(game.sequence[index], Math.min(pace.on / 1000 - 0.1, 0.65));
      playbackTimer = setTimeout(() => {
        clearLights();
        progress(index + 1);
        spotlight('·', index + 1 === game.sequence.length ? 'Get ready…' : 'Keep watching…', 'Remember the order.');
        playbackTimer = setTimeout(() => {
          if (index + 1 < game.sequence.length) playStep(index + 1);
          else showInput();
        }, pace.gap);
      }, pace.on);
    }

    playbackTimer = setTimeout(() => playStep(0), 650);
  }

  function chooseColour(index) {
    const result = selectColour(game, index);
    if (result === 'ignored') return;
    clearTimeout(feedbackTimer);
    clearLights();
    prepareAudio();
    const colour = colours[index];
    pads[index].classList.add('is-lit');
    feedbackTimer = setTimeout(() => {
      clearLights();
      if (game.phase === 'input') spotlight('✦', 'Your turn', 'Keep going. You can take your time.');
    }, 300);
    renderControls();
    progress(game.inputIndex, result === 'success' ? -1 : game.inputIndex);

    if (result === 'retry') {
      badge('ANOTHER LITTLE GO');
      spotlight('↻', 'Let’s have another look', 'Watch the same sequence and try again.');
      $('display-step').textContent = 'Same sequence. A fresh try.';
      announce('Not quite that time, and that’s okay. Press Watch again to replay the same sequence and try from the beginning.');
      $('sequence-replay').focus({ preventScroll: true });
      return;
    }

    tone(index);
    if (result === 'success') {
      settings.best = Math.max(settings.best, game.completed);
      saveSettings();
      renderControls();
      badge('LOVELY WORK');
      spotlight('✓', 'You remembered!', 'Ready for one more colour?');
      $('display-step').textContent = `${game.sequence.length} of ${game.sequence.length} repeated`;
      announce(`Well done! You remembered ${game.completed} ${game.completed === 1 ? 'colour' : 'colours'}. Press Next round when you’re ready for one more.`);
      $('sequence-action').focus({ preventScroll: true });
    } else {
      spotlight(colour.symbol, colour.name, 'That’s right. What comes next?', colour);
      $('display-step').textContent = `${game.inputIndex} of ${game.sequence.length} repeated`;
      announce(`${colour.name}. Correct! ${game.inputIndex} of ${game.sequence.length} repeated. Choose the next colour.`);
    }
  }

  function pauseSequence() {
    if (!pausePlayback(game)) return;
    clearTimers();
    stopNotes();
    renderControls();
    badge('TAKE A LITTLE BREAK');
    spotlight('Ⅱ', 'Your sequence is paused', 'Press Watch again whenever you’re ready.');
    $('display-step').textContent = 'We’ll replay from the beginning';
    announce('Sequence paused. Press Watch again to see it from the beginning.');
  }

  function resetGame() {
    clearTimers();
    stopNotes();
    game = createGame(settings.colourCount);
    buildSteps();
    renderControls();
    badge('LET’S BEGIN');
    spotlight('✦', 'Ready when you are', 'Your first colour is a tap away.');
    $('display-step').textContent = 'Start with just one colour';
    announce('A fresh start. Press Start game, then watch the big display.');
    $('sequence-action').focus({ preventScroll: true });
  }

  $('sequence-action').addEventListener('click', () => {
    if (game.phase === 'ready') startGame(game);
    else if (!nextRound(game)) return;
    playSequence();
    $('sequence-game').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  });
  $('sequence-replay').addEventListener('click', () => { if (replaySequence(game)) playSequence(); });
  $('sequence-hint').addEventListener('click', () => {
    if (!useHint(game)) return;
    clearTimeout(feedbackTimer);
    clearLights();
    renderControls();
    const remaining = colours.slice(0, game.colourCount)
      .map((colour, index) => ({ ...colour, index }))
      .filter(colour => !game.eliminated.includes(colour.index));
    const choices = remaining.map(colour => colour.name).join(' or ');
    spotlight('✦', 'A little help', remaining.length === 1 ? `Only ${choices} remains. Tap it to continue.` : `Choose ${choices}.`);
    announce(`Hint for colour ${game.inputIndex + 1} of ${game.sequence.length}: ${remaining.length === 1 ? `only ${choices} remains` : `choose ${choices}`}. ${game.eliminated.length} wrong ${game.eliminated.length === 1 ? 'option is' : 'options are'} ruled out for this step.`);
    pads[remaining[0].index].focus({ preventScroll: true });
  });
  $('sequence-reset').addEventListener('click', resetGame);
  pads.forEach((pad, index) => pad.addEventListener('click', () => chooseColour(index)));

  $('colour-pads').addEventListener('keydown', event => {
    const available = pads.filter((pad, index) => !pad.hidden && !game.eliminated.includes(index));
    const index = available.indexOf(event.target.closest('[data-colour]'));
    if (index < 0) return;
    const columns = getComputedStyle($('colour-pads')).gridTemplateColumns.split(' ').length;
    const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -columns, ArrowDown: columns };
    let next;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = available.length - 1;
    else if (Object.hasOwn(offsets, event.key)) next = Math.max(0, Math.min(available.length - 1, index + offsets[event.key]));
    else return;
    event.preventDefault();
    available[next].focus();
  });

  document.addEventListener('keydown', event => {
    if (event.repeat || event.ctrlKey || event.altKey || event.metaKey || $('sequence-help-dialog').open) return;
    if (event.target.closest('input, select, textarea, [contenteditable="true"]')) return;
    if (game.phase === 'input' && /^[1-9]$/.test(event.key) && Number(event.key) <= game.colourCount) {
      event.preventDefault();
      chooseColour(Number(event.key) - 1);
    }
  });

  $('sequence-pace').value = settings.pace;
  $('sequence-colour-count').value = settings.colourCount;
  $('sequence-colour-count').addEventListener('change', event => {
    const count = Number(event.target.value);
    if (game.phase !== 'ready' || !colourCounts.includes(count)) return;
    settings.colourCount = count;
    saveSettings();
    game = createGame(count);
    renderControls();
    announce(`${count} colours selected: ${colours.slice(0, count).map(colour => colour.name).join(', ')}. Press Start game when you’re ready.`);
  });
  $('sequence-pace').addEventListener('change', event => {
    if (Object.hasOwn(paces, event.target.value)) { settings.pace = event.target.value; saveSettings(); }
  });
  function renderSound() {
    $('sequence-sound').textContent = `Sound: ${settings.sound ? 'on' : 'off'}`;
    $('sequence-sound').setAttribute('aria-pressed', String(settings.sound));
  }
  $('sequence-sound').addEventListener('click', () => {
    settings.sound = !settings.sound;
    saveSettings();
    renderSound();
    if (!settings.sound) stopNotes();
    else { prepareAudio(); if (game.phase !== 'watching') tone(game.colourCount - 1); }
  });
  $('sequence-help').addEventListener('click', () => {
    pauseSequence();
    stopNotes();
    $('sequence-help-dialog').showModal();
  });
  ['close-help', 'got-help'].forEach(id => $(id).addEventListener('click', () => $('sequence-help-dialog').close()));
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseSequence(); });
  window.addEventListener('pagehide', () => { pauseSequence(); clearTimers(); stopNotes(); });

  renderSound();
  renderControls();
})();
