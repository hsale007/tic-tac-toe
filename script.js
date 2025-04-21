function GameBoard() {
  const rows = 4;
  const cols = 4;
  let cellsFilled = 0;
  let board = [];
  let winningCombo = [];

  const createBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < cols; j++) {
        board[i][j] = 0;
      }
    }
  };
  createBoard(); //set empty board

  const getBoard = () => board;
  const getCellsFilled = () => cellsFilled;
  const totalCells = () => board.length * board.length;
  const incrementCellsFilled = () => cellsFilled++;
  const getWinningCombo = () => winningCombo;

  const fillCell = (row, col, playingAs) => {
    board[row][col] = playingAs;
    cellsFilled++;
    return true;
  };

  const checkRow = (row, playingAs) => {
    let tempWinningCombo = [];
    for (let j = 0; j < cols; j++) {
      if (board[row][j] !== playingAs) return false;
      tempWinningCombo.push([row, j]);
    }
    winningCombo = tempWinningCombo;
    return true;
  };

  const checkCol = (col, playingAs) => {
    let tempWinningCombo = [];
    for (let i = 0; i < rows; i++) {
      if (board[i][col] !== playingAs) return false;
      tempWinningCombo.push([i, col]);
    }
    winningCombo = tempWinningCombo;
    return true;
  };

  /*
  Need to see if user placement is diagnoal position
  HOW TO CHECK
  LEFT SIDE (Top - Bottom)
  If (row - col) === 0 then user is on the corner in the left side
  If (row === col) then user select somewhere in the middle board on is in the left side
  Right side (Top - Bottom)
  iF (row - col) === +/-board.length - 1 then user is on the corner i the right side
  if(row - col) === +/- 1 then user select somewhere in the middle board on right side
  */
  const checkDiag = (row, col, playingAs) => {
    const leftSide = col - row === 0 || row === col;
    const rightSide =
      Math.abs(col - row) === board.length - 1 || Math.abs(col - row) === 1;
    //check if user is in a possible diagnoal path
    if (!leftSide && !rightSide) return false;
    //check if user is coming from the left or the right side
    let tempWinningCombo = [];
    if (leftSide) {
      row = col = 0;
      while (col < board.length) {
        if (board[row][col] !== playingAs) return false;
        tempWinningCombo.push([row++, col++]);
      }
      winningCombo = tempWinningCombo;
    }
    tempWinningCombo = [];
    if (rightSide) {
      row = 0;
      col = board.length - 1;
      while (col >= 0) {
        if (board[row][col] !== playingAs) return false;
        tempWinningCombo.push([row++, col--]);
      }
      winningCombo = tempWinningCombo;
    }
    return true;
  };

  const isWinner = (row, col, playingAs) => {
    console.log("in here");

    return (
      checkRow(row, playingAs) ||
      checkCol(col, playingAs) ||
      checkDiag(row, col, playingAs)
    );
  };

  const printBoard = () => {
    let grid = "";
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) grid += board[i][j] + " ";
      grid += "\n";
    }
    console.log(grid);
  };

  return {
    getBoard,
    printBoard,
    incrementCellsFilled,
    isWinner,
    totalCells,
    getCellsFilled,
    fillCell,
    getWinningCombo,
  };
}

function Cell() {
  const validateUserInput = (value, length) => {
    //find spot in 2d array
    const row = Math.floor(--value / length);
    const col = value - row * length;
    return [row, col];
  };

  return { validateUserInput };
}

function Player() {
  let playingAs, name;

  const getName = () => name;
  const setName = () => (name = prompt("What is your name?"));
  const askPlayingAs = () => {
    do {
      playingAs = prompt(`${name} would you like to be X or O`).toUpperCase();
    } while (playingAs !== "X" && playingAs !== "O");
  };
  const setPlayingAs = (value) => (playingAs = value);
  const getPlayingAs = () => playingAs;

  const playerInfo = () => `${name}\nPlaying as ${playingAs}`;

  const createPlayers = () => {
    const player1 = Player();
    const player2 = Player();
    player1.setName();
    player1.askPlayingAs();
    player2.setName();

    player2.setPlayingAs(player1.getPlayingAs() === "X" ? "O" : "X");
    return [player1, player2];
  };

  return {
    getName,
    getPlayingAs,
    playerInfo,
    createPlayers,
    setName,
    askPlayingAs,
    setPlayingAs,
  };
}

function GameController() {
  const board = GameBoard();
  const display = DisplayController();
  const boardLength = board.getBoard().length;
  display.createGameBoard(boardLength);
  const [player1, player2] = Player().createPlayers();

  let playerTurn = "";

  const isGameOver = (row, col, playingAs) =>
    board.getCellsFilled() >= board.getBoard().length * 2 - 1 &&
    board.isWinner(row, col, playingAs);

  const boardFull = () => board.getCellsFilled() === board.totalCells();
  const setPlayerTurn = () => {
    playerTurn =
      playerTurn === ""
        ? player1.getPlayingAs() === "X"
          ? player1
          : player2
        : playerTurn === player1
        ? player2
        : player1;
  };

  const playGame = () => {
    const cells = display.getCells();
    cells.forEach((cell) =>
      cell.addEventListener(
        "click",
        (e) => {
          setPlayerTurn();
          let row = e.target.parentElement.className.split("-")[1];
          let col = cell.className.split("-")[1];
          board.fillCell(row, col, playerTurn.getPlayingAs());
          display.fillCell(cell, playerTurn.getPlayingAs());
          board.printBoard();

          console.log(board.getCellsFilled());
          if (boardFull()) {
            console.log("Everyone is a loser");
            return;
          }
          if (isGameOver(row, col, playerTurn.getPlayingAs())) {
            console.log(board.getWinningCombo());
            display.showWinningCombo(board.getWinningCombo());
            display.gameOver();
            console.log(
              `CONGRATULATIONS! ${playerTurn.getName()} You Are The Winner!`
            );
            return;
          }
        },
        { once: true }
      )
    );
  };
  return { playGame };
}

function DisplayController() {
  const board = document.querySelector(".game-board");
  const gameBoard = GameBoard().getBoard();
  console.log(gameBoard.length);

  const gameOver = () => board.classList.toggle("game-over");

  const createGameBoard = (boardLength) => {
    for (let i = 0; i < boardLength; i++) {
      // board[i] = [];
      const row = document.createElement("div");
      row.className = `row-${i}`;
      for (let j = 0; j < boardLength; j++) {
        const cell = document.createElement("div");
        cell.className = `cell-${j}`;
        cell.setAttribute("data", "0");
        row.appendChild(cell);
      }
      board.appendChild(row);
    }
  };

  const fillCell = (cell, playingAs) => {
    cell.innerText = playingAs;
    cell.setAttribute("data", playingAs);
    cell.classList.toggle("filled");
  };

  const showWinningCombo = (winningPairs) => {
    winningPairs.forEach((pair) => {
      const [row, col] = pair;
      const cell = document
        .querySelector(`.row-${row}`)
        .querySelector(`.cell-${col}`);
      cell.classList.toggle("winner");
    });
  };

  const displayBoard = () => board;
  const getCells = () => document.querySelectorAll('[class^="cell"]');

  return {
    createGameBoard,
    displayBoard,
    getCells,
    showWinningCombo,
    fillCell,
    gameOver,
  };
}

GameController().playGame();
