'use strict';

const root = document.getElementById('root');
const form = document.getElementById('form');

const board = [];

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

form.addEventListener('submit', e => {
  e.preventDefault();
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
      });
    }
    board.push(row);
  }
  generateBoard(boardSize);
  renderBoard();
});
