const socket = new WebSocket('ws://localhost:8080');
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
let currentPlayer = '';
let myTurn = false;

socket.onopen = () => {
    console.log('Connected to WebSocket server.');
};

socket.onmessage = (message) => {
    const data = JSON.parse(message.data);

    if (data.start) {
        // Assign player symbol and start the game
        currentPlayer = data.player;
        myTurn = currentPlayer === 'X'; // X always starts
        statusDisplay.innerText = myTurn ? "Your turn!" : "Opponent's turn!";
    } else if (data.move !== undefined) {
        // Update the board with the opponent's move
        cells[data.move].innerText = data.player;
        myTurn = data.player !== currentPlayer;
        statusDisplay.innerText = myTurn ? "Your turn!" : "Opponent's turn!";
        checkWinner();
    } else if (data.message) {
        statusDisplay.innerText = data.message;
    }
};

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (myTurn && !cell.innerText) {
            cell.innerText = currentPlayer;
            socket.send(JSON.stringify({ move: index, player: currentPlayer }));
            myTurn = false;
            statusDisplay.innerText = "Opponent's turn!";
            checkWinner();
        }
    });
});

function checkWinner() {
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

    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (cells[a].innerText && cells[a].innerText === cells[b].innerText && cells[a].innerText === cells[c].innerText) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerText = `Player ${currentPlayer} wins!`;
        socket.close(); // End the game
        return;
    }

    if ([...cells].every(cell => cell.innerText)) {
        statusDisplay.innerText = "It's a draw!";
        socket.close(); // End the game
    }
}
