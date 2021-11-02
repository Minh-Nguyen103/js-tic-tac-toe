/**
 * Global variables
 */

import { CELL_VALUE, GAME_STATUS, TURN } from './constants.js';

import {
  getCellElementAtIdx,
  getCellElementList,
  getCellListElement,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayButtonElement,
  getStartButtonElement,
} from './selectors.js';

import { checkGameStatus } from './utils.js';

let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill('');

function toggleTurn() {
  //toggle turn
  currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

  //update turn on DOM element
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
    currentTurnElement.classList.add(currentTurn);
  }
}

function updateGameStatus(newGameStatus) {
  gameStatus = newGameStatus;

  const statusElement = getGameStatusElement();
  if (statusElement) return (statusElement.textContent = gameStatus);
}

function showReplayButton() {
  const replayButton = getReplayButtonElement();

  if (replayButton) {
    replayButton.classList.add('show');
    initReplayButton();
  }
}

function hideReplayButton() {
  const replayButton = getReplayButtonElement();

  if (replayButton) {
    replayButton.classList.remove('show');
  }
}

function highlightWinCells(winPositions) {
  if (!Array.isArray(winPositions)) {
    throw new Error('Invalid win positions');
  }

  if (winPositions.some((set) => set.length !== 3)) throw new Error('Invalid win positions');

  winPositions.forEach((set) => {
    for (const position of set) {
      const liElement = getCellElementAtIdx(position);

      if (liElement) liElement.classList.add('win');
    }
  });
}

function handleCellClick(cellElement, index) {
  const isClicked =
    cellElement.classList.contains(TURN.CIRCLE) || cellElement.classList.contains(TURN.CROSS);
  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
  if (isClicked || isEndGame) return;

  //set selected cell
  cellElement.classList.add(currentTurn);

  //update cellValues
  cellValues[index] = currentTurn === TURN.CROSS ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;

  //toggle turn
  toggleTurn();

  //check game status
  const game = checkGameStatus(cellValues);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      //update game status
      updateGameStatus(game.status);
      //show replay button
      showReplayButton();
      break;
    }

    case GAME_STATUS.X_WIN:
    case GAME_STATUS.O_WIN: {
      //update game status
      updateGameStatus(game.status);
      //show replay button
      showReplayButton();
      //highlight win cells
      highlightWinCells(game.winPositions);
      break;
    }

    default:
    //playing
  }
}

function initStartButtonElement() {
  const startButtonElement = getStartButtonElement();

  if (startButtonElement) {
    startButtonElement.addEventListener('click', () => {
      startButtonElement.classList.remove('show');
      const gameBoardElement = document.querySelector('.game-board');
      if (gameBoardElement) {
        gameBoardElement.classList.add('showBoard');
        initCellElementList();
      }
    });
  }
}

function initCellElementList() {
  //set index for each li element
  const liList = getCellElementList();

  liList.forEach((li, index) => {
    li.dataset.id = index;
  });

  //
  const ulElement = getCellListElement();
  if (ulElement) {
    ulElement.addEventListener('click', (e) => {
      if (e.target.tagName !== 'LI') return;

      const index = Number.parseInt(e.target.dataset.id);
      handleCellClick(e.target, index);
    });
  }
}

function resetGame() {
  //reset temp global vars
  currentTurn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map(() => '');

  //reset dom element

  //reset game status

  updateGameStatus(gameStatus);
  //reset current turn

  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
    currentTurnElement.classList.add(currentTurn);
  }

  //reset game board
  const liElementList = getCellElementList();
  if (liElementList) {
    for (const liElement of liElementList) {
      liElement.className = '';
    }
  }

  //hide replay button
  hideReplayButton();
}

function initReplayButton() {
  const replayButton = getReplayButtonElement();

  if (replayButton) {
    replayButton.addEventListener('click', resetGame);
  }
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
  // bind click event for all li elements
  // initCellElementList();
  initStartButtonElement();
  // bind click event for replay button
  //...
})();
