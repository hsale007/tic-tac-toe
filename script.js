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

  const fillCell = (value, playingAs) => {
    if (isNaN(value)) {
      console.log("Please enter a number between 1-9");
      return false;
    }
    if (value < 1 || value > 9) {
      console.log("Please enter a value between 1-9");
      return false;
    }
    const cell = Cell();
    const [row, col] = cell.validateUserInput(value);
    if (board[row][col]) {
      console.log(`${value} is already taken. Please enter a different value.`);
      return false;
    }
    board[row][col] = playingAs;
    cellsFilled++;
    return true;
  };

  const checkRow = (value, playingAs) => {
    const row = Math.floor(value / 3);
    for (let j = 0; j < cols; j++) {
      if (board[row][j] !== playingAs) return false;
    }
    return true;
  };

  const checkCol = (value, playingAs) => {
    const row = Math.floor(value / 3);
    const col = value - row * 3;

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
    fillCell,
    isWinner,
    totalCells,
    getCellsFilled,
  };
}

function Cell() {
  const validateUserInput = (value) => {
    //find spot in 2d array
    const row = Math.floor(--value / 3);
    const col = value - row * 3;
    return [row, col];
  };

  return { validateUserInput };
}

function Player() {
  const name = prompt("What should we call you?");
  let playingAs;
  const getName = () => name;

  const askPlayingAs = () => {
    do {
      playingAs = prompt(`${name} would you like to be X or O`).toUpperCase();
    } while (playingAs !== "X" && playingAs !== "O");
  };

  const setPlayingAs = (value) => (playingAs = value);
  const getPlayingAs = () => playingAs;

  const playerInfo = () => `${name}\nPlaying as ${playingAs}`;

  return { getName, askPlayingAs, setPlayingAs, getPlayingAs, playerInfo };
}

function GameController() {
  const board = GameBoard();
  console.log("Welcome to Tic-Tac-Toe Console Edition!");
  board.printBoard();
  const player1 = Player();
  player1.askPlayingAs();
  const player2 = Player();
  player2PlayingAs = player1.getPlayingAs() === "X" ? "O" : "X";
  player2.setPlayingAs(player2PlayingAs);
  let playerTurn = "";

  const isGameOver = (userValue, playingAs) =>
    board.isWinner(--userValue, playingAs);
  const boardFull = () => board.getCellsFilled() === board.totalCells();
  const getPlayerTurn = () => {
    return (playerTurn =
      playerTurn === ""
        ? player1.getPlayingAs === "X"
          ? player1
          : player2
        : playerTurn === player1
        ? player2
        : player1);
  };

  const playGame = () => {
    playerTurn = getPlayerTurn();
    while (!boardFull()) {
      let playingAs = playerTurn.getPlayingAs();
      let userValue;
      do {
        userValue = prompt(
          `${playerTurn.getName()} (${playerTurn.getPlayingAs()}) please enter a number between 1-9?`
        );
        if (userValue === null) return; //user quit
      } while (!board.fillCell(userValue, playingAs));
      console.log("Player 1: " + player1.playerInfo());
      console.log("Player 2: " + player2.playerInfo());
      board.printBoard();

      if (
        board.getCellsFilled() >= board.getBoard().length * 2 - 1 &&
        isGameOver(userValue, playingAs)
      ) {
        console.log(
          `CONGRATULATIONS! ${playerTurn.getName()} You Are The Winner!`
        );
        return;
      }
      playerTurn = getPlayerTurn();
    }
  };
  return { playGame };
}

GameController().playGame();
