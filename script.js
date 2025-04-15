function GameBoard() {
  const rows = 3;
  const cols = 3;
  let board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i][j] = 0;
    }
  }

  const getBoard = () => board;

  //check if value enters is valid
  const validateUserInput = (input) => {
    if (input < 0 || input > 9) console.log("Bad Input");
  };

  return { getBoard };
}

function GameController() {
  const player1 = {
    name: "Bill",
  };
  const player2 = {
    name: "Greg",
  };
}

const board = GameBoard();
console.log(board.getBoard());
