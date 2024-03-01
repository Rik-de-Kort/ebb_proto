export enum Direction {
    left, right, up, down
}

export class Selection {
    activeCell: [number, number] = [0, 0];
    private corners: [[number, number], [number, number]] | null = null;

    get topLeft() {
        return this.corners ? this.corners[0] : this.activeCell;
    }

    get bottomRight() {
        return this.corners ? this.corners[1] : this.activeCell;
    }

    clear() {
        this.corners = null;
    }

    move(direction: Direction, by=1, expandSelection=false) {
        // Todo: implement move
        null;
    }

    expand(direction: Direction, by = 1) {
        this.corners = this.corners ?? structuredClone([this.activeCell, this.activeCell]);

        if (direction === Direction.up) {
            this.topLeft[0] = Math.max(this.topLeft[0] - by, 0);
        } else if (direction === Direction.left) {
            this.topLeft[1] = Math.max(this.topLeft[1] - by, 0);
        } else if (direction === Direction.down) {
            this.bottomRight[0] = this.bottomRight[0] + by;
        } else if (direction === Direction.right) {
            this.bottomRight[1] = this.bottomRight[1] + by;
        }
    }

    shrink(direction: Direction) {
        if (!this.corners) {
            return;
        } else if (this.topLeft[0] === this.bottomRight[0] && this.topLeft[1] === this.bottomRight[1]) {
            this.clear();
        } else {
            if (direction === Direction.up) {
                this.bottomRight[0] -= 1;
            } else if (direction === Direction.left) {
                this.bottomRight[1] -= 1;
            } else if (direction === Direction.down) {
                this.topLeft[0] += 1;
            } else if (direction === Direction.right) {
                this.topLeft[1] += 1;
            }
        }
    }

    has([row, col]: [number, number]) {
        if (!this.topLeft || !this.bottomRight) return false;
        return (this.topLeft[0] <= row && row <= this.bottomRight[0]
            && this.topLeft[1] <= col && col <= this.bottomRight[1]);
    }

    get size(): number {
        if (!this.topLeft || !this.bottomRight) {
            return 0;
        } else {
            return (this.bottomRight[0] - this.topLeft[0] + 1) * (this.bottomRight[1] - this.topLeft[1] + 1)
        }
    }
}