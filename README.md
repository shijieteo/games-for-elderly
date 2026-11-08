# Kaki Match

A friendly, browser-based memory matching game for seniors in Singapore. Built with plain HTML, CSS and JavaScript. No build step, account, backend, external fonts, or runtime dependencies.

## Play

Open `index.html` in a modern browser, or visit your GitHub Pages site. Players do not need to install anything.

- **Three themes:** Singapore dishes and drinks (including pineapple tarts and fried rice), local landmarks (including Changi Airport and the Merlion), and everyday objects.
- **Four board sizes:** 8, 12, 16 or 24 tiles (4–12 pairs).
- **Face-up preview:** each round shows all tiles until you press **Start game**, then hides the same layout for matching.
- **Numbered tile backs:** large, high-contrast numbers run left to right, top to bottom, so players can call out their choices. Numbers stay fixed throughout the round.
- **Optional team play:** choose **Two teams** to share one board. Team 1 starts; teams alternate after every two-tile guess, including correct guesses. Each matching pair earns the guessing team 1 point. Mismatches hide before the turn passes. The board shows the current team and both scores, and announces the winner or a tie when all pairs are found.
- **Relaxed play:** no countdown or losing condition. The clock simply records time played, beginning with the first tile selected.
- **Reveal speed:** choose 2 seconds, 3 seconds, or 1 second to view a mismatched pair.
- **Hints:** reveal the board for 5 seconds, as often as needed, without a penalty.
- **Optional sound:** off by default.
- **Device preferences:** theme, board size, play mode, reveal speed and sound are saved locally when browser storage is available. Settings update the preview before play, or apply to the next round during play.
- **Accessible controls:** responsive layout, visible focus, screen-reader announcements, reduced-motion support, English and Chinese tile labels, and keyboard operation. Use Tab and Enter/Space, or arrow keys between tiles; Home/End reach the first/last tile.

The interface and instructions are in English. Chinese labels accompany each picture; this is not a fully translated Chinese interface. Food and landmark tiles use local SVG illustrations; everyday objects use built-in emoji and can look slightly different on different devices. Tile names provide an additional recognition cue.

## Publish on GitHub Pages

1. Create a GitHub repository, for example `kaki-match`.
2. Upload `index.html`, `styles.css`, `engine.js`, `illustrations.js`, `app.js` and `.nojekyll` to the root of the repository. You can also upload the entire project.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your branch (usually `main`) and **/ (root)**, then click **Save**.
6. Wait for GitHub's Pages deployment to finish. Your game will be available at `https://YOUR-USERNAME.github.io/kaki-match/` (or the repository name you chose).

All assets use relative paths, so the game works under a repository subdirectory. No secrets, environment variables, npm installation, or custom domain are required.

## Local development

Opening `index.html` directly works. If you prefer a local web server and have Python installed:

```sh
python -m http.server 8080
```

Then visit `http://localhost:8080`.

### Check the game rules

With Node.js 18 or newer installed (for developers only):

```sh
node --test engine.test.js
node --check app.js
```

The tests cover all theme/size combinations, valid decks, invalid settings, repeated selections, mismatch locking, completing a board, fresh-game state, team turn handoffs, team scoring, and solo-mode compatibility.

## Customise the pictures

Edit the `themes` object in `engine.js`. Each item contains:

```js
['unique-key', '☕', 'Kopi', '咖啡']
```

Keep at least 12 unique items in each theme to support the 24-tile board. Within a theme, each item must have a unique key and recognisably different picture. Custom SVG artwork lives in `illustrations.js`, keyed by the same unique key; the emoji is used when no illustration is defined. Theme controls live in `index.html`, while the colours and layout are in `styles.css`.

## Privacy

The game has no analytics or network requests. Preferences are stored only in the current browser. Game progress resets on refresh; no personal information is collected by the application.
