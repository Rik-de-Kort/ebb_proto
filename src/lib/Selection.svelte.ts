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
        this.corners = this.corners ?? [[this.activeCell[0], this.activeCell[1]], [this.activeCell[0], this.activeCell[1]]];
    }

    moveTo([row, col]: [number, number], expandSelection = false) {
        row = Math.max(row, 0);
        col = Math.max(col, 0);
        console.log(`Moving to ${row}, ${col}, ${expandSelection}`);
        if (!expandSelection) {
            this.activeCell = [row, col];
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

    expandColumns() {
        this.ensureSelection();
        this.corners = this.corners as [[number, number], [number, number]];
        this.corners[0][0] = 0;
        this.corners[1][0] = Infinity;
    }

    expandRows() {
        this.ensureSelection();
        this.corners = this.corners as [[number, number], [number, number]];
        this.corners[0][1] = 0;
        this.corners[1][1] = Infinity;
    }

    has([row, col]: [number, number]) {
        if (!this.corners) return false;
        return (this.topLeft[0] <= row && row <= this.bottomRight[0]
            && this.topLeft[1] <= col && col <= this.bottomRight[1]);
    }
}