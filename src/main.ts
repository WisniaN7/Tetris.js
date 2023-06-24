import { Grid } from './grid.js'
import * as Tetromino from './tetromino.js'

const canvas = document.querySelector('canvas') 
const ctx = canvas.getContext('2d')

const grid = new Grid(canvas)
const shape = new Tetromino.Straight(5, 5)

setInterval(() => {
    shape.rotate()
}, 500);

const gameLoop = () => {
    requestAnimationFrame(gameLoop)
    ctx.fillStyle = '#222'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    grid.drawGrid(canvas)
    shape.draw(ctx, grid.BlockSize)
}

gameLoop()

