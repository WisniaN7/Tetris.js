import { Grid } from './grid.js';
import { Tetromino } from './tetromino.js';
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const grid = new Grid(canvas);
let tetromino = Tetromino.random(4, 0, grid.Grid);
const piecesQueue = [Tetromino.random(4, 0, grid.Grid), Tetromino.random(4, 0, grid.Grid), Tetromino.random(4, 0, grid.Grid), Tetromino.random(4, 0, grid.Grid)];
const piecesQueueUI = document.querySelector('#piecesQueue');
let heldPiece;
const heldPieceUI = document.querySelector('#hold');
let heldPieceCanSwitch = true;
piecesQueue.forEach(tetromino => {
    const piece = document.createElement('img');
    piece.src = `./public/img/${tetromino.constructor.name}.svg`;
    piecesQueueUI.appendChild(piece);
});
const interval = setInterval(() => {
    if (!tetromino.moveDown()) {
        grid.placeTetromino(tetromino);
        tetromino = piecesQueue.shift();
        piecesQueue.push(Tetromino.random(4, 0, grid.Grid));
        updatePieceQueue();
        heldPieceCanSwitch = true;
    }
}, 500);
document.addEventListener('keydown', event => {
    if (event.key == 'ArrowLeft' || event.key == 'a')
        tetromino.moveLeft();
    if (event.key == 'ArrowRight' || event.key == 'd')
        tetromino.moveRight();
    if (event.key == 'ArrowUp' || event.key == 'w' || event.key == 'r')
        tetromino.rotate();
    if (event.key == 'ArrowDown' || event.key == 's')
        tetromino.moveDown();
    if (event.key == ' ')
        tetromino.hardDrop();
    if (heldPieceCanSwitch && (event.key == 'Shift' || event.key == 'c')) {
        heldPieceCanSwitch = false;
        if (heldPiece) {
            const temp = tetromino;
            tetromino = heldPiece;
            heldPiece = temp;
            heldPiece.setLocation(4, 0);
            heldPieceUI.removeChild(heldPieceUI.querySelector('img'));
        }
        else {
            heldPiece = tetromino;
            tetromino = piecesQueue.shift();
            piecesQueue.push(Tetromino.random(4, 0, grid.Grid));
            updatePieceQueue();
        }
        const piece = document.createElement('img');
        piece.src = `./public/img/${heldPiece.constructor.name}.svg`;
        heldPieceUI.appendChild(piece);
    }
});
const gameLoop = () => {
    requestAnimationFrame(gameLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    tetromino.draw(ctx, grid.BlockSize);
    grid.draw(canvas);
};
gameLoop();
function updatePieceQueue() {
    piecesQueueUI.removeChild(piecesQueueUI.querySelector('img'));
    const piece = document.createElement('img');
    piece.src = `./public/img/${piecesQueue.at(-1).constructor.name}.svg`;
    piecesQueueUI.appendChild(piece);
}
