const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

let players = [];
let currentPlayerIndex = 0;

server.on('connection', (ws) => {
    players.push(ws);

    // Assign players and start the game
    if (players.length === 2) {
        players.forEach((player, index) => {
            player.send(JSON.stringify({ start: true, player: index === 0 ? 'X' : 'O' }));
        });
    } else if (players.length > 2) {
        // Limit to two players
        ws.send(JSON.stringify({ message: "Game is full. Please try again later." }));
        ws.close();
    }

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        // Broadcast the move to the other player
        players.forEach((player, index) => {
            if (player !== ws && player.readyState === WebSocket.OPEN) {
                player.send(JSON.stringify({ move: data.move, player: data.player }));
            }
        });

        // Update current player index
        currentPlayerIndex = (currentPlayerIndex + 1) % 2;
    });

    ws.on('close', () => {
        // Remove the disconnected player
        players = players.filter(player => player !== ws);

        // Notify the remaining player
        if (players.length === 1) {
            players[0].send(JSON.stringify({ message: "Opponent disconnected. Game over." }));
        }
    });
});

console.log('WebSocket server running on ws://localhost:8080');
