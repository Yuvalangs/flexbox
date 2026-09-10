/* ==========================================================================
   Flex Burger - level data
   Every level says which CSS controls the player gets, what the board starts
   with, and which combination of values counts as the correct order.
   ========================================================================== */

/* The option lists shown in the <select> elements. */
var FLEX_OPTIONS = {
  'display': ['block', 'flex'],
  'flex-direction': ['row', 'row-reverse', 'column', 'column-reverse'],
  'justify-content': ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
  'align-items': ['stretch', 'flex-start', 'flex-end', 'center'],
  'flex-wrap': ['nowrap', 'wrap', 'wrap-reverse']
};

/* Values the board falls back to when a level does not expose the control. */
var BASE_STYLE = {
  'display': 'flex',
  'flex-direction': 'row',
  'justify-content': 'flex-start',
  'align-items': 'stretch',
  'flex-wrap': 'nowrap'
};

/* Ingredients are reused across levels; each entry is [emoji, label]. */
var INGREDIENTS = {
  bun:     ['🍞', 'bun'],
  patty:   ['🥩', 'patty'],
  cheese:  ['🧀', 'cheese'],
  tomato:  ['🍅', 'tomato'],
  lettuce: ['🥬', 'lettuce'],
  onion:   ['🧅', 'onion'],
  bacon:   ['🥓', 'bacon'],
  pickle:  ['🥒', 'pickle'],
  fries:   ['🍟', 'fries'],
  drink:   ['🥤', 'drink']
};

var LEVELS = [
  {
    id: 1,
    goal: 'The ingredients are piled up in a column by accident. Turn the counter into a flex container so they line up side by side.',
    hint: 'One property is enough here.',
    items: ['bun', 'patty', 'cheese'],
    controls: ['display'],
    start: { 'display': 'block' },
    solution: { 'display': 'flex' }
  },
  {
    id: 2,
    goal: 'This one is a classic burger: stack the ingredients from top to bottom.',
    hint: 'Change the main axis of the container.',
    items: ['bun', 'lettuce', 'patty', 'bun'],
    controls: ['flex-direction'],
    start: { 'flex-direction': 'row' },
    solution: { 'flex-direction': 'column' }
  },
  {
    id: 3,
    goal: 'Spread the toppings across the whole counter: first item glued to the left edge, last item to the right edge, equal gaps in between.',
    hint: 'You only need to change the spacing along the main axis.',
    items: ['tomato', 'cheese', 'onion', 'pickle'],
    controls: ['justify-content'],
    start: { 'justify-content': 'flex-start' },
    solution: { 'justify-content': 'space-between' }
  },
  {
    id: 4,
    goal: 'The ingredients fell off the shelf. Let them rest on the bottom of the counter, still starting from the left.',
    hint: 'The cross axis is the vertical one while the direction is row.',
    items: ['bacon', 'patty', 'cheese'],
    controls: ['align-items'],
    start: { 'align-items': 'stretch' },
    solution: { 'align-items': 'flex-end' }
  },
  {
    id: 5,
    goal: 'Plate up: put the whole order in one horizontal row, perfectly centered in the middle of the counter both across and down.',
    hint: 'Three properties have to agree on this one.',
    items: ['bun', 'patty', 'cheese', 'bun'],
    controls: ['flex-direction', 'justify-content', 'align-items'],
    start: { 'flex-direction': 'row', 'justify-content': 'flex-start', 'align-items': 'stretch' },
    solution: { 'flex-direction': 'row', 'justify-content': 'center', 'align-items': 'center' }
  },
  {
    id: 6,
    goal: 'Build this burger upside down: stack it in a column that starts at the bottom of the counter and grows upward, pushed against the right edge.',
    hint: 'A reversed column flips where "start" is.',
    items: ['bun', 'lettuce', 'tomato', 'patty'],
    controls: ['flex-direction', 'justify-content', 'align-items'],
    start: { 'flex-direction': 'row', 'justify-content': 'flex-start', 'align-items': 'stretch' },
    solution: { 'flex-direction': 'column-reverse', 'justify-content': 'flex-start', 'align-items': 'flex-end' }
  },
  {
    id: 7,
    goal: 'Rush hour! Seven items do not fit on one line. Let the extras drop to a second line, and center every line horizontally.',
    hint: 'Items are not allowed to shrink, so they need somewhere to go.',
    items: ['bun', 'patty', 'cheese', 'tomato', 'lettuce', 'onion', 'bacon'],
    controls: ['flex-wrap', 'justify-content'],
    start: { 'flex-wrap': 'nowrap', 'justify-content': 'flex-start' },
    solution: { 'flex-wrap': 'wrap', 'justify-content': 'center' }
  },
  {
    id: 8,
    goal: 'Last order of the night: lay the items out right to left, wrapping onto extra lines, with equal space around each item and each item resting on the bottom of its own line.',
    hint: 'Four properties, one very full counter.',
    items: ['bun', 'patty', 'cheese', 'tomato', 'lettuce', 'bacon', 'fries', 'drink'],
    controls: ['flex-direction', 'flex-wrap', 'justify-content', 'align-items'],
    start: {
      'flex-direction': 'row',
      'flex-wrap': 'nowrap',
      'justify-content': 'flex-start',
      'align-items': 'stretch'
    },
    solution: {
      'flex-direction': 'row-reverse',
      'flex-wrap': 'wrap',
      'justify-content': 'space-around',
      'align-items': 'flex-end'
    }
  }
];
