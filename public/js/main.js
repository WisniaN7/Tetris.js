import { Grid } from './grid.js';
import { PiecesQueue } from './piecesQueue.js';
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let score = 0;
let level = 0;
let fallDelay = (48 / 60) * 1000;
let linesCleared = 0;
const clearedLinesToPoints = [0, 100, 300, 500, 800];
let combo = 0;
const grid = new Grid(canvas);
const piecesQueueUI = document.querySelector('#piecesQueue');
const piecesQueue = new PiecesQueue(piecesQueueUI, grid.Grid);
let tetromino = piecesQueue.shift();
let heldPiece;
const heldPieceUI = document.querySelector('#hold');
let heldPieceCanSwitch = true;
const scoreUI = document.querySelector('#score p');
const linesClearedUI = document.querySelector('#lines p');
const levelUI = document.querySelector('#level p');
let fallInterval = setInterval(() => tetrominoFall(), fallDelay);
// TODO: Refactor this
document.addEventListener('keydown', event => {
    if (event.key == 'ArrowLeft' || event.key == 'a')
        tetromino.moveLeft();
    if (event.key == 'ArrowRight' || event.key == 'd')
        tetromino.moveRight();
    if (event.key == 'ArrowUp' || event.key == 'w' || event.key == 'r')
        tetromino.rotateClockwise();
    if (event.key == 'z' || event.key == 'Control')
        tetromino.rotateCounterClockwise();
    if (event.key == 'ArrowDown' || event.key == 's') {
        if (tetromino.moveDown()) {
            score++;
            scoreUI.textContent = score.toString();
        }
    }
    if (event.key == ' ') {
        score += tetromino.hardDrop() * 2;
        clearInterval(fallInterval);
        tetrominoFall();
        fallInterval = setInterval(() => tetrominoFall(), fallDelay);
    }
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
function tetrominoFall() {
    if (!tetromino.moveDown()) {
        const rowsRemoved = grid.placeTetromino(tetromino);
        linesCleared += rowsRemoved;
        linesClearedUI.textContent = linesCleared.toString();
        score += clearedLinesToPoints[rowsRemoved] * level;
        scoreUI.textContent = score.toString();
        tetromino = piecesQueue.shift();
        tetromino.Blocks.forEach(block => {
            if (grid.Grid[block.y][block.x]) {
                clearInterval(fallInterval);
                console.log('Game Over');
            }
        });
        heldPieceCanSwitch = true;
    }
}
