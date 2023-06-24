import { Block } from './block.js'

abstract class Tetromino {
    protected x: number
    protected y: number
    protected blocks: Block[]
    protected color: string

    constructor(x: number, y: number, blocks: Block[], color: string) {
        this.x = x
        this.y = y
        this.blocks = blocks
        this.color = color
    }
    
    draw(ctx: CanvasRenderingContext2D, size: number): void {
        ctx.fillStyle = this.color
        this.blocks.forEach(block => block.draw(ctx, size))
    }
        
    rotate(): void {
        this.blocks.forEach(block => {
            const x = block.x - this.x
            const y = block.y - this.y
            block.x = this.x - y
            block.y = this.y + x
        })
    }

    moveLeft(): void { this.x-- }
    moveRight(): void { this.x++ }
    moveDown(): void { this.y++ }
    moveUp(): void { this.y-- }
}

class Straight extends Tetromino {
    private orientation: number = 0
    
    constructor(x: number, y: number) {
        super(x, y, [
            new Block(x - 1, y + 0),
            new Block(x + 0, y + 0),
            new Block(x + 1, y + 0),
            new Block(x + 2, y + 0)
        ], '#0ff')
    }

    rotate(): void {
        for (let i = 0; i < 4; i++) {
            this.blocks[i].x += (this.orientation % 2 === 0 ? 2 - i : 1 - i) * (this.orientation < 2 ? 1 : -1)
            this.blocks[i].y += (this.orientation % 2 === 1 ? 2 - i : 1 - i) * (this.orientation === 0 || this.orientation === 3 ? -1 : 1)
        }

        this.orientation = (this.orientation + 1) % 4
    }
}

class Square extends Tetromino {
    constructor(x: number, y: number) {
        super(x, y, [
            new Block(x + 0, y + 0),
            new Block(x + 1, y + 0),
            new Block(x + 0, y + 1),
            new Block(x + 1, y + 1)
        ], '#ff0')
    }

    rotate(): void { }
}

class TShape extends Tetromino {
    constructor(x: number, y: number) {
        super(x, y, [
            new Block(x + 0, y + 0),
            new Block(x - 1, y + 0),
            new Block(x + 1, y + 0),
            new Block(x + 0, y - 1)
        ], '#90f')
    }
}

class LShapeLeft extends Tetromino {
    constructor(x: number, y: number) {
        super(x, y, [
            new Block(x + 0, y + 0),
            new Block(x - 1, y + 0),
            new Block(x - 1, y - 1),
            new Block(x + 1, y + 0)
        ], '#00f')
    }
}

class LShapeRight extends Tetromino {
    constructor(x: number, y: number) {
        super(x, y, [
            new Block(x + 0, y + 0),
            new Block(x + 1, y + 0),
            new Block(x + 1, y - 1),
            new Block(x - 1, y + 0)
        ], '#fa0')
    }
}

class SkewShapeLeft extends Tetromino {
    constructor(x: number, y: number) {
        super(x, y, [
            new Block(x + 0, y + 0),
            new Block(x + 0, y - 1),
            new Block(x - 1, y - 1),
            new Block(x + 1, y + 0)
        ], '#f00')
    }
}

class SkewShapeRight extends Tetromino {
    constructor(x: number, y: number) {
        super(x, y, [
            new Block(x + 0, y + 0),
            new Block(x - 1, y + 0),
            new Block(x + 0, y - 1),
            new Block(x + 1, y - 1)
        ], '#0f0')
    }
}

export {
    Straight,
    Square,
    TShape,
    LShapeLeft,
    LShapeRight,
    SkewShapeLeft,
    SkewShapeRight
}