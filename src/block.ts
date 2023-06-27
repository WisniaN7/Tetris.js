class Block {
    x: number
    y: number
    private color: string

    constructor(x: number, y: number, color: string) {
        this.x = x
        this.y = y
        this.color = color
    }

    get Color(): string { return this.color }

    draw(ctx: CanvasRenderingContext2D, size: number): void {
        ctx.fillStyle = this.color
        
        ctx.fillRect(
            size * this.x,
            size * this.y,
            size,
            size
        )
    }
}

export { Block }