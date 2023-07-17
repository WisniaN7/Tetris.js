import { Tetromino, IShape, OShape, TShape, JShape, LShape, ZShape, SShape } from './tetromino.js';

class PiecesQueue {
    private queue = []
    private piecesQueueUI: HTMLElement
    private static instance: PiecesQueue
    private readonly startingCoords = { x: 4, y: 0 }
    private readonly grid: string[][]
    private readonly tetrominosConstructors = [
        IShape,
        OShape,
        TShape,
        JShape,
        LShape,
        ZShape,
        SShape
    ]

    constructor(piecesQueueUI: HTMLElement, grid: string[][]) {
        if (PiecesQueue.instance) return PiecesQueue.instance

        this.piecesQueueUI = piecesQueueUI
        this.grid = grid
        PiecesQueue.instance = this

        for (let i = 0; i < 2; i++)
            this.queue.push(...this.randomSack())

        for (let i = 0; i < 4; i++) {
            const piece = document.createElement('img')
            piece.src = `./public/img/${this.queue[i].constructor.name}.svg`
            piecesQueueUI.appendChild(piece)
        }
    }

    shift(): any {
        if (this.queue.length < 7)
            this.queue.push(...this.randomSack())

        const tetromino = this.queue.shift()
        this.updateUI()

        return tetromino
    }

    updateUI(): void {
        this.piecesQueueUI.removeChild(this.piecesQueueUI.querySelector('img'))
        const piece = document.createElement('img')
        piece.src = `./public/img/${this.queue[3].constructor.name}.svg`
        this.piecesQueueUI.appendChild(piece)
    }

    private randomSack(){
        const tetrominos = this.tetrominosConstructors
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => new value(this.startingCoords.x, this.startingCoords.y, this.grid))

        return tetrominos
    }
}

export { PiecesQueue }