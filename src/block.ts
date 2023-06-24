class Block {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    draw(ctx: CanvasRenderingContext2D, size: number): void {
        
        ctx.fillRect(
            size * this.x,
            size * this.y,
            size,
            size
        )
    }
}

export { Block }