<script lang="ts">
    enum Mode {
        Navigate,
        Edit,
        NavigateWhileEdit,
    }

    let headers = $state(['first', 'second', 'third', 'fourth']);

    let data = $state(
        [
            [{d: 1, f: 1}, {d: 2, f: 2}, {d: 3, f: 3}, {d: 3, f: 'first+second'}],
            [{d: 4, f: 4}, {d: 7, f: 7}, {d: 8, f: 8}, {d: 11, f: 'first+second'}],
            [{d: 5, f: 5}, {d: 6, f: 2}, {d: 9, f: 3}, {d: 11, f: 'first+second'}],
        ]
    );
    let mode = $state(Mode.Navigate);
    let selection: number[][] = $state([]);
    let activeCell = $state({row: 0, col: 0});

    function isSelected(row: number, col: number) {
        return selection.some(([i, j]) => row === i && col === j);
    }

    function isActive(row: number, col: number) {
        return activeCell.row === row && activeCell.col === col;
    }

    function handleDoubleClick(row: number, col: number) {
        console.log(`double clicked [${row}, ${col}]`);
        if (mode === Mode.Navigate) {
            if (row === -1 || col === -1) {  // gutter click, do nothing for now
                null;
            } else {
                mode = Mode.Edit;
                selection = [];
                activeCell = {row: row, col: col};
            }
        } else if (mode === Mode.Edit) {
            // Todo: There's probably a nice way to factor the navigation stuff but I don't see it yet.
            if (row === -1 && col === -1) {  // Click in top-left thingy
                mode = Mode.NavigateWhileEdit;
                const rows = [...Array(data.length).keys()];
                const cols = [...Array(data[0].length).keys()];
                selection = rows.flatMap((i) => cols.map((j) => [i, j]));
            } else if (row === -1) {  // Click in header
                mode = Mode.NavigateWhileEdit;
                selection = [...Array(data.length).keys()].map((i) => [i, col]);
            } else if (col === -1) {  // Click in row indicator
                mode = Mode.NavigateWhileEdit;
                selection = [...Array(data[0].length).keys()].map((j) => [row, j]);
            } else if (activeCell.row === row && activeCell.col === col) {
                null;
            } else {
                mode = Mode.NavigateWhileEdit;
                selection = [[row, col]];
            }
        } else if (mode === Mode.NavigateWhileEdit) {
            if (row === -1 && col === -1) {  // Click in top-left thingy
                const rows = [...Array(data.length).keys()];
                const cols = [...Array(data[0].length).keys()];
                selection = rows.flatMap((i) => cols.map((j) => [i, j]));
            } else if (row === -1) {  // Click in header
                selection = [...Array(data.length).keys()].map((i) => [i, col]);
            } else if (col === -1) {  // Click in row indicator
                selection = [...Array(data[0].length).keys()].map((j) => [row, j]);
            } else if (activeCell.row === row && activeCell.col === col) {
                selection = [];
            } else {
                selection = [[row, col]];
            }
        }
    }

    let timeout: number | null = null;
    function handleClick(e: PointerEvent, row: number, col: number) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
            handleDoubleClick(row, col);
        } else {
            timeout = setTimeout(() => {
                handleSingleClick(row, col);
            }, 200);
        }

    }

    function handleSingleClick(row: number, col: number) {
        console.log(`clicked [${row}, ${col}] times`);
        if (mode === Mode.Navigate) {
            if (row === -1 && col === -1) {  // Click in top-left thingy
                const rows = [...Array(data.length).keys()];
                const cols = [...Array(data[0].length).keys()];
                selection = rows.flatMap((i) => cols.map((j) => [i, j]));
                activeCell = {row: 0, col: 0};
            } else if (row === -1) {  // Click in header
                selection = [...Array(data.length).keys()].map((i) => [i, col]);
                activeCell = {row: 0, col: col};
            } else if (col === -1) {  // Click in row indicator
                selection = [...Array(data[0].length).keys()].map((j) => [row, j]);
                activeCell = {row: row, col: 0};
            } else if (activeCell.row === row && activeCell.col === col) {
                mode = Mode.Edit;
            } else {
                selection = [];
                activeCell = {row: row, col: col};
            }
        } else if (mode === Mode.Edit) {
            // Todo: There's probably a nice way to factor the navigation stuff but I don't see it yet.
            if (row === -1 && col === -1) {  // Click in top-left thingy
                mode = Mode.NavigateWhileEdit;
                const rows = [...Array(data.length).keys()];
                const cols = [...Array(data[0].length).keys()];
                selection = rows.flatMap((i) => cols.map((j) => [i, j]));
            } else if (row === -1) {  // Click in header
                mode = Mode.NavigateWhileEdit;
                selection = [...Array(data.length).keys()].map((i) => [i, col]);
            } else if (col === -1) {  // Click in row indicator
                mode = Mode.NavigateWhileEdit;
                selection = [...Array(data[0].length).keys()].map((j) => [row, j]);
            } else if (activeCell.row === row && activeCell.col === col) {
                null;
            } else {
                mode = Mode.NavigateWhileEdit;
                selection = [[row, col]];
            }
        } else if (mode === Mode.NavigateWhileEdit) {
            if (row === -1 && col === -1) {  // Click in top-left thingy
                const rows = [...Array(data.length).keys()];
                const cols = [...Array(data[0].length).keys()];
                selection = rows.flatMap((i) => cols.map((j) => [i, j]));
            } else if (row === -1) {  // Click in header
                selection = [...Array(data.length).keys()].map((i) => [i, col]);
            } else if (col === -1) {  // Click in row indicator
                selection = [...Array(data[0].length).keys()].map((j) => [row, j]);
            } else if (activeCell.row === row && activeCell.col === col) {
                selection = [];
            } else {
                selection = [[row, col]];
            }
        }
    }
