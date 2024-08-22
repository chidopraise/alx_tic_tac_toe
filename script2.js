const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart');

let currentPlayer = 'X';
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(index) {
    if (gameActive && cells[index].innerText === '') {
        cells[index].innerText = currentPlayer;
        checkWinner();
        if (gameActive) {
            currentPlayer = 'O';
            statusDisplay.innerText = "Computer's turn...";
            setTimeout(computerMove, 500);
        }
    }
}

function computerMove() {
    const emptyCells = [];
    cells.forEach((cell, index) => {
        if (cell.innerText === '') {
            emptyCells.push(index);
        }
    });

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    cells[randomIndex].innerText = 'O';
    checkWinner();
    if (gameActive) {
        currentPlayer = 'X';
        statusDisplay.innerText = "Your turn!";
    }
}

function checkWinner() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (cells[a].innerText === '' || cells[b].innerText === '' || cells[c].innerText === '') {
            continue;
        }
        if (cells[a].innerText === cells[b].innerText && cells[b].innerText === cells[c].innerText) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerText = `Player ${currentPlayer} has won!`;
        gameActive = false;
    } else if (![...cells].some(cell => cell.innerText === '')) {
        statusDisplay.innerText = `Game ended in a draw!`;
        gameActive = false;
    }
}

function restartGame() {
    cells.forEach(cell => cell.innerText = '');
    currentPlayer = 'X';
    gameActive = true;
    statusDisplay.innerText = "Your turn!";
}

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
});

restartButton.addEventListener('click', restartGame);
