'use strict';

const root = document.getElementById('root');
const form = document.getElementById('form');
const run = document.getElementById('run');
const simSpeed = document.getElementById('sim-speed');

const DEFAULT_SPEED = 500;

let board = [];
let isRunning = false;
let simulationIntervalId;
let speed;
let generation = 0;

run.addEventListener('click', () => {
  toggleSimulation();
  run.textContent = isRunning ? 'STOP' : 'RUN';
});

simSpeed.addEventListener('input', () => {
  toggleSimulation();
  speed = simSpeed.value;
  toggleSimulation();
});

function startSimulation() {
  speed = simSpeed.value;
  if (!isRunning) {
    simulationIntervalId = setInterval(() => {
      const nextBoard = generateNextBoard();
      board = JSON.parse(JSON.stringify(nextBoard));
      renderBoard();
    }, speed);
    isRunning = true;
  }
}

function stopSimulation() {
  if (isRunning) {
    clearInterval(simulationIntervalId);
    isRunning = false;
  }
}

function toggleSimulation() {
  if (isRunning) stopSimulation();
  else startSimulation();
}

function generateBoard(size) {
  const boardElement = document.createElement('div');
  boardElement.id = 'board';
  for (let i = 0; i < size; i++) {
    const rowElement = document.createElement('div');
    rowElement.id = `row-${i}`;
    rowElement.classList.add('row');
    for (let j = 0; j < size; j++) {
      const cellElement = document.createElement('div');
      cellElement.id = `cell-${i}-${j}`;
      cellElement.classList.add('cell');
      cellElement.addEventListener('click', () => {
        cellClickHandler(i, j);
      });
      rowElement.append(cellElement);
    }
    boardElement.append(rowElement);
  }
  root.append(boardElement);
}

function renderBoard() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      const cell = document.getElementById(`cell-${i}-${j}`);
      if (board[i][j].alive) {
        cell.classList.add('alive');
        cell.classList.remove('dead');
      } else {
        cell.classList.remove('alive');
        cell.classList.add('dead');
      }
    }
  }
}

function cellClickHandler(i, j) {
  board[i][j].alive = board[i][j].alive ? false : true;
  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
      if ((di !== 0 || dj !== 0) && board[i + di]) {
        if (board[i + di][j + dj]) {
          if (board[i][j].alive) board[i + di][j + dj].liveNeighbourCount++;
          else board[i + di][j + dj].liveNeighbourCount--;
        }
      }
    }
  }
  renderBoard();
}

function getLiveNeighbourCount(i, j, board) {
  let liveNeighbourCount = 0;
  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
      if ((di !== 0 || dj !== 0) && board[i + di]) {
        if (board[i + di][j + dj]) {
          liveNeighbourCount += board[i + di][j + dj].alive ? 1 : 0;
        }
      }
    }
  }
  return liveNeighbourCount;
}

function generateNextBoard() {
  // CREATING BLANK NEXT BOARD
  const nextBoard = [];
  for (let i = 0; i < board.length; i++) {
    const nextBoardRow = [];
    for (let j = 0; j < board.length; j++) {
      const nextBoardCell = {
        i,
        j,
        alive: board[i][j].alive,
        liveNeighbourCount: 0,
      };
      nextBoardRow.push(nextBoardCell);
      // APPLYING GAME RULES
      if (board[i][j].alive) {
        if (board[i][j].liveNeighbourCount < 2 || board[i][j].liveNeighbourCount > 3) nextBoardCell.alive = false;
        else nextBoardCell.alive = true;
      } else {
        if (board[i][j].liveNeighbourCount === 3) nextBoardCell.alive = true;
      }
    }
    nextBoard.push(nextBoardRow);
  }
  // POPULATING NEW BOARD WITH liveNeighbourCount VALUES
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      nextBoard[i][j].liveNeighbourCount = getLiveNeighbourCount(i, j, nextBoard);
    }
  }
  return nextBoard;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  simSpeed.value = DEFAULT_SPEED;
  if (document.getElementById('board')) document.getElementById('board').remove();
  board.splice(0, board.length);
  const boardSize = +document.getElementById('board-size').value;
  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      row.push({
        i,
        j,
        alive: false,
        liveNeighbourCount: 0,
      });
    }
    board.push(row);
  }
  generateBoard(boardSize);
  renderBoard();
});
