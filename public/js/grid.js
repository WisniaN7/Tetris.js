class Grid {
    width = 10;
    height = 20;
    blockSize;
    grid;
    constructor(canvas) {
        this.blockSize = canvas.width / this.width;
        this.grid = new Array(this.height);
        for (let i = 0; i < this.height; i++)
            this.grid[i] = new Array(this.width).fill(null);
    }
    get BlockSize() { return this.blockSize; }
    get Grid() { return this.grid; }
    draw(canvas) {
        const ctx = canvas.getContext('2d');
        this.drawBlocks(ctx);
        this.drawGrid(ctx, canvas.width, canvas.height);
    }
    drawGrid(ctx, width, height) {
        ctx.strokeStyle = '#666';
        for (let i = 0; i < this.height; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * this.blockSize);
            ctx.lineTo(width, i * this.blockSize);
            ctx.stroke();
        }
        for (let i = 0; i < this.width; i++) {
            ctx.beginPath();
            ctx.moveTo(i * this.blockSize, 0);
            ctx.lineTo(i * this.blockSize, height);
            ctx.stroke();
        }
    }
    drawBlocks(ctx) {
        this.grid.forEach((row, y) => row.forEach((block, x) => {
            if (block !== null) {
                ctx.fillStyle = block;
                ctx.fillRect(this.blockSize * x, this.blockSize * y, this.blockSize, this.blockSize);
            }
        }));
    }
    placeTetromino(tetromino) {
        tetromino.Blocks.forEach(block => {
            this.grid[block.y][block.x] = block.Color;
        });
        this.removeFullRows();
    }
    removeFullRows() {
        for (let i = 0; i < this.height; i++)
            if (this.isRowFull(i))
                this.removeRow(i);
    }
    removeRow(row) {
        for (let i = 0; i < this.width; i++)
            this.grid[row][i] = null;
        this.shiftRows(row);
    }
    shiftRows(from) {
        for (let i = from; i > 0; i--)
            this.shiftRow(i);
    }
    shiftRow(row) {
        for (let i = row; i > 0; i--)
            this.grid[i] = this.grid[i - 1];
        this.grid[0] = new Array(this.width).fill(null);
    }
    isRowFull(row) { return this.grid[row].every(block => block !== null); }
    isRowEmpty(row) { return this.grid[row].every(block => block === null); }
}
export { Grid };
