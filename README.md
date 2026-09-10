# Flex Burger

A small browser game for learning CSS Flexbox, built for Assignment 2 of the Web
Development course. The player runs a burger counter: every level shows an order
ticket describing how the ingredients should be arranged, and the only way to fill
the order is to pick the right Flexbox values.

Built with plain HTML, CSS and JavaScript. No libraries, and no CSS Grid.

## Playing

Open `index.html` in a browser, or visit the GitHub Pages site for the repository.

1. Read the order ticket on the left.
2. Change the `<select>` controls until the counter matches the ticket.
3. Press **Serve it!** to check the answer.
4. On a correct answer the counter turns green and **Next order** appears.

**Reset level** puts the current level back to its default values. Progress, the
try counter and the completed levels are stored in `localStorage`, so closing the
tab does not lose the game. The level dots at the top jump back to any level that
has already been unlocked.

## Levels

| # | Focus | Properties involved |
|---|-------|---------------------|
| 1 | Turning the counter into a flex container | `display` |
| 2 | Stacking a burger top to bottom | `flex-direction` |
| 3 | Spreading toppings edge to edge | `justify-content` |
| 4 | Dropping items to the bottom shelf | `align-items` |
| 5 | Centering the order in both axes | `flex-direction`, `justify-content`, `align-items` |
| 6 | Building the burger upside down | `flex-direction`, `justify-content`, `align-items` |
| 7 | Seven items that do not fit on one line | `flex-wrap`, `justify-content` |
| 8 | Right to left, wrapped and spaced | `flex-direction`, `flex-wrap`, `justify-content`, `align-items` |

Four of the eight levels need more than one property to line up at the same time,
and levels 7 and 8 are the `flex-wrap` levels.

## Files

```
index.html        markup for the page
css/style.css     theme, page layout and the game board
js/levels.js      level data: goals, ingredients, controls and solutions
js/game.js        rendering, answer checking and saved progress
```

## Notes on the implementation

- The board is a fixed `440x320` box at every screen size, so a level's solution
  never depends on the viewport. On narrow phones the board scrolls inside its
  frame instead of shrinking.
- Ingredients use `flex: 0 0 auto`, which is what makes the `flex-wrap` levels
  behave predictably.
- The page layout itself is Flexbox as well - there is no CSS Grid anywhere in
  the stylesheet.
- The generated CSS rule is shown under the board so the player can see what the
  container currently looks like.
