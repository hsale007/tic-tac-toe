function GameBoard() {
  const rows = 3;
  const cols = 3;
  let cellsFilled = 0;
  let board = [];
  let winningCombo = [];

  const createBoard = (function () {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < cols; j++) {
        board[i][j] = 0;
      }
    }
  })();

  const getBoard = () => board;
  const getCellsFilled = () => cellsFilled;
  const totalCells = () => board.length * board.length;
  const incrementCellsFilled = () => cellsFilled++;
  const getWinningCombo = () => winningCombo;

  const fillCell = (row, col, playingAs) => {
    if (board[row][col] !== 0) return false;
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

function Player() {
  let playingAs, name;

  const getName = () => name;
  const setName = (value) => (name = value);
  const setPlayingAs = (value) => (playingAs = value);
  const getPlayingAs = () => playingAs;

  const playerInfo = () => `${name}\nPlaying as ${playingAs}`;

  const createPlayers = () => {
    const player1 = Player();
    const player2 = Player();
    player1.setName("Player 1");
    player1.setPlayingAs("X");
    player2.setName("Player 2");
    player2.setPlayingAs("O");
    return [player1, player2];
  };

  return {
    getName,
    getPlayingAs,
    playerInfo,
    createPlayers,
    setName,
    setPlayingAs,
  };
}

function GameController() {
  const board = GameBoard();
  const display = DisplayController();
  const boardLength = board.getBoard().length;
  display.createGameBoard(boardLength);
  const [player1, player2] = Player().createPlayers();
  let playerTurn = player1;
  let formerPlayer = playerTurn;

  const isGameOver = (row, col, playingAs) => {
    if (
      board.getCellsFilled() >= board.getBoard().length * 2 - 1 &&
      board.isWinner(row, col, playingAs)
    ) {
      display.showWinningCombo(board.getWinningCombo());
      gameOverHelper();
      display.updateScores(playerTurn);
      return true;
    }
    if (boardFull()) {
      gameOverHelper();
      return true;
    }
    return false;
  };

  const gameOverHelper = () => {
    formerPlayer = playerTurn = formerPlayer === player1 ? player2 : player1;
    console.log(playerTurn.getName());
    console.log(formerPlayer.getName());
    display.gameOver();
    if (display.newGame()) playGame();
  };

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

  const getComputerChoice = () => {
    let row, col;
    do {
      row = Math.floor(Math.random() * boardLength);
      col = Math.floor(Math.random() * boardLength);
      console.log(row + " " + col);
    } while (!board.fillCell(row, col, "O"));
    const cell = document
      .querySelector(`.row-${row}`)
      .querySelector(`.cell-${col}`);
    console.log(cell);
    display.fillCell(cell, "O");
    if (isGameOver(row, col, "O")) return true;
  };

  const playGame = () => {
    const cells = display.getCells();
    cells.forEach((cell) =>
      cell.addEventListener(
        "click",
        (e) => {
          e.stopPropagation();
          let row = e.target.parentElement.className.split("-")[1];
          let col = cell.className.split("-")[1];
          board.fillCell(row, col, playerTurn.getPlayingAs());
          display.fillCell(cell, playerTurn.getPlayingAs());
          board.printBoard();
          console.log("in here 1");
          if (isGameOver(row, col, playerTurn.getPlayingAs())) {
            return;
          }

          setPlayerTurn();
          //if playing vs computer get computer choice
          if (display.getMode() === 1 && playerTurn === player2) {
            if (!getComputerChoice()) playerTurn = player1;
          }
        },
        { once: true }
      )
    );
    cells.forEach((cell) =>
      cell.addEventListener("mouseover", () => {
        cell.setAttribute("temp-data", playerTurn.getPlayingAs());
      })
    );
  };
  return { playGame };
}

function DisplayController() {
  let board = document.querySelector(".game-board");
  let mode = "";

  const gameOver = () => board.classList.toggle("game-over");

  const createGameBoard = (boardLength) => {
    board.replaceChildren();
    setMode();
    for (let i = 0; i < boardLength; i++) {
      const row = document.createElement("div");
      row.className = `row-${i}`;
      for (let j = 0; j < boardLength; j++) {
        const cell = document.createElement("div");
        cell.className = `cell-${j}`;
        cell.setAttribute("data", "");
        cell.setAttribute("temp-data", "X");
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

  const getMode = () => mode;
  const setMode = () => {
    const img = document.querySelector(".game-mode > img").getAttribute("src");
    if (mode === "") mode = img.includes("one") ? 1 : 2;
    else mode = mode === 1 ? 2 : 1;
  };
  const switchModes = (function () {
    const gameMode = document.querySelector(".game-mode");
    gameMode.addEventListener("click", () => {
      console.log("in board swutcher");
      const img = gameMode.querySelector("img");
      setMode();
      img.setAttribute(
        "src",
        mode === 2 ? "images/two-players.svg" : "images/one-player.svg"
      );
      clearBoard();
      clearScores();
    });
  })();

  const newGame = () => {
    board.addEventListener(
      "click",
      () => {
        clearBoard();
        return true;
      },
      { once: true }
    );
  };

  const clearBoard = () => {
    board.classList.remove("game-over");
  };

  const updateScores = (player) => {
    if (player === undefined) {
      const ties = document.querySelector(".ties > .score");
      ties.innerText = parseInt(ties.innerText) + 1;
    } else if (player.getName() === "Player 1") {
      const player = document.querySelector(".player-1 > .score");
      player.innerText = parseInt(player.innerText) + 1;
    } else if (player.getName() === "Player 2") {
      const player = document.querySelector(".player-2 > .score");
      player.innerText = parseInt(player.innerText) + 1;
    }
  };

  const clearScores = () => {
    const scores = document.querySelectorAll(".score");
    scores.forEach((score) => {
      console.log(score);
      score.innerText = "0";
    });
  };

  return {
    createGameBoard,
    displayBoard,
    getCells,
    showWinningCombo,
    fillCell,
    gameOver,
    getMode,
    newGame,
    updateScores,
  };
}

GameController().playGame();