</script>

Headers: {JSON.stringify(headers)}<br>
Data: {JSON.stringify(data)}<br>
Mode: {Mode[mode]}<br>
Selection: {JSON.stringify(selection)}<br>
Active cell: {JSON.stringify(activeCell)}<br>
<table>
    <thead>
    <tr>
        <th
                class="gutter"
                on:click={(e) => handleClick(e, -1, -1)}
        ></th>
        {#each headers as header, j}
            <th
                    class="gutter"
                    on:click={(e) => handleClick(e, -1, j)}
            >
                {header}
            </th>
        {/each}
    </tr>
    </thead>
    <tbody>
    {#each data as row, i}
        <tr>
            <td
                    class="gutter"
                    on:click={(e) => handleClick(e, i, -1)}
            >
                {i}
            </td>
            {#each row as cell, j}
                {#if (mode === Mode.Edit || mode === Mode.NavigateWhileEdit) && isActive(i, j)}
                    <td
                            class="editing"
                            class:active={isActive(i, j)}
                            class:selected={isSelected(i, j)}
                            on:click={(e) => handleClick(e, i, j)}
                    >
                        <input type="text" value={cell.f}>
                    </td>
                {:else}
                    <td
                            class:active={isActive(i, j)}
                            class:selected={isSelected(i, j)}
                            on:click={(e) => handleClick(e, i, j)}
                    >
                        {cell.d}
                    </td>
                {/if}
            {/each}
        </tr>
    {/each}
    </tbody>
</table>

<style>
    table {
        border-collapse: collapse;
    }

    tr {
        height: 2rem;
    }

    td, th {
        box-sizing: border-box;
        padding: 0.1rem 0.5rem;
        width: 5rem;
        border: 1px solid #ccc;
    }

    td {
        text-align: end;
    }

    td.active, th.active {
        border: 2px solid black;
    }

    td.selected, th.selected {
        color: white;
        background: #09008d;
    }

    td.editing {
        padding: 0;
        border: 0;
    }

    .gutter {
        width: max-content;
        background-color: #bbb;
        color: #222;
    }

    input {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        margin: 0;
        border: 2px solid grey;

        font: inherit;
        text-align: inherit;

        padding: 0.1rem 0.5rem;
    }

    input:focus {
        outline: none !important;
    }
</style>