class Block {
    x;
    y;
    color;
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
    get Color() { return this.color; }
    draw(ctx, size) {
        ctx.fillStyle = this.color;
        ctx.fillRect(size * this.x, size * this.y, size, size);
    }
}
export { Block };
