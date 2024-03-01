export enum Direction {
    left, right, up, down
}

export class Selection {
    topLeft: [number, number] | null = null;
    bottomRight: [number, number] | null = null;

    clear() {
        this.topLeft = this.bottomRight = null;
    }

    seed([row, col]: [number, number]) {
        this.clear();
        if (!this.topLeft || !this.bottomRight) {
            this.topLeft = [row, col];
            this.bottomRight = [row, col];
        }
    }

    expand(direction: Direction) {
        if (!this.topLeft || !this.bottomRight) {
            throw new Error(`Trying to expand empty selection`)
        } else if (direction === Direction.up) {
            this.topLeft[0] = Math.max(this.topLeft[0] - 1, 0);
        } else if (direction === Direction.left) {
            this.topLeft[1] = Math.max(this.topLeft[1] - 1, 0);
        } else if (direction === Direction.down) {
            this.bottomRight[0] = this.bottomRight[0] + 1;
        } else if (direction === Direction.right) {
            this.bottomRight[1] = this.bottomRight[1] + 1;
        }
    }

    shrink(direction: Direction) {
        if (!this.topLeft || !this.bottomRight) {
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