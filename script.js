function GameBoard() {
  let cellsFilled = 0;
  let rows = 3;
  let cols = 3;
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
  let score = 0;

  const getName = () => name;
  const setName = (value) => (name = value);
  const setPlayingAs = (value) => (playingAs = value);
  const getPlayingAs = () => playingAs;
  const incrementScore = () => score++;
  const getScore = () => score;

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
    incrementScore,
    getScore,
  };
}

function GameController() {
  let board = GameBoard();
  const boardLength = board.getBoard().length;
  const [player1, player2] = Player().createPlayers();
  let playerTurn = player1;
  let formerPlayer = playerTurn;
  let ties = 0;

  const isGameOver = (row, col, playingAs) => {
    if (
      board.getCellsFilled() >= boardLength * 2 - 1 &&
      board.isWinner(row, col, playingAs)
    ) {
      playerTurn.incrementScore();
      return true;
    }
    if (boardFull()) {
      ties++;
      return true;
    }
    return false;
  };
  //create a new gameboard when user plays again
  const getWinningCombo = () => board.getWinningCombo();
  const newBoard = () => (board = GameBoard());
  const boardFull = () => board.getCellsFilled() === board.totalCells();
  const setPlayerTurn = () => {
    playerTurn = playerTurn === player1 ? player2 : player1;
  };
  const currentPlayer = () => playerTurn;
  //swap which player goes first for each game
  const whoGoesFirst = () =>
    (playerTurn = formerPlayer = formerPlayer === player1 ? player2 : player1);
  const getScores = () => [ties, player1.getScore(), player2.getScore()];
  //random cell selection by computer
  const getComputerChoice = () => {
    let row, col;
    do {
      row = Math.floor(Math.random() * boardLength);
      col = Math.floor(Math.random() * boardLength);
    } while (!board.fillCell(row, col, "O"));
    const cell = document
      .querySelector(`.row-${row}`)
      .querySelector(`.cell-${col}`);
    return [row, col, cell];
  };

  const fillCell = (row, col, playingAs) => board.fillCell(row, col, playingAs);
  const printBoard = () => board.printBoard();
  return {
    isGameOver,
    currentPlayer,
    setPlayerTurn,
    fillCell,
    getWinningCombo,
    newBoard,
    getComputerChoice,
    whoGoesFirst,
    printBoard,
    getScores,
  };
}

function DisplayController() {
  let displayBoard = document.querySelector(".game-board");
  let game = GameController();
  let mode = 2; //game starts on 2P mode

  //check if user switches between 2p & 1p mode
  const switchModes = (function () {
    const gameMode = document.querySelector(".game-mode");
    gameMode.addEventListener("click", () => {
      const img = gameMode.querySelector("img");
      mode = mode === 1 ? 2 : 1;
      img.setAttribute(
        "src",
        mode === 2 ? "images/two-players.svg" : "images/one-player.svg"
      );
      game = 0;
      game = GameController();
      clearBoard();
      clearScores();
    });
  })();
  const getCells = () => document.querySelectorAll('[class^="cell"]');

  const createGameBoard = (boardLength) => {
    displayBoard.innerText = ""; //clear board if necessary (i.e playing again)
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
      displayBoard.appendChild(row);
    }
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

  const gameOver = () => {
    displayBoard.classList.toggle("game-over");
    game.whoGoesFirst();
    newGame();
  };
  const newGame = () => {
    displayBoard.addEventListener(
      "click",
      () => {
        clearBoard();
      },
      { once: true }
    );
  };
  const clearBoard = () => {
    displayBoard.innerText = "";
    displayBoard.classList.remove("game-over");
    game.newBoard();
    updateScreen();
  };

  const updateScores = () => {
    const scores = game.getScores();
    document.querySelector(".ties > .score").innerText = scores[0];
    document.querySelector(".player-1 > .score").innerText = scores[1];
    document.querySelector(".player-2 > .score").innerText = scores[2];
  };
  const clearScores = () => {
    const scores = document.querySelectorAll(".score");
    scores.forEach((score) => {
      score.innerText = "0";
    });
  };

  const fillCell = (cell, playingAs) => {
    cell.innerText = playingAs;
    cell.setAttribute("data", playingAs);
    cell.classList.toggle("filled");
  };

  const computerTurn = () => {
    if (mode === 1 && game.currentPlayer().getPlayingAs() == "O") {
      const compChoice = game.getComputerChoice();
      displayBoard.classList.toggle("game-over");
      //wait for computer to guess - don't allow user to select any cells
      setTimeout(() => {
        compChoice[2].click();
        displayBoard.classList.toggle("game-over");
      }, 200);
    }
  };

  const updateScreen = () => {
    createGameBoard(3);

    const cells = getCells();
    //allow user to interact with board
    cells.forEach((cell) =>
      cell.addEventListener(
        "click",
        (e) => {
          e.stopPropagation();
          let row = e.target.parentElement.className.split("-")[1];
          let col = cell.className.split("-")[1];
          game.fillCell(row, col, game.currentPlayer().getPlayingAs());
          fillCell(cell, game.currentPlayer().getPlayingAs());
          game.printBoard();
          if (game.isGameOver(row, col, game.currentPlayer().getPlayingAs())) {
            showWinningCombo(game.getWinningCombo());
            updateScores(game.currentPlayer());
            gameOver();
            return;
          }
          game.setPlayerTurn();
          computerTurn();
        },
        { once: true }
      )
    );
    computerTurn(); // check if computer is supposed to go first

    //show whose turn it currently is
    cells.forEach((cell) =>
      cell.addEventListener("mouseover", () => {
        cell.setAttribute("temp-data", game.currentPlayer().getPlayingAs());
      })
    );
  };
  //initally start the game
  updateScreen();
}

DisplayController();
