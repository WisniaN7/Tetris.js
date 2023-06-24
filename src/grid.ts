import { Block } from './block.js'

class Grid {
    private width: number = 10
    private height: number = 20
    private blockSize: number
    private grid: Block[][]

    constructor(canvas: HTMLCanvasElement) {
        this.blockSize = canvas.width / this.width
        this.grid = new Array(this.height)

        for (let i = 0; i < this.height; i++)
            this.grid[i] = new Array(this.width).fill(null)
    }

    get BlockSize(): number { return this.blockSize }

    drawGrid(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext('2d')
        ctx.strokeStyle = '#666'

        for (let i = 0; i < this.height; i++) {
            ctx.beginPath()
            ctx.moveTo(0, i * this.blockSize)
            ctx.lineTo(canvas.width, i * this.blockSize)
            ctx.stroke()
        }

        for (let i = 0; i < this.width; i++) {
            ctx.beginPath()
            ctx.moveTo(i * this.blockSize, 0)
            ctx.lineTo(i * this.blockSize, canvas.height)
            ctx.stroke()
        }
    }
}

export { Grid }