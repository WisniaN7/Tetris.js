class Block {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    draw(ctx, size) {
        ctx.fillRect(size * this.x, size * this.y, size, size);
    }
}
export { Block };
