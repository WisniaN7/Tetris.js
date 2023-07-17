import { Block } from './block.js';
class Tetromino {
    x;
    y;
    blocks;
    grid;
    constructor(x, y, coords, color, grid) {
        this.x = x;
        this.y = y;
        this.blocks = [
            new Block(coords[0].x, coords[0].y, color),
            new Block(coords[1].x, coords[1].y, color),
            new Block(coords[2].x, coords[2].y, color),
            new Block(coords[3].x, coords[3].y, color)
        ];
        this.grid = grid;
    }
    get Blocks() { return this.blocks; }
    // TODO: clean up 
    draw(ctx, size) {
        const coords = this.blocks.map(block => ({ x: block.x, y: block.y }));
        let minX = Math.min(...coords.map(coord => coord.x));
        let maxX = Math.max(...coords.map(coord => coord.x));
        const silcedRows = this.grid.map(row => row.slice(minX, maxX + 1));
        const columns = silcedRows[0].map((_, colIndex) => silcedRows.map(row => row[colIndex]));
        const highestFilledCells = columns.map(column => {
            let index = column.slice(this.y, column.length).findIndex(block => block !== null);
            return index === -1 ? 20 : index + this.y;
        });
        let highEstemptyCellIndex = 20;
        this.blocks.forEach(block => { highEstemptyCellIndex = Math.min(highEstemptyCellIndex, highestFilledCells[block.x - minX] + this.y - block.y - 1); });
        ctx.globalAlpha = .5;
        this.blocks.forEach(block => { block.drawWithOffset(ctx, size, 0, highEstemptyCellIndex - this.y); });
        let startY = [];
        for (const coord of coords) {
            if (!startY.find(c => c.x === coord.x))
                startY.push(coord);
            else
                startY = startY.map(c => c.x === coord.x ? (coord.y > c.y ? coord : c) : c);
        }
        minX *= size;
        maxX *= size;
        highEstemptyCellIndex *= size;
        ctx.fillStyle = 'rgba(255, 255, 255, .1)';
        ctx.globalAlpha = 1;
        startY.forEach(coord => { ctx.fillRect(coord.x * size, (coord.y + 1) * size, size, highEstemptyCellIndex - ((this.y + 1) * size) + size); });
        this.blocks.forEach(block => block.draw(ctx, size));
    }
    rotateClockwise() {
        let newX;
        let newY;
        for (let i = 0; i < this.blocks.length; i++) {
            newX = this.x - this.blocks[i].y + this.y;
            newY = this.y + this.blocks[i].x - this.x;
            if (newX < 0) {
                this.moveRight();
                this.rotateClockwise();
                return;
            }
            else if (newX > this.grid[0].length - 1) {
                this.moveLeft();
                this.rotateClockwise();
                return;
            }
            else if (newY > this.grid.length - 1) {
                this.moveUp();
                this.rotateClockwise();
                return;
            }
            else if (this.grid[newY][newX] !== null) {
                return;
            }
        }
        this.blocks.forEach(block => {
            const x = block.x - this.x;
            const y = block.y - this.y;
            block.x = this.x - y;
            block.y = this.y + x;
        });
    }
    rotateCounterClockwise() {
        let newX;
        let newY;
        for (let i = 0; i < this.blocks.length; i++) {
            newX = this.x + this.blocks[i].y - this.y;
            newY = this.y - this.blocks[i].x + this.x;
            if (newX < 0) {
                this.moveRight();
                this.rotateCounterClockwise();
                return;
            }
            else if (newX > this.grid[0].length - 1) {
                this.moveLeft();
                this.rotateCounterClockwise();
                return;
            }
            else if (newY > this.grid.length - 1) {
                this.moveUp();
                this.rotateCounterClockwise();
                return;
            }
            else if (this.grid[newY][newX] !== null) {
                return;
            }
        }
        this.blocks.forEach(block => {
            const x = block.x - this.x;
            const y = block.y - this.y;
            block.x = this.x + y;
            block.y = this.y - x;
        });
    }
    moveLeft() {
        for (let i = 0; i < this.blocks.length; i++)
            if (this.blocks[i].x - 1 < 0 || this.grid[this.blocks[i].y][this.blocks[i].x - 1] !== null)
                return false;
        this.blocks.forEach(block => block.x--);
        this.x--;
        return true;
    }
    moveRight() {
        for (let i = 0; i < this.blocks.length; i++)
            if (this.blocks[i].x + 1 >= this.grid[0].length || this.grid[this.blocks[i].y][this.blocks[i].x + 1] !== null)
                return false;
        this.blocks.forEach(block => block.x++);
        this.x++;
        return true;
    }
    moveDown() {
        for (let i = 0; i < this.blocks.length; i++)
            if (this.blocks[i].y + 1 >= this.grid.length || this.grid[this.blocks[i].y + 1][this.blocks[i].x] !== null)
                return false;
        this.blocks.forEach(block => block.y++);
        this.y++;
        return true;
    }
    moveUp() {
        for (let i = 0; i < this.blocks.length; i++)
            if (this.blocks[i].y - 1 < 0 || this.grid[this.blocks[i].y - 1][this.blocks[i].x] !== null)
                return false;
        this.blocks.forEach(block => block.y--);
        this.y--;
        return true;
    }
    hardDrop() {
        let cellsMoved = 0;
        while (this.moveDown())
            cellsMoved++;
        return cellsMoved;
    }
    setLocation(x, y) {
        this.blocks.forEach(block => {
            block.x += x - this.x;
            block.y += y - this.y;
        });
        this.x = x;
        this.y = y;
    }
    static random(x, y, grid) {
        const tetrominos = [
            IShape,
            OShape,
            TShape,
            JShape,
            LShape,
            ZShape,
            SShape
        ];
        const tetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
        return new tetromino(x, y, grid);
    }
}
class IShape extends Tetromino {
    orientation = 0;
    constructor(x, y, grid) {
        y += 1;
        const coords = [
            { x: x - 1, y: y + 0 },
            { x: x + 0, y: y + 0 },
            { x: x + 1, y: y + 0 },
            { x: x + 2, y: y + 0 }
        ];
        super(x, y, coords, '#0ff', grid);
    }
    rotateClockwise() {
        for (let i = 0; i < this.blocks.length; i++) {
            const newX = this.blocks[i].x + (this.orientation % 2 === 0 ? 2 - i : 1 - i) * (this.orientation < 2 ? 1 : -1);
            const newY = this.blocks[i].y + (this.orientation % 2 === 1 ? 2 - i : 1 - i) * (this.orientation === 0 || this.orientation === 3 ? -1 : 1);
            if (newX < 0) {
                this.moveRight();
                this.rotateClockwise();
                return;
            }
            else if (newX >= this.grid[0].length) {
                this.moveLeft();
                this.rotateClockwise();
                return;
            }
            else if (newY >= this.grid.length) {
                this.moveUp();
                this.rotateClockwise();
                return;
            }
            else if (this.grid[newY][newX] !== null) {
                return;
            }
        }
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i].x += (this.orientation % 2 === 0 ? 2 - i : 1 - i) * (this.orientation < 2 ? 1 : -1);
            this.blocks[i].y += (this.orientation % 2 === 1 ? 2 - i : 1 - i) * (this.orientation === 0 || this.orientation === 3 ? -1 : 1);
        }
        this.orientation = (this.orientation + 1) % 4;
    }
    rotateCounterClockwise() {
        for (let i = 0; i < this.blocks.length; i++) {
            const newX = this.blocks[i].x + (this.orientation % 2 === 1 ? 2 - i : 1 - i) * (this.orientation === 0 || this.orientation === 3 ? 1 : -1);
            const newY = this.blocks[i].y + (this.orientation % 2 === 0 ? 2 - i : 1 - i) * (this.orientation < 2 ? 1 : -1);
            if (newX < 0) {
                this.moveRight();
                this.rotateCounterClockwise();
                return;
            }
            else if (newX >= this.grid[0].length) {
                this.moveLeft();
                this.rotateCounterClockwise();
                return;
            }
            else if (newY >= this.grid.length) {
                this.moveUp();
                this.rotateCounterClockwise();
                return;
            }
            else if (this.grid[newY][newX] !== null) {
                return;
            }
        }
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i].x += (this.orientation % 2 === 1 ? 2 - i : 1 - i) * (this.orientation === 0 || this.orientation === 3 ? 1 : -1);
            this.blocks[i].y += (this.orientation % 2 === 0 ? 2 - i : 1 - i) * (this.orientation < 2 ? 1 : -1);
        }
        this.orientation = (this.orientation + 4 - 1) % 4;
    }
}
class OShape extends Tetromino {
    constructor(x, y, grid) {
        const coords = [
            { x: x + 0, y: y + 0 },
            { x: x + 1, y: y + 0 },
            { x: x + 0, y: y + 1 },
            { x: x + 1, y: y + 1 }
        ];
        super(x, y, coords, '#ff0', grid);
    }
    rotateClockwise() { }
    rotateCounterClockwise() { }
}
class TShape extends Tetromino {
    constructor(x, y, grid) {
        y += 1;
        const coords = [
            { x: x + 0, y: y + 0 },
            { x: x - 1, y: y + 0 },
            { x: x + 1, y: y + 0 },
            { x: x + 0, y: y - 1 }
        ];
        super(x, y, coords, '#90f', grid);
    }
    setLocation(x, y) {
        y += 1;
        super.setLocation(x, y);
    }
}
class JShape extends Tetromino {
    constructor(x, y, grid) {
        y += 1;
        const coords = [
            { x: x + 0, y: y + 0 },
            { x: x - 1, y: y + 0 },
            { x: x - 1, y: y - 1 },
            { x: x + 1, y: y + 0 }
        ];
        super(x, y, coords, '#00f', grid);
    }
    setLocation(x, y) {
        y += 1;
        super.setLocation(x, y);
    }
}
class LShape extends Tetromino {
    constructor(x, y, grid) {
        y += 1;
        const coords = [
            { x: x + 0, y: y + 0 },
            { x: x + 1, y: y + 0 },
            { x: x + 1, y: y - 1 },
            { x: x - 1, y: y + 0 }
        ];
        super(x, y, coords, '#fa0', grid);
    }
    setLocation(x, y) {
        y += 1;
        super.setLocation(x, y);
    }
}
class ZShape extends Tetromino {
    constructor(x, y, grid) {
        y += 1;
        const coords = [
            { x: x + 0, y: y + 0 },
            { x: x + 0, y: y - 1 },
            { x: x - 1, y: y - 1 },
            { x: x + 1, y: y + 0 }
        ];
        super(x, y, coords, '#f00', grid);
    }
    setLocation(x, y) {
        y += 1;
        super.setLocation(x, y);
    }
}
class SShape extends Tetromino {
    constructor(x, y, grid) {
        y += 1;
        const coords = [
            { x: x + 0, y: y + 0 },
            { x: x - 1, y: y + 0 },
            { x: x + 0, y: y - 1 },
            { x: x + 1, y: y - 1 }
        ];
        super(x, y, coords, '#0f0', grid);
    }
    setLocation(x, y) {
        y += 1;
        super.setLocation(x, y);
    }
}
export { Tetromino, IShape, OShape, TShape, JShape, LShape, ZShape, SShape };
