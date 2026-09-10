/* ==========================================================================
   Flex Burger - game logic
   Handles rendering the board, reading the controls, checking a solution and
   keeping progress between visits. No external libraries.
   ========================================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'flex-burger-progress';

  /* ----------------------------- game state ------------------------------ */

  var state = {
    index: 0,          // index of the level being played
    values: {},        // current value of every control on this level
    attempts: 0,       // total tries across the whole game
    solved: [],        // ids of levels already completed
    locked: false      // true while a solved level waits for "Next order"
  };

  /* ------------------------------ elements ------------------------------- */

  var el = {
    board:       document.getElementById('board'),
    controlList: document.getElementById('control-list'),
    goal:        document.getElementById('level-goal'),
    hint:        document.getElementById('level-hint'),
    feedback:    document.getElementById('feedback'),
    code:        document.getElementById('code-output'),
    levelList:   document.getElementById('level-list'),
    current:     document.getElementById('level-current'),
    total:       document.getElementById('level-total'),
    attempts:    document.getElementById('attempts'),
    solvedCount: document.getElementById('solved-count'),
    btnCheck:    document.getElementById('btn-check'),
    btnReset:    document.getElementById('btn-reset'),
    btnNext:     document.getElementById('btn-next'),
    btnRestart:  document.getElementById('btn-restart'),
    overlay:     document.getElementById('win-overlay'),
    winTotal:    document.getElementById('win-total'),
    winAttempts: document.getElementById('win-attempts')
  };

  /* ------------------------------ progress ------------------------------- */

  function saveProgress() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        index: state.index,
        attempts: state.attempts,
        solved: state.solved
      }));
    } catch (err) {
      /* Private mode or storage disabled - the game still works, just not saved. */
    }
  }

  function loadProgress() {
    var raw;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      return;
    }
    if (!raw) { return; }

    try {
      var saved = JSON.parse(raw);
      if (typeof saved.index === 'number' && saved.index >= 0 && saved.index < LEVELS.length) {
        state.index = saved.index;
      }
      if (typeof saved.attempts === 'number' && saved.attempts >= 0) {
        state.attempts = saved.attempts;
      }
      if (Object.prototype.toString.call(saved.solved) === '[object Array]') {
        state.solved = saved.solved;
      }
    } catch (err) {
      /* Corrupted entry - start fresh. */
    }
  }

  function clearProgress() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      /* nothing to do */
    }
  }

  /* ------------------------------- helpers ------------------------------- */

  function currentLevel() {
    return LEVELS[state.index];
  }

  function isSolved(level) {
    for (var i = 0; i < state.solved.length; i++) {
      if (state.solved[i] === level.id) { return true; }
    }
    return false;
  }

  /* Merges the level defaults with whatever the player picked. */
  function effectiveStyle() {
    var level = currentLevel();
    var style = {};
    var key;

    for (key in BASE_STYLE) {
      if (Object.prototype.hasOwnProperty.call(BASE_STYLE, key)) {
        style[key] = BASE_STYLE[key];
      }
    }
    for (key in level.start) {
      if (Object.prototype.hasOwnProperty.call(level.start, key)) {
        style[key] = level.start[key];
      }
    }
    for (key in state.values) {
      if (Object.prototype.hasOwnProperty.call(state.values, key)) {
        style[key] = state.values[key];
      }
    }
    return style;
  }

  /* ------------------------------ rendering ------------------------------ */

  function renderItems() {
    var level = currentLevel();
    var i;

    el.board.innerHTML = '';

    for (i = 0; i < level.items.length; i++) {
      var data = INGREDIENTS[level.items[i]];
      var item = document.createElement('div');
      var label = document.createElement('span');

      item.className = 'ingredient';
      item.style.animationDelay = (i * 0.05) + 's';
      item.appendChild(document.createTextNode(data[0]));

      label.appendChild(document.createTextNode(data[1]));
      item.appendChild(label);

      el.board.appendChild(item);
    }
  }

  function renderControls() {
    var level = currentLevel();
    var i, j;

    el.controlList.innerHTML = '';

    for (i = 0; i < level.controls.length; i++) {
      var prop = level.controls[i];
      var options = FLEX_OPTIONS[prop];

      var row = document.createElement('div');
      var label = document.createElement('label');
      var select = document.createElement('select');
      var id = 'control-' + prop;

      row.className = 'control';

      label.setAttribute('for', id);
      label.appendChild(document.createTextNode(prop + ':'));

      select.id = id;
      select.setAttribute('data-prop', prop);

      for (j = 0; j < options.length; j++) {
        var option = document.createElement('option');
        option.value = options[j];
        option.appendChild(document.createTextNode(options[j]));
        select.appendChild(option);
      }

      select.value = state.values[prop];
      select.addEventListener('change', onControlChange);

      row.appendChild(label);
      row.appendChild(select);
      el.controlList.appendChild(row);
    }
  }

  function renderBoard() {
    var style = effectiveStyle();
    var prop;

    for (prop in style) {
      if (Object.prototype.hasOwnProperty.call(style, prop)) {
        el.board.style.setProperty(prop, style[prop]);
      }
    }
    renderCode(style);
  }

  function renderCode(style) {
    var level = currentLevel();
    var lines = ['.counter {'];
    var shown = ['display', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items'];
    var i;

    for (i = 0; i < shown.length; i++) {
      var prop = shown[i];
      var isControlled = level.controls.indexOf(prop) !== -1;

      /* Show the controls of this level plus display, so the rule reads well. */
      if (isControlled || prop === 'display') {
        lines.push('  ' + prop + ': ' + style[prop] + ';');
      }
    }
    lines.push('}');

    el.code.textContent = lines.join('\n');
  }

  function renderLevelNav() {
    var i;

    el.levelList.innerHTML = '';

    for (i = 0; i < LEVELS.length; i++) {
      var level = LEVELS[i];
      var li = document.createElement('li');
      var dot = document.createElement('button');
      /* A level opens up once the one before it is done, and stays open. */
      var reachable = i === 0 ||
                      i <= state.index ||
                      isSolved(level) ||
                      isSolved(LEVELS[i - 1]);

      dot.type = 'button';
      dot.className = 'level-dot';
      dot.appendChild(document.createTextNode(String(level.id)));
      dot.setAttribute('data-index', String(i));
      dot.setAttribute('aria-label', 'Level ' + level.id);

      if (isSolved(level)) { dot.className += ' is-done'; }
      if (i === state.index) {
        dot.className += ' is-active';
        dot.setAttribute('aria-current', 'true');
      }

      if (reachable) {
        dot.addEventListener('click', onLevelPick);
      } else {
        dot.disabled = true;
        dot.title = 'Finish the earlier levels first';
      }

      li.appendChild(dot);
      el.levelList.appendChild(li);
    }
  }

  function renderStatus() {
    el.current.textContent = String(state.index + 1);
    el.total.textContent = String(LEVELS.length);
    el.attempts.textContent = String(state.attempts);
    el.solvedCount.textContent = String(state.solved.length);
  }

  function setFeedback(message, kind) {
    el.feedback.className = 'feedback';
    el.feedback.textContent = message || '';

    if (message) {
      el.feedback.className = 'feedback is-visible ' + (kind === 'ok' ? 'is-ok' : 'is-bad');
    }
  }

  /* ---------------------------- level lifecycle -------------------------- */

  /* Puts the current level back to its starting values. */
  function resetLevel(keepFeedback) {
    var level = currentLevel();
    var i;

    state.values = {};
    state.locked = false;

    for (i = 0; i < level.controls.length; i++) {
      var prop = level.controls[i];
      state.values[prop] = Object.prototype.hasOwnProperty.call(level.start, prop)
        ? level.start[prop]
        : BASE_STYLE[prop];
    }

    el.board.className = 'board';
    el.btnNext.hidden = true;
    el.btnCheck.disabled = false;

    if (!keepFeedback) { setFeedback(''); }

    renderControls();
    renderBoard();
  }

  function loadLevel(index) {
    state.index = index;

    var level = currentLevel();

    el.goal.textContent = level.goal;
    el.hint.textContent = level.hint;

    renderItems();
    resetLevel(false);
    renderLevelNav();
    renderStatus();
    saveProgress();
  }

  /* -------------------------------- checks ------------------------------- */

  function findMistake() {
    var level = currentLevel();
    var prop;

    for (prop in level.solution) {
      if (Object.prototype.hasOwnProperty.call(level.solution, prop)) {
        if (state.values[prop] !== level.solution[prop]) { return prop; }
      }
    }
    return null;
  }

  function checkSolution() {
    if (state.locked) { return; }

    var level = currentLevel();

    state.attempts += 1;

    var wrongProp = findMistake();

    if (wrongProp === null) {
      state.locked = true;

      if (!isSolved(level)) { state.solved.push(level.id); }

      el.board.className = 'board is-solved';
      el.btnCheck.disabled = true;

      if (state.index < LEVELS.length - 1) {
        el.btnNext.hidden = false;
        setFeedback('Order served! That is exactly how the ticket reads.', 'ok');
      } else {
        setFeedback('Perfect - the whole menu is done!', 'ok');
        showWin();
      }
    } else {
      setFeedback('Not quite. Take another look at "' + wrongProp + '" and try again.', 'bad');
    }

    renderLevelNav();
    renderStatus();
    saveProgress();
  }

  function showWin() {
    el.winTotal.textContent = String(LEVELS.length);
    el.winAttempts.textContent = String(state.attempts);
    el.overlay.hidden = false;
    el.btnRestart.focus();
  }

  /* ------------------------------- handlers ------------------------------ */

  function onControlChange(event) {
    if (state.locked) { return; }

    state.values[event.target.getAttribute('data-prop')] = event.target.value;
    setFeedback('');
    renderBoard();
  }

  function onLevelPick(event) {
    loadLevel(parseInt(event.currentTarget.getAttribute('data-index'), 10));
  }

  function onNext() {
    if (state.index < LEVELS.length - 1) { loadLevel(state.index + 1); }
  }

  function onReset() {
    resetLevel(false);
    setFeedback('Level reset to its default values.', 'ok');
  }

  function onRestart() {
    state.attempts = 0;
    state.solved = [];
    el.overlay.hidden = true;
    clearProgress();
    loadLevel(0);
  }

  /* --------------------------------- init -------------------------------- */

  function init() {
    loadProgress();

    el.btnCheck.addEventListener('click', checkSolution);
    el.btnReset.addEventListener('click', onReset);
    el.btnNext.addEventListener('click', onNext);
    el.btnRestart.addEventListener('click', onRestart);

    loadLevel(state.index);
  }

  init();
}());
