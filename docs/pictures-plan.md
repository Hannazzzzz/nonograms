# Recognisable pictures: plan

Status: draft for discussion. No code yet.

## Goal

Add puzzles whose solution is a recognisable picture (a lighthouse, a cat, a teapot) as well as the random patterns. The current rules still apply:

- Every picture is original. Nothing is copied from other nonogram sites, emoji sets or icon fonts.
- Puzzles are made on the device, so the site keeps working offline.
- Each puzzle has exactly one solution, reachable by logic alone, and the solver checks this before the puzzle is shown.

## Approach

1. **Picture library.** Each subject is drawn in code from simple vector shapes (circles, ellipses, polygons, curves) on a 0 to 1 canvas. A subject has:
   - a name, shown when the puzzle is solved
   - its shapes, filled or cut out
   - **keep areas**: the parts that make it recognisable (eyes, windows, the lighthouse lamp), which repairs must never touch
   - a preferred shape (square, wide or tall) and a smallest board size where it still reads well
2. **Turn it into a grid.** Sample each cell against the shapes in plain JavaScript, so it can be tested in Node as well as the page. A cell is filled when more than about half of it is covered.
3. **Variation.** Before turning it into a grid, randomly shift it by less than a cell, scale it by 85 to 100%, mirror it, and nudge the coverage threshold. Subjects can also have their own options (sail up or down, cat sitting or lying). The same subject then gives a different puzzle each time, at any board size.
4. **Make it solvable without spoiling the picture.** Run the existing line solver (`quickSolve`). If it gets stuck:
   1. Try other variations of the same subject first.
   2. Then repair with as few changed cells as possible, placed where they do the least harm: first in the background away from the subject (corners, ground, sky), then on the outline, never in keep areas. This is the stray group of filled cells you often see in a corner of a paper puzzle. It's needed because some pictures allow more than one answer, for example two cells on one diagonal that could equally sit on the other with the same clues. One extra cell nearby breaks the tie.
   3. Cap the repairs at about 2% of cells. If that isn't enough, drop the subject and try another.
5. **Grade** with the existing `gradePuzzle`, so the level shown is the real one.
6. **Reveal.** The title stays hidden ("Picture No. 12") until the puzzle is solved, then shows the name ("Lighthouse").

## Page (proposal)

- New puzzle pop-up gets a choice between **Patterns** and **Pictures**.
- Size works as now. 10 × 10 only fits simple icons (heart, key, fish), 15 × 15 to 25 × 25 suit most subjects, and 30 × 30 and up have room for scenes.
- History rows and the meta line say "Picture" and, once solved, the name.

## Open questions

1. **Levels.** Pictures have large solid areas, so most will grade Easy or Medium. Either let the player choose a level (Easy to Hard, slower to make, with some subjects never reaching Hard), or show the level after the puzzle is made. Extra hard and Look mum no hands probably can't be reached without the picture looking noisy.
2. **First subjects.** Suggested starter set of 10: lighthouse, cat, teapot, house, tree, fish, bird, umbrella, snail, mushroom. Ideas welcome.
3. **Repeats.** Avoid repeating a subject until all of them have been played on this device?
4. **README.** The "No AI in the puzzles" section says no puzzle is made by AI. The drawings would be written as code with Claude's help, but they're still turned into puzzles on the device and nothing calls an AI service. The wording needs a small update either way.
5. **Non-square boards.** Pick subjects whose preferred shape matches the board, or let any subject fill a wide or tall board with background?

## Not doing

- Emoji or icon fonts turned into grids: those designs belong to Apple, Google and others.
- Generating images while playing: needs a network connection and can't guarantee a clean picture.
- Colour: the board stays filled or empty.

## Testing (when building)

- Node: every subject at 10, 15, 20, 25 and 30, many variations each: line-solvable (so exactly one solution), clues match, repairs within the cap and never in keep areas, Hint playthroughs solve from hinted cells only.
- A contact sheet image with every subject at every size, added to the PR, so we can judge by eye whether each one is recognisable.
- Playwright: pop-up choice, hidden title and reveal, History, layout on Mac, iPad and phone.

## Steps

1. Agree this plan (this PR).
2. Prototype: picture code plus 10 subjects, and the contact sheet.
3. Page changes: pop-up choice, reveal, History.
4. More subjects.
