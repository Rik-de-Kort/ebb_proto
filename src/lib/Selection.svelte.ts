export enum Direction {
    left, right, up, down
}

export class Selection {
    activeCell: [number, number] = $state([0, 0]);
    private corners: [[number, number], [number, number]] | null = $state(null);

    get topLeft() {
        return this.corners ? this.corners[0] : this.activeCell;
    }

    get bottomRight() {
        return this.corners ? this.corners[1] : this.activeCell;
    }

    clear() {
        this.corners = null;
    }

    ensureSelection() {
        this.corners = this.corners ?? [this.activeCell[0], this.activeCell[1]];
    }

    moveTo(row: number, col: number, expandSelection = false) {
        console.log(`Moving to ${row}, ${col}, ${expandSelection}`);
        if (!expandSelection) {
            this.activeCell = [row, col];
            this.corners = null;
            return
        }

        this.ensureSelection();
        this.corners = this.corners as [[number, number], [number, number]];
        console.log(this.corners, this.corners[0], this.corners[0][0]);
        this.corners[0][0] = row < this.corners[0][0] ? row : this.corners[0][0];
        this.corners[0][1] = col < this.corners[0][1] ? col : this.corners[0][1];
        this.corners[1][0] = this.corners[1][0] < row ? row : this.corners[1][0];
        this.corners[1][1] = this.corners[1][1] < col ? col : this.corners[1][1];

        this.activeCell = [row, col];
    }

    move(direction: Direction, by = 1, expandSelection = false) {
        let newActiveCell: [number, number];
        if (direction === Direction.up) {
            newActiveCell = [Math.max(0, this.activeCell[0] - by), this.activeCell[1]];
        } else if (direction === Direction.down) {
            newActiveCell = [this.activeCell[0] + by, this.activeCell[1]];
        } else if (direction === Direction.left) {
            newActiveCell = [this.activeCell[0], Math.max(0, this.activeCell[1] - by)];
        } else {// if (direction === Direction.right) { // Typescript typechecker be dumb
            newActiveCell = [this.activeCell[0], this.activeCell[1] + by];
        }
        if (expandSelection) {
            this.ensureSelection();
            if (direction === Direction.up && this.activeCell[0] === this.topLeft[0]
                || direction === Direction.down && this.activeCell[0] === this.topLeft[0]) {
                this.topLeft[0] = newActiveCell[0];
            } else if (direction === Direction.up && this.activeCell[0] === this.bottomRight[0]
                || direction === Direction.down && this.activeCell[0] === this.bottomRight[0]) {
                this.bottomRight[0] = newActiveCell[0];
            } else if (direction === Direction.left && this.activeCell[1] === this.topLeft[1]
                || direction === Direction.right && this.activeCell[1] === this.topLeft[1]) {
                this.topLeft[1] = newActiveCell[1];
            } else if (direction === Direction.left && this.activeCell[1] === this.bottomRight[1]
                || direction === Direction.right && this.activeCell[1] === this.topLeft[1]) {
                this.bottomRight[1] = newActiveCell[1];
            }
        }
        this.activeCell = newActiveCell;
    }

    has([row, col]: [number, number]) {
        if (!this.corners) return false;
        return (this.topLeft[0] <= row && row <= this.bottomRight[0]
            && this.topLeft[1] <= col && col <= this.bottomRight[1]);
    }

    get size(): number {
        if (!this.corners) {
            return 0;
        } else {
            return (this.bottomRight[0] - this.topLeft[0] + 1) * (this.bottomRight[1] - this.topLeft[1] + 1)
        }
    }
}