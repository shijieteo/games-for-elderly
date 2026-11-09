# Kaki Play

Three friendly, browser-based games for seniors in Singapore: **Kaki Match**, **Colour Sequence** and **Spot the Difference**. Built with plain HTML, CSS and JavaScript. No build step, account, backend, external fonts, or runtime dependencies.

## Play

Open `index.html` in a modern browser, or visit your GitHub Pages site. Players do not need to install anything.

The home page lets players choose a game. Every page has navigation back home and to the other games. The games also have direct links: `tile-match.html`, `colour-sequence.html` and `spot-difference.html`.

### Kaki Match

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

### Colour Sequence

- **Watch, remember, repeat:** start with one colour. Repeat it correctly, then press **Next round** to add one colour to the same sequence. Each round waits for you to continue.
- **Prominent playback:** every colour fills a large central display with its name and a distinct shape. The corresponding input pad lights up too. A numbered step strip shows progress without revealing the answer during your turn.
- **Eight recognisable cues:** red/circle, blue/diamond, yellow/star, green/triangle, purple/square, orange/plus, pink/heart and teal/crescent. Optional sound gives each colour its own note; sound is off by default.
- **Choose any count from 2–8 colours:** start gently with red and blue, keep the classic four, or add purple, orange, pink and teal for a bigger mix. Four colours remains the default. The sequence only uses the selected colours, and unused buttons are hidden. Choose before starting; press **Start fresh** to change the count during a game. Your choice is saved on this device. Larger palettes use four columns on wide screens and two on smaller screens.
- **Three playback speeds:** relaxed (1.2 seconds per colour), extra time (1.8 seconds), or quick (0.7 seconds). A separate pause between colours keeps repeated colours distinct. Pace changes apply to the next playback.
- **Gentle retries:** use **Watch again** as often as needed. A wrong answer keeps the same sequence and your completed score. Replay starts your answer from the beginning. There is no countdown or losing condition.
- **Step-specific hints:** press **A little hint** during your turn to rule out wrong options for the current step. With 3–8 colours, two choices remain; two colours narrow to the answer. Ruled-out pads stay in place with clear labels and ignore clicks and keyboard shortcuts. One hint is available per step; choices reset after an answer or replay. Hints have no score penalty.
- **Progress and personal best:** see the current sequence length, the longest sequence completed in this game, and your best on this device across colour counts. Best scores include rounds completed with hints or replays. Colour count, pace, sound and best score are saved locally when storage is available.
- **Accessible controls:** large colour buttons, colour names and shapes, visible keyboard focus, reduced-motion support, screen-reader announcements and numbered keyboard shortcuts **1–8** for the selected colours. Tab and Enter/Space also work; arrow keys move between available pads, skipping ruled-out options.
- **Playback pauses** when you open instructions or leave the browser tab. Press **Watch again** when you return. **Start fresh** clears the current game while keeping your saved best.

### Spot the Difference

- **Eight original illustrated scenes:** a kopitiam, a neighbourhood park, a cosy home, a market stall, the seaside, a kitchen, a community garden and a neighbourhood bus stop. Each has five distinct changes involving familiar objects, shapes, counts or patterns. The scalable SVG artwork is bundled locally, stays crisp on a projector, and requires no external image downloads.
- **Two challenges:** find 3 or 5 differences. A 3-difference puzzle randomly selects three changes; the other details remain identical in both pictures. Changing a scene or challenge starts a fresh puzzle.
- **Tap either picture:** generous target areas make it easy to select a changed object. Every discovery gets the same numbered mark in both pictures and a text explanation. Selecting a discovery again never awards another point. There is no timer or penalty for misses.
- **Gentle hints:** **A little hint** outlines a grid square in both pictures and suggests what to compare. Repeated hints cycle through the remaining differences, without marking them found.
- **Reveal answers:** **Show answers** marks remaining differences with dashed amber outlines. The score keeps the number you actually found, and revealed answers are labelled separately.
- **Group play:** optional A–D / 1–3 coordinates help participants call out locations such as “B2”. **Group view** expands the pictures and hides page navigation, settings and extra content; it requests browser fullscreen where available. Use **Exit group view** or Escape to return. **Next scene** cycles through all eight scenes at the facilitator’s pace.
- **Keyboard support:** Tab to either picture, then use arrow keys or Home/End to choose a square. Enter or Space checks that square for a difference. Each picture has one tab stop, and discovered answers have readable descriptions. Hints and answers are announced to screen readers.
- **Responsive layout:** paired pictures on wide screens and stacked pictures on smaller screens. Scene, challenge and grid preferences are saved locally when browser storage is available.

## Publish on GitHub Pages

1. Create a GitHub repository, for example `kaki-match`.
2. Upload all `.html`, `.css` and `.js` files, along with `.nojekyll`, to the root of the repository. You can also upload the entire project.
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
node --test engine.test.js colour-engine.test.js spot-engine.test.js
node --check app.js
node --check colour-sequence.js
node --check spot-difference.js
```

The tile-matching tests cover all theme/size combinations, valid decks, invalid settings, repeated selections, mismatch locking, completing a board, fresh-game state, team turn handoffs, team scoring, and solo-mode compatibility. The colour-sequence tests cover playback input locking, sequence growth, colour-count restrictions, safe hint elimination, hint lifecycle, retries, replaying partial answers, repeated colours, paused playback, invalid inputs, and restarting.

The Spot the Difference tests cover all scenes and challenges, independent scene changes, valid hit areas, omitted differences in gentle puzzles, repeated selections, pointer and keyboard input, misses, hint cycling, revealing answers without inflating the score, and fresh-puzzle state.

## Customise the pictures

Edit the `themes` object in `engine.js`. Each item contains:

```js
['unique-key', '☕', 'Kopi', '咖啡']
```

Keep at least 12 unique items in each theme to support the 24-tile board. Within a theme, each item must have a unique key and recognisably different picture. Custom SVG artwork lives in `illustrations.js`, keyed by the same unique key; the emoji is used when no illustration is defined. Theme controls live in `tile-match.html`, while the tile colours and layout are in `styles.css`. Shared navigation and the home page use `site.css`. The colour game uses `colour-engine.js` for its rules, `colour-sequence.js` for playback and controls, and `colour-sequence.css` for its layout.

Spot the Difference artwork, descriptions and hit areas live in `spot-scenes.js`. Coordinates use an 800 × 560 view box. Each scene defines five independent changes; its renderer changes only the selected IDs in picture B. The scene selector is populated automatically from this library. The game rules are in `spot-engine.js`, controls in `spot-difference.js`, and layout in `spot-difference.css`.

## Privacy

The games have no analytics or external network requests. Preferences and the colour-sequence best score are stored only in the current browser. In-progress games reset on refresh; no personal information is collected by the application.
