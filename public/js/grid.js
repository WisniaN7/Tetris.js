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
    drawGrid(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#666';
        for (let i = 0; i < this.height; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * this.blockSize);
            ctx.lineTo(canvas.width, i * this.blockSize);
            ctx.stroke();
        }
        for (let i = 0; i < this.width; i++) {
            ctx.beginPath();
            ctx.moveTo(i * this.blockSize, 0);
            ctx.lineTo(i * this.blockSize, canvas.height);
            ctx.stroke();
        }
    }
}
export { Grid };
