<script lang="ts">
    import {Direction, Selection} from "$lib/Selection.svelte";

    enum ModeEnum {
        Navigate = 'navigate',
        Edit = 'edit',
        NavigateWhileEdit = 'navigate-while-edit',
    }

    type Mode = ({ t: ModeEnum.Navigate }
        | { t: ModeEnum.Edit, cache: string | number }
        | { t: ModeEnum.NavigateWhileEdit, cache: string | number });

    let headers = $state(['first', 'second', 'third', 'fourth']);
    let data = $state(
        [
            [{d: 1, f: 1}, {d: 2, f: 2}, {d: 3, f: 3}, {d: 3, f: 'first+second'}],
            [{d: 4, f: 4}, {d: 7, f: 7}, {d: 8, f: 8}, {d: 11, f: 'first+second'}],
            [{d: 5, f: 5}, {d: 6, f: 2}, {d: 9, f: 3}, {d: 11, f: 'first+second'}],
        ]
    );
    let mode: Mode = $state({t: ModeEnum.Navigate});
    let selection = $state(new Selection());

    function isActive(row: number, col: number) {
        const [activeRow, activeCol] = selection.activeCell;
        return activeRow === row && activeCol === col;
    }

    function handleGutterClick(row: number, col: number) {
        const setActive = mode.t === ModeEnum.Navigate;
        if (row === -1 && col === -1) {  // Click in top-left thingy
            const rows = [...Array(data.length).keys()];
            const cols = [...Array(data[0].length).keys()];
            selection = rows.flatMap((i) => cols.map((j) => [i, j]));
            if (setActive) activeCell = {row: 0, col: 0};
        } else if (row === -1) {  // Click in header
            selection = [...Array(data.length).keys()].map((i) => [i, col]);
            if (setActive) activeCell = {row: 0, col: col};
        } else if (col === -1) {  // Click in row indicator
            selection = [...Array(data[0].length).keys()].map((j) => [row, j]);
            if (setActive) activeCell = {row: row, col: 0};
        }
    }

    function handleSingleClick(e: MouseEvent, row: number, col: number) {
        console.log(`clicked [${row}, ${col}]`);
        if (row === -1 || col === -1) {
            handleGutterClick(row, col, true);
            return;
        }

        const [activeRow, activeCol] = selection.activeCell;
        if (mode.t === ModeEnum.Navigate) {
            if (activeRow === row && activeCol === col) {
                mode = {t: ModeEnum.Edit, cache: data[row][col].f};
            } else {
                selection.moveTo(row, col, e.shiftKey);
            }
        } else if (mode.t === ModeEnum.Edit) {
            if (activeRow === row && activeCol === col) {
                null;
            } else {
                mode = {t: ModeEnum.NavigateWhileEdit, cache: mode.cache};
            }
        } else if (mode.t === ModeEnum.NavigateWhileEdit) {
            if (activeRow === row && activeCol === col) {
                selection.clear();
            } else {
                selection.moveTo(row, col, false);
                selection.ensureSelection();
            }
        }
    }

    function handleDoubleClick(row: number, col: number) {
        console.log(`double clicked [${row}, ${col}]`);
        return;
        if (row === -1 || col === -1) {  // gutter click, do nothing for now
            return;
        }

        if (mode.t === ModeEnum.Navigate) {
            mode = {t: ModeEnum.Edit, cache: data[row][col].f};
            selection = [[-1, -1], [-1, -1]];
            activeCell = {row: row, col: col};
        } else if (mode.t === ModeEnum.Edit || mode.t === ModeEnum.NavigateWhileEdit) {
            const [activeRow, activeCol] = selection.activeCell;
            data[activeRow][activeCol].f = mode.cache;
            mode = {t: ModeEnum.Edit, cache: data[row][col].f};
            activeCell = {row: row, col: col};
            selection = [[-1, -1], [-1, -1]];
        }
    }

    let timeout: number | null = null;

    function handleClick(e: Event, row: number, col: number) {
        e.preventDefault();
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
            handleDoubleClick(row, col);
        } else {
            timeout = setTimeout(() => {
                timeout = null;
                handleSingleClick(e, row, col);
            }, 20);
            console.log(timeout);
        }
    }

    function move(e: KeyboardEvent) {
        const [activeRow, activeCol] = selection.activeCell;
        if (e.key === 'ArrowRight') {
            const by = e.ctrlKey ? data[0].length - activeCol : 1;
            selection.move(Direction.right, by, e.shiftKey);
        } else if (e.key === 'ArrowLeft') {
            const by = e.ctrlKey ? activeCol : 1;
            selection.move(Direction.left, by, e.shiftKey);
        } else if (e.key === 'ArrowUp') {
            const by = e.ctrlKey ? activeRow : 1;
            selection.move(Direction.up, by, e.shiftKey);
        } else if (e.key === 'ArrowDown') {
            const by = e.ctrlKey ? data.length - activeRow : 1;
            selection.move(Direction.down, by, e.shiftKey);
        }
    }

    function handleKeyUp(e: KeyboardEvent) {
        console.log(e);
        if (mode.t === ModeEnum.Navigate) {
            move(e);
        }
    }
</script>

<svelte:body on:keyup={handleKeyUp} />

Headers: {JSON.stringify(headers)}<br>
Data: {JSON.stringify(data)}<br>
Mode: {JSON.stringify(mode)}<br>
Selection: {JSON.stringify(selection)}<br>
Active cell: {JSON.stringify(selection.activeCell)}<br>
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
                    on:keyup={(e) => handleKeyUp(e)}
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
                {#if (mode.t === ModeEnum.Edit || mode.t === ModeEnum.NavigateWhileEdit) && isActive(i, j)}
                    <td
                            class="editing"
                            class:active={isActive(i, j)}
                            class:selected={selection.has([i, j])}
                            on:click={(e) => handleClick(e, i, j)}
                            on:keyup={(e) => handleKeyUp(e)}
                    >
                        <input type="text" value={cell.f}>
                    </td>
                {:else}
                    <td
                            class:active={isActive(i, j)}
                            class:selected={selection.has([i, j])}
                            on:click={(e) => handleClick(e, i, j)}
                            on:keyup={(e) => handleKeyUp(e)}
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