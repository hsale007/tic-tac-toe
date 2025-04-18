function GameBoard() {
  const rows = 3;
  const cols = 3;
  let cellsFilled = 0;
  let board = [];

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

  const fillCell = (value, playingAs) => {
    if (isNaN(value)) {
      console.log(`Please enter a number between 1-${totalCells()}`);
      return false;
    }
    if (value < 1 || value > totalCells()) {
      console.log(`Please enter a number between 1-${totalCells()}`);
      return false;
    }
    const cell = Cell();
    const [row, col] = cell.validateUserInput(value, board.length);
    if (board[row][col]) {
      console.log(`${value} is already taken. Please enter a different value.`);
      return false;
    }
    board[row][col] = playingAs;
    const domCell = document
      .querySelector(`.row-${row}`)
      .querySelector(`.cell-${col}`);
    board[row][col] = domCell.innerText = playingAs;
    domCell.setAttribute("data", playingAs);
    cellsFilled++;
    return true;
  };

  const checkRow = (value, playingAs) => {
    const row = Math.floor(value / board.length);
    for (let j = 0; j < cols; j++) {
      if (board[row][j] !== playingAs) return false;
    }
    return true;
  };

  const checkCol = (value, playingAs) => {
    const row = Math.floor(value / board.length);
    const col = value - row * board.length;

    for (let i = 0; i < rows; i++) {
      if (board[i][col] !== playingAs) return false;
    }
    return true;
  };

  const checkDiag = (value, playingAs) => {
    // Need to see if user placement is diagnoal position
    // HOW TO CHECK
    // FIND OUT WHAT CORNERS ARE DIVISBLE BY
    // FIND RIGHT CORNER
    // FIND SECOND NUMBER IN LEFT CORNER PATH (skip leftmost corner since it is 0)
    // IF USERVALUE IS DIVISIBLE BY EITHER CORNER THEN WE KNOW USER HAS A CHANCE TO WIN DIAGNOALLY
    const rightCorner = board.length - 1;
    const leftCorner = board.length + 1;
    // console.log(value % rightCorner);

    //check if user is in a possible diagnoal path
    if (value % rightCorner !== 0 && value % leftCorner !== 0) return false;

    //check if user is coming from the left or the right side
    if (value % leftCorner === 0) {
      let row = (col = 0);
      while (col < board.length) {
        if (board[row++][col++] !== playingAs) return false;
      }
    }
    if (
      value % rightCorner === 0 &&
      value !== board.length * board.length - 1
    ) {
      let row = 0;
      let col = board.length - 1;
      while (col >= 0) {
        if (board[row++][col--] !== playingAs) return false;
      }
    }
    return true;
  };

  const isWinner = (value, playingAs) => {
    return (
      checkRow(value, playingAs) ||
      checkCol(value, playingAs) ||
      checkDiag(value, playingAs)
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

  const isGameOver = (userValue, playingAs) =>
    board.isWinner(--userValue, playingAs);
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
    setPlayerTurn();
    while (!boardFull()) {
      let playingAs = playerTurn.getPlayingAs();
      let userValue;
      // do {
      //   userValue = prompt(
      //     `${playerTurn.getName()} (${playerTurn.getPlayingAs()}) Please enter a number between 1-${board.totalCells()}`
      //   );
      //   if (userValue === null) return; //user quit
      const cells = display.getCells();
      console.log(cells);
      cells.forEach((cell) =>
        cell.addEventListener(
          "click",
          (e) => {
            cell.innerText = playingAs;
            cell.setAttribute("data", playingAs);
            board.incrementCellsFilled();
            let row = e.target.parentElement.className.split("-")[1];
            let col = cell.className.split("-")[1];
            cell.classList.toggle("disabled");

            userValue = ++row * ++col;
            board.fillCell(userValue, playingAs);
            board.printBoard();

            if (
              board.getCellsFilled() >= board.getBoard().length * 2 - 1 &&
              isGameOver(cell)
            ) {
              console.log(
                `CONGRATULATIONS! ${playerTurn.getName()} You Are The Winner!`
              );
              return;
            }
          },
          { once: true }
        )
      );
      return;
      // while (!board.fillCell(userValue, playingAs));
      // console.log("Player 1: " + player1.playerInfo());
      // console.log("Player 2: " + player2.playerInfo());
      // board.printBoard();

      if (
        board.getCellsFilled() >= board.getBoard().length * 2 - 1 &&
        isGameOver(cell)
      ) {
        console.log(
          `CONGRATULATIONS! ${playerTurn.getName()} You Are The Winner!`
        );
        return;
      }
      setPlayerTurn();
    }
  };
  return { playGame };
}

function DisplayController() {
  const board = document.querySelector(".game-board");
  const gameBoard = GameBoard().getBoard();
  console.log(gameBoard.length);

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

  const displayBoard = () => board;
  const getCells = () => document.querySelectorAll('[class^="cell"]');

  return { createGameBoard, displayBoard, getCells };
}

GameController().playGame();
