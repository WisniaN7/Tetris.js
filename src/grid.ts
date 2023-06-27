import { Block } from './block.js'
import { Tetromino } from './tetromino.js'

class Grid {
    private width: number = 10
    private height: number = 20
    private blockSize: number
    private grid: string[][]

    constructor(canvas: HTMLCanvasElement) {
        this.blockSize = canvas.width / this.width
        this.grid = new Array(this.height)

        for (let i = 0; i < this.height; i++)
            this.grid[i] = new Array(this.width).fill(null)
    }

    get BlockSize(): number { return this.blockSize }
    get Grid(): string[][] { return this.grid }

    draw(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext('2d')
        this.drawBlocks(ctx)
        this.drawGrid(ctx, canvas.width, canvas.height)
    }

    drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.strokeStyle = '#666'

        for (let i = 0; i < this.height; i++) {
            ctx.beginPath()
            ctx.moveTo(0, i * this.blockSize)
            ctx.lineTo(width, i * this.blockSize)
            ctx.stroke()
        }

        for (let i = 0; i < this.width; i++) {
            ctx.beginPath()
            ctx.moveTo(i * this.blockSize, 0)
            ctx.lineTo(i * this.blockSize, height)
            ctx.stroke()
        }
    }

    drawBlocks(ctx: CanvasRenderingContext2D): void {
        this.grid.forEach((row, y) => row.forEach((block, x) => {
            if (block !== null) {
                ctx.fillStyle = block

                ctx.fillRect(
                    this.blockSize * x,
                    this.blockSize * y,
                    this.blockSize,
                    this.blockSize
                )
            }
        }))
    }

    placeTetromino(tetromino: Tetromino): void {
        tetromino.Blocks.forEach(block => {
            this.grid[block.y][block.x] = block.Color
        })

        this.removeFullRows()
    }

    private removeFullRows(): void {
        for (let i = 0; i < this.height; i++)
            if (this.isRowFull(i))
                this.removeRow(i)
    }

    private removeRow(row: number): void {
        for (let i = 0; i < this.width; i++)
            this.grid[row][i] = null

        this.shiftRows(row)
    }

    
    private shiftRows(from: number): void {
        for (let i = from; i > 0; i--)
            this.shiftRow(i)
    }
    
    private shiftRow(row: number): void {
        for (let i = row; i > 0; i--)
            this.grid[i] = this.grid[i - 1]
        
        this.grid[0] = new Array(this.width).fill(null)
    }

    private isRowFull(row: number): boolean { return this.grid[row].every(block => block !== null) }

    private isRowEmpty(row: number): boolean { return this.grid[row].every(block => block === null) }
}

export { Grid }