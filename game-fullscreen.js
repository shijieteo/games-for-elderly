/* One fullscreen controller for all games, including a browser-independent expanded view. */
(function () {
  'use strict';
  const board = document.querySelector('[data-fullscreen-board]');
  const toggles = [...document.querySelectorAll('[data-fullscreen-toggle]')];
  if (!board || !toggles.length) return;
  const root = document.documentElement;
  const extras = [...board.querySelectorAll('[data-game-action]')];
  const status = document.createElement('p');
  status.className = 'fullscreen-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  document.body.append(status);
  let active = false;
  let nativeOwned = false;
  let returnFocus;
  let returnScroll = { x: 0, y: 0 };
  let revision = 0;

  const fullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement;

  function syncAction(proxy) {
    const source = document.getElementById(proxy.dataset.gameAction);
    if (!source) return;
    proxy.textContent = source.textContent.trim();
    proxy.disabled = source.disabled;
    if (source.hasAttribute('aria-pressed')) proxy.setAttribute('aria-pressed', source.getAttribute('aria-pressed'));
  }

  extras.forEach(proxy => {
    const source = document.getElementById(proxy.dataset.gameAction);
    if (!source) return;
    syncAction(proxy);
    proxy.addEventListener('click', () => { source.click(); syncAction(proxy); });
    new MutationObserver(() => syncAction(proxy)).observe(source, {
      childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['aria-pressed', 'disabled']
    });
  });

  function fitTiles() {
    const grid = board.querySelector('.tile-grid');
    if (!active || !grid || !grid.children.length) return;
    const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    const rows = Math.ceil(grid.children.length / columns);
    const gap = parseFloat(getComputedStyle(grid).rowGap) || 0;
    const size = Math.floor(Math.max(28, Math.min(104, (grid.clientHeight - gap * (rows - 1)) / rows - 60)));
    grid.style.setProperty('--fullscreen-picture-size', `${size}px`);
  }

  function applyView(enabled) {
    active = enabled;
    document.body.classList.toggle('is-game-fullscreen', enabled);
    toggles.forEach(button => {
      button.textContent = enabled ? '⛶ Exit full screen' : '⛶ Full screen';
      button.setAttribute('aria-pressed', String(enabled));
      button.setAttribute('aria-controls', board.id);
    });
    extras.forEach(proxy => { proxy.hidden = !enabled; syncAction(proxy); });
    status.textContent = enabled ? 'Full screen game view. Press Escape or Exit full screen to return.' : 'Returned to the regular game view.';
    fitTiles();
  }

  function finishExit() {
    if (!active) return;
    revision++;
    applyView(false);
    const token = revision;
    requestAnimationFrame(() => {
      if (active || token !== revision) return;
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
      window.scrollTo({ left: returnScroll.x, top: returnScroll.y, behavior: 'instant' });
    });
  }

  async function leaveNativeFullscreen() {
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (!exit || fullscreenElement() !== root) return;
    try { await exit.call(document); } catch { /* The in-page exit always remains available. */ }
  }

  function exit() {
    const leaveNative = nativeOwned && fullscreenElement() === root;
    finishExit();
    if (leaveNative) leaveNativeFullscreen();
  }

  async function enter() {
    const token = ++revision;
    returnFocus = document.activeElement;
    returnScroll = { x: window.scrollX, y: window.scrollY };
    applyView(true);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const request = root.requestFullscreen || root.webkitRequestFullscreen;
    if (!request) return;
    try {
      await request.call(root);
      if (!active && token !== revision) await leaveNativeFullscreen();
      else if (active && fullscreenElement() === root) nativeOwned = true;
    } catch { /* The expanded game view works when fullscreen is unavailable or denied. */ }
  }

  toggles.forEach(button => {
    button.setAttribute('aria-controls', board.id);
    button.addEventListener('click', () => { if (active) exit(); else enter(); });
  });
  function onFullscreenChange() {
    if (fullscreenElement() === root && active) nativeOwned = true;
    else if (!fullscreenElement() && nativeOwned) { nativeOwned = false; finishExit(); }
  }
  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active && !event.defaultPrevented && !document.querySelector('dialog[open]')) exit();
  });
  window.addEventListener('pagehide', exit);
  window.addEventListener('resize', fitTiles);
  const grid = board.querySelector('.tile-grid');
  if (grid) {
    if (window.ResizeObserver) new ResizeObserver(fitTiles).observe(grid);
    new MutationObserver(fitTiles).observe(grid, { childList: true });
  }
})();
