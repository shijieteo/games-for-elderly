(function () {
  'use strict';
  const { WIDTH, HEIGHT, scenes, renderScene } = window.KakiSpotScenes;
  const { COLUMNS, ROWS, createGame, cellFor, spot, inspectCell, hint, revealAnswers } = window.KakiSpot;
  const $ = id => document.getElementById(id);
  const pictures = [...document.querySelectorAll('.picture-surface')];
  const storageKey = 'kaki-spot-difference-v1';
  const settings = { scene: 'kopitiam', count: 5, grid: true };
  let game;
  let presenting = false;
  let wasFullscreen = false;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved === 'object') {
      if (Object.hasOwn(scenes, saved.scene)) settings.scene = saved.scene;
      if ([3, 5].includes(saved.count)) settings.count = saved.count;
      if (typeof saved.grid === 'boolean') settings.grid = saved.grid;
    }
  } catch { /* All scenes also work without browser storage. */ }

  function saveSettings() {
    try { localStorage.setItem(storageKey, JSON.stringify(settings)); } catch { /* Optional persistence. */ }
  }

  function announce(text) {
    $('spot-message').textContent = text;
  }

  function setGrid() {
    $('spot-pictures').classList.toggle('show-grid', settings.grid);
    $('spot-grid').setAttribute('aria-pressed', String(settings.grid));
    $('spot-grid').textContent = `Grid: ${settings.grid ? 'on' : 'off'}`;
  }

  function setRovingCell(surface, chosen) {
    surface.querySelectorAll('.scene-cell').forEach(button => { button.tabIndex = button === chosen ? 0 : -1; });
  }

  function buildPictures() {
    pictures.forEach((surface, index) => {
      surface.querySelector('.scene-art').innerHTML = renderScene(game.scene, index === 0 ? [] : game.differences.map(difference => difference.id));
      const cells = surface.querySelector('.scene-cells');
      cells.setAttribute('aria-describedby', 'spot-description');
      cells.replaceChildren(...Array.from({ length: COLUMNS * ROWS }, (_, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'scene-cell';
        button.dataset.column = index % COLUMNS;
        button.dataset.row = Math.floor(index / COLUMNS);
        button.tabIndex = index === 0 ? 0 : -1;
        return button;
      }));
    });
  }

  function renderMarkers() {
    const resolved = [...game.found, ...game.revealed];
    let markup = '';
    if (game.hintId) {
      const difference = game.differences.find(difference => difference.id === game.hintId);
      const cell = cellFor(difference);
      markup += `<rect x="${cell.column * WIDTH / COLUMNS + 5}" y="${cell.row * HEIGHT / ROWS + 5}" width="${WIDTH / COLUMNS - 10}" height="${HEIGHT / ROWS - 10}" rx="12" fill="#f5cf5e20" stroke="#fffefb" stroke-width="9"/><rect x="${cell.column * WIDTH / COLUMNS + 5}" y="${cell.row * HEIGHT / ROWS + 5}" width="${WIDTH / COLUMNS - 10}" height="${HEIGHT / ROWS - 10}" rx="12" fill="none" stroke="#875b13" stroke-width="5" stroke-dasharray="13 9"/>`;
    }
    resolved.forEach((id, index) => {
      const difference = game.differences.find(difference => difference.id === id);
      const [x, y, width, height] = difference.bounds;
      const colour = game.revealed.includes(id) ? '#8a5e19' : '#155f4b';
      markup += `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="19" fill="none" stroke="#fffefb" stroke-width="10"/><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="19" fill="none" stroke="${colour}" stroke-width="5"${game.revealed.includes(id) ? ' stroke-dasharray="12 7"' : ''}/><circle cx="${x + 12}" cy="${y + 12}" r="19" fill="${colour}" stroke="#fffefb" stroke-width="3"/><text x="${x + 12}" y="${y + 13}" text-anchor="middle" dominant-baseline="middle" font-family="Segoe UI,Arial,sans-serif" font-size="22" font-weight="750" fill="#fffefb">${index + 1}</text>`;
    });
    pictures.forEach(surface => {
      surface.querySelector('.scene-markers').innerHTML = markup;
      surface.querySelectorAll('.scene-cell').forEach(button => {
        const column = Number(button.dataset.column);
        const row = Number(button.dataset.row);
        const label = `${String.fromCharCode(65 + column)}${row + 1}`;
        const known = resolved.filter(id => {
          const cell = cellFor(game.differences.find(difference => difference.id === id));
          return cell.column === column && cell.row === row;
        }).length;
        button.setAttribute('aria-label', `Picture ${surface.dataset.picture}, square ${label}${known ? `. ${known} ${known === 1 ? 'difference marked' : 'differences marked'}` : ''}`);
        button.setAttribute('aria-disabled', String(game.complete));
      });
    });
  }

  function renderFindings() {
    const resolved = [...game.found, ...game.revealed];
    $('spot-findings').hidden = resolved.length === 0;
    $('spot-findings-list').replaceChildren(...resolved.map((id, index) => {
      const difference = game.differences.find(difference => difference.id === id);
      const shown = game.revealed.includes(id);
      const item = document.createElement('li');
      const number = document.createElement('span');
      number.className = `finding-number${shown ? ' is-shown' : ''}`;
      number.textContent = index + 1;
      number.setAttribute('aria-hidden', 'true');
      const description = document.createElement('span');
      description.className = 'finding-description';
      description.textContent = difference.label;
      const caption = document.createElement('small');
      caption.textContent = `${cellFor(difference).label} · ${shown ? 'Answer shown' : 'Found together'}`;
      description.append(caption);
      item.append(number, description);
      return item;
    }));
  }

  function render() {
    $('spot-found').textContent = game.found.length;
    $('spot-total').textContent = `of ${game.differences.length} found`;
    $('spot-shown').hidden = game.revealed.length === 0;
    $('spot-shown').textContent = `${game.revealed.length} ${game.revealed.length === 1 ? 'answer' : 'answers'} shown`;
    $('spot-hint').disabled = game.complete;
    $('spot-hint').textContent = game.hintId ? 'Another little hint' : '✧ A little hint';
    $('spot-reveal').disabled = game.complete;
    $('spot-result').hidden = !game.complete;
    $('spot-result-icon').textContent = game.revealed.length ? '✧' : '✿';
    $('spot-result-title').textContent = game.revealed.length ? 'Every little detail, revealed.' : 'Sharp eyes, everyone!';
    $('spot-result-copy').textContent = game.revealed.length
      ? `You found ${game.found.length} and revealed ${game.revealed.length}. Compare the numbered marks, then try another scene together.`
      : `All ${game.differences.length} differences found. A lovely bit of looking, together.`;
    renderMarkers();
    renderFindings();
  }

  function prepareGame(moveFocus = false) {
    game = createGame(settings.scene, settings.count);
    $('spot-scene').value = settings.scene;
    $('spot-count').value = settings.count;
    $('spot-caption').textContent = scenes[game.scene].caption;
    $('spot-scene-title').textContent = scenes[game.scene].title;
    $('spot-description').textContent = scenes[game.scene].description;
    buildPictures();
    setGrid();
    render();
    announce(`Find ${game.differences.length} differences. Tap a changed detail in either picture, or use the keyboard to check a square.`);
    if (moveFocus) {
      $('spot-game').focus({ preventScroll: true });
      $('spot-game').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    }
  }

  function respond(outcome) {
    if (outcome.kind === 'ignored') return;
    if (outcome.kind === 'miss') {
      announce('Nothing different there. Have another look — there’s no penalty for trying.');
      return;
    }
    if (outcome.kind === 'duplicate') {
      announce('You have already found that one. Look for another little change.');
      return;
    }
    const difference = game.differences.find(difference => difference.id === outcome.id);
    render();
    announce(outcome.kind === 'complete'
      ? `Sharp eyes, everyone! All ${game.differences.length} differences found. ${difference.label} Choose Next scene when you’re ready.`
      : `Nice spotting! ${difference.label} ${game.found.length} of ${game.differences.length} found.`);
  }

  pictures.forEach(surface => {
    surface.addEventListener('click', event => {
      const button = event.target.closest('.scene-cell');
      if (!button) return;
      setRovingCell(surface, button);
      if (event.detail === 0) {
        respond(inspectCell(game, Number(button.dataset.column), Number(button.dataset.row)));
      } else {
        const rectangle = surface.getBoundingClientRect();
        const x = (event.clientX - rectangle.left - surface.clientLeft) / surface.clientWidth * WIDTH;
        const y = (event.clientY - rectangle.top - surface.clientTop) / surface.clientHeight * HEIGHT;
        respond(spot(game, x, y));
      }
    });
    surface.addEventListener('keydown', event => {
      const buttons = [...surface.querySelectorAll('.scene-cell')];
      const index = buttons.indexOf(event.target);
      if (index < 0) return;
      const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -COLUMNS, ArrowDown: COLUMNS };
      let next;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else if (Object.hasOwn(offsets, event.key)) next = Math.max(0, Math.min(buttons.length - 1, index + offsets[event.key]));
      else return;
      event.preventDefault();
      setRovingCell(surface, buttons[next]);
      buttons[next].focus({ preventScroll: true });
    });
  });

  $('spot-hint').addEventListener('click', () => {
    const difference = hint(game);
    if (!difference) return;
    settings.grid = true;
    setGrid();
    saveSettings();
    render();
    announce(`A little hint: look in square ${cellFor(difference).label} in both pictures. ${difference.hint}`);
  });
  $('spot-reveal').addEventListener('click', () => {
    if (!revealAnswers(game)) return;
    render();
    announce(`All answers are marked. You found ${game.found.length} differences; ${game.revealed.length} more ${game.revealed.length === 1 ? 'is' : 'are'} shown with dashed amber rings. The descriptions below explain every change.`);
  });
  $('spot-grid').addEventListener('click', () => {
    settings.grid = !settings.grid;
    setGrid();
    saveSettings();
  });
  $('spot-scene').addEventListener('change', event => {
    if (!Object.hasOwn(scenes, event.target.value)) return;
    settings.scene = event.target.value;
    saveSettings();
    prepareGame();
  });
  $('spot-count').addEventListener('change', event => {
    const count = Number(event.target.value);
    if (![3, 5].includes(count)) return;
    settings.count = count;
    saveSettings();
    prepareGame();
  });
  $('spot-restart').addEventListener('click', () => prepareGame(true));
  $('spot-next').addEventListener('click', () => {
    const keys = Object.keys(scenes);
    settings.scene = keys[(keys.indexOf(game.scene) + 1) % keys.length];
    saveSettings();
    prepareGame(true);
  });

  function applyGroupView(enabled) {
    presenting = enabled;
    document.body.classList.toggle('is-presenting', enabled);
    $('spot-group').setAttribute('aria-pressed', String(enabled));
    $('spot-group').textContent = enabled ? 'Exit group view' : '⛶ Group view';
    $('spot-game').scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  function exitGroupView() {
    applyGroupView(false);
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
  }

  $('spot-group').addEventListener('click', () => {
    if (presenting) exitGroupView();
    else {
      applyGroupView(true);
      if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => { /* Expanded view still works without fullscreen. */ });
    }
  });
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) wasFullscreen = true;
    else if (wasFullscreen) { wasFullscreen = false; applyGroupView(false); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && presenting && !$('spot-help-dialog').open) exitGroupView();
  });
  $('spot-help').addEventListener('click', () => $('spot-help-dialog').showModal());
  ['spot-close-help', 'spot-got-help'].forEach(id => $(id).addEventListener('click', () => $('spot-help-dialog').close()));

  // Keep scene choices in sync with the artwork library as new scenes are added.
  $('spot-scene').replaceChildren(...Object.entries(scenes).map(([key, scene]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = scene.title;
    return option;
  }));
  prepareGame();
})();
