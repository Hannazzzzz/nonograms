# Hanna's Nonograms

A nonogram puzzle site: https://hannazzzzz.github.io/nonograms/

Fill cells in a grid so that every row and column matches its clue numbers. Each puzzle has exactly one solution, and you can reach it by logic alone, no guessing. New to nonograms? See [How to solve a nonogram](https://activityworkshop.net/puzzlesgames/nonograms/tutorial.html).

## Features

- Sizes 10 × 10, 15 × 15, 20 × 20, 20 × 15, or any custom size from 5 to 40 columns and rows.
- Five levels: Easy, Medium, Hard, Extra hard and Look mum no hands.
- Works with a mouse or trackpad (modifier keys to cross and mark), on touch screens (Fill / Cross / Candidate switch) and with the keyboard.
- Candidate marks, Undo, Hold to check, step-by-step hints and a What if mode for testing an assumption.
- History of every puzzle you've played, with progress saved as you go.
- The board always fits the screen, from phone to desktop. Phones also get an Enlarge view.

## No AI in the puzzles

The puzzles are not made by AI. Each one is generated on your device by ordinary code: a random pattern, a solver that checks it, and a grader that sets the level. The site's code was written with help from Claude (an AI assistant), but nothing on the site calls an AI service, and no puzzle is copied from anywhere else.

## How it works

Everything is in one file, `index.html`: HTML, CSS and plain JavaScript. There are no frameworks, no build step, no server code, no analytics and no tracking. The only outside requests are for Google Fonts.

**Making a puzzle**

1. **Random picture.** A seeded pseudo-random generator (xorshift, seeded from `crypto.getRandomValues`) fills the grid. Easy uses noise smoothed into blobs. The harder levels use sparser, unsmoothed noise, which gives more and shorter blocks per line.
2. **Clues.** Row and column clues are counted from the picture.
3. **Solve with line logic.** A solver works one row or column at a time, finding the cells that are the same in every placement of the line's blocks that fits. It repeats until nothing changes.
4. **Fix and retry.** If cells are left unresolved, the generator flips some of them in the picture and solves again. A puzzle is only accepted once line logic solves every cell. That proves the solution is unique, because each step is a forced deduction.
5. **Grade.** The hint engine replays the puzzle from an empty board, always taking the easiest next step. The score is the total effort per 100 cells, weighted by how hard each step is to spot. Bands per board size set the level, and puzzles outside the requested band are discarded.

**Extra hard and Look mum no hands** puzzles can't be solved with line logic alone. They need one-cell what-ifs: assume a cell is filled or empty, follow line logic across rows and columns until a line can't fit, then conclude the opposite. Each step is still a sound deduction, so these puzzles also have exactly one solution. The number of what-ifs needed is kept within a range so the puzzle stays playable.

Making a puzzle runs in short time slices on the main thread, so the page stays responsive. A big board at a hard level can take several seconds, and a progress box shows how far it has got.

**Hints** come from the same engine. A hint points to a row or column, then one block in it, then explains which cells must be filled or crossed and why. Hints never mark cells for you.

## Offline and Add to Home Screen

The site is a small Progressive Web App:

- `manifest.webmanifest` gives it a name, icon and full-screen mode when added to the Home Screen. On iPhone or iPad: Safari → Share → Add to Home Screen. On Android: Chrome → ⋮ → Add to Home screen.
- `sw.js` is a service worker that saves the page, icons and fonts on your device. The page loads from the network first, so updates arrive straight away. Without a connection, or if the network takes more than 4 seconds, it uses the saved copy.

Once you've opened the site online, it works fully offline, flight mode included, because puzzles are made on the device.

## Your data

Puzzles and progress are saved in your browser's `localStorage` (keys starting with `nonogram:`). Nothing is sent anywhere. Progress is per browser and per device, and on iOS the Home Screen app has its own storage, separate from Safari's.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The whole app |
| `sw.js` | Service worker for offline use |
| `manifest.webmanifest` | Home Screen name, icon and display settings |
| `icons/` | App icons |

## Running it locally

No build needed. Serve the folder with any static server, for example:

```
python3 -m http.server
```

Then open http://localhost:8000. The service worker only registers on `*.github.io` and `localhost`.

## Licence

[MIT](LICENSE)
