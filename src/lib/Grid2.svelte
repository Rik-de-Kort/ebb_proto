<script lang="ts">
    import {Selection} from "$lib/Selection.svelte";

    enum Modes {
        Navigate = 'navigate',
        Edit = 'edit',
        NavigateWhileEdit = 'navigate-while-edit',
    }

    type Mode = ({ t: Modes.Navigate }
        | { t: Modes.Edit, row: number, col: number, cache: string | number }
        | { t: Modes.NavigateWhileEdit, row: number, col: number, cache: string | number });

    let headers = $state(['first', 'second', 'third', 'fourth']);
    let data = $state(
        [
            [{d: 1, f: 1}, {d: 2, f: 2}, {d: 3, f: 3}, {d: 3, f: 'first+second'}],
            [{d: 4, f: 4}, {d: 7, f: 7}, {d: 8, f: 8}, {d: 11, f: 'first+second'}],
            [{d: 5, f: 5}, {d: 6, f: 2}, {d: 9, f: 3}, {d: 11, f: 'first+second'}],
        ]
    );
    let mode: Mode = $state({t: Modes.Navigate});
    let selection = $state(new Selection());

    function isActive(row: number, col: number) {
        const [activeRow, activeCol] = selection.activeCell;
        return activeRow === row && activeCol === col;
    }

    function handleSingleClick(e: MouseEvent, row: number, col: number) {
        console.log(`clicked [${row}, ${col}]`);
        if (row === -1 || col === -1) {
            console.log(`Gutterclick ${e}, ${row}, ${col}`);
            if (!e.shiftKey) selection.clear();
            selection.moveTo([row, col], e.shiftKey);
            if (row === -1) {
                selection.selectWholeColumns();
            }
            if (col === -1) {
                selection.selectWholeRows();
            }
            return;
        }

        const [activeRow, activeCol] = selection.activeCell;
        if (mode.t === Modes.Navigate) {
            if (activeRow === row && activeCol === col) {
                startEditing(row, col);
                mode = {t: Modes.Edit, row: activeRow, col: activeCol, cache: data[row][col].f};
            } else if (e.shiftKey) {
                selection.moveTo([row, col], true);
            } else {
                selection.clear();
                selection.moveTo([row, col]);
            }
        } else if (mode.t === Modes.Edit) {
            if (activeRow === row && activeCol === col) {
                null;
            } else {
                mode = {t: Modes.NavigateWhileEdit, row: mode.row, col: mode.col, cache: mode.cache};
            }
        } else if (mode.t === Modes.NavigateWhileEdit) {
            if (activeRow === row && activeCol === col) {
                selection.clear();
            } else {
                selection.moveTo([row, col], false);
                selection.ensureSelection();
            }
        }
    }

    function startEditing(row: number, col: number) {
        console.log(`Start editing ${row} ${col}`);
        mode = {t: Modes.Edit, row: row, col: col, cache: data[row][col].f};
        console.log({mode});
        selection.clear();
        console.log('moving...');
        selection.moveTo([row, col]);
    }

    function stopEditing(save = true) {
        if ('cache' in mode && !save) {
            const [activeRow, activeCol] = selection.activeCell;
            data[activeRow][activeCol].f = mode.cache;
        }
        mode = {t: Modes.Navigate};
    }

    function handleDoubleClick(e: MouseEvent, row: number, col: number) {
        console.log(`double clicked [${row}, ${col}]`);
        if (row === -1 || col === -1) {  // gutter click, do nothing for now
            return;
        }

        if (mode.t === Modes.Navigate) {
            startEditing(row, col);
        } else if (mode.t === Modes.Edit || mode.t === Modes.NavigateWhileEdit) {
            stopEditing(false);
            startEditing(row, col);
        }
    }

    let timeout: number | null = null;

    function handleClick(e: MouseEvent, row: number, col: number) {
        e.preventDefault();
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
            handleDoubleClick(e, row, col);
        } else {
            timeout = setTimeout(() => {
                timeout = null;
                handleSingleClick(e, row, col);
            }, 200);
            console.log(timeout);
        }
    }

    function move(e: KeyboardEvent) {
        const [activeRow, activeCol] = selection.activeCell;
        if (e.key === 'ArrowRight') {
            const by = e.ctrlKey ? data[0].length - activeCol - 1 : 1;
            selection.moveTo([activeRow, activeCol + by], e.shiftKey);
        } else if (e.key === 'ArrowLeft') {
            const by = e.ctrlKey ? activeCol : 1;
            selection.moveTo([activeRow, activeCol - by], e.shiftKey);
        } else if (e.key === 'ArrowUp') {
            const by = e.ctrlKey ? activeRow : 1;
            selection.moveTo([activeRow - by, activeCol], e.shiftKey);
        } else if (e.key === 'ArrowDown') {
            const by = e.ctrlKey ? data.length - activeRow - 1 : 1;
            selection.moveTo([activeRow + by, activeCol], e.shiftKey);
        }
    }

    function handleKeyUp(e: KeyboardEvent) {
        if (mode.t === Modes.Navigate) {
            if (['ArrowRight', 'ArrowUp', 'ArrowDown', 'ArrowLeft'].includes(e.key)) {
                move(e);
            } else if (e.key === ' ' && e.shiftKey) {
                selection.selectWholeRows();
            } else if (e.key === ' ' && e.ctrlKey) {
                selection.selectWholeColumns();
            } else if (e.key === 'Tab') {
                selection.clear();
                const [activeRow, activeCol] = selection.activeCell;
                const nextCol = e.shiftKey ? activeCol - 1 : activeCol + 1;
                selection.moveTo([activeRow, nextCol]);
            } else if (e.key === 'Escape') {
                selection.clear();
            } else if (e.key === 'Enter' || e.key === 'F2') {
                startEditing(...selection.activeCell);
            }
        } else if(mode.t === Modes.NavigateWhileEdit) {
            if (['ArrowRight', 'ArrowUp', 'ArrowDown', 'ArrowLeft'].includes(e.key)) {
                move(e);
            } else if (e.key === ' ' && e.shiftKey) {
                selection.selectWholeRows();
            } else if (e.key === ' ' && e.ctrlKey) {
                selection.selectWholeColumns();
            } else if (e.key === 'Escape') {
                stopEditing(false);
            } else if (e.key === 'Enter') {
                stopEditing(true);
                selection.clear();
                const nextRow = e.shiftKey ? mode.row - 1 : mode.row + 1;
                selection.moveTo([nextRow, mode.col]);
            } else if (e.key === 'Tab') {
                stopEditing(true);
                selection.clear();
                const nextCol = e.shiftKey ? mode.col - 1 : mode.col + 1;
                selection.moveTo([mode.row, nextCol]);
            } else if (e.key === 'F2') {
                mode.t = Modes.Navigate;
            }
        } else if (mode.t === Modes.Edit) {
            if (e.key === 'Escape') {
                stopEditing(false);
            } else if (e.key === 'Enter') {
                stopEditing(true);
                selection.clear();
                const nextRow = e.shiftKey ? mode.row - 1 : mode.row + 1;
                selection.moveTo([nextRow, mode.col]);
            } else if (e.key === 'Tab') {
                stopEditing(true);
                selection.clear();
                const nextCol = e.shiftKey ? mode.col - 1 : mode.col + 1;
                selection.moveTo([mode.row, nextCol]);
            } else if (e.key === 'F2') {
                mode.t = Modes.NavigateWhileEdit;
            }
        }
    }
</script>

<svelte:body on:keyup={handleKeyUp} on:keydown={(e) => {e.key === 'Tab'? e.preventDefault(): null}}/>

Headers: {JSON.stringify(headers)}<br>
Data: {JSON.stringify(data)}<br>
Mode: {JSON.stringify(mode)}<br>
Selection: {JSON.stringify([selection.topLeft, selection.bottomRight])}<br>
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
                {#if (mode.t === Modes.Edit || mode.t === Modes.NavigateWhileEdit) && isActive(i, j)}
                    <td
                            class="editing"
                            class:active={isActive(i, j)}
                            class:selected={selection.has([i, j])}
                            on:click={(e) => handleClick(e, i, j)}
                            on:keyup={(e) => handleKeyUp(e)}
                            on:keydown={(e) => {e.key === 'Tab' ? e.preventDefault() : null}}
                    >
                        <input type="text" bind:value={cell.f} autofocus>
                    </td>
                {:else}
                    <td
                            class:active={isActive(i, j)}
                            class:selected={selection.has([i, j])}
                            on:click={(e) => handleClick(e, i, j)}
                            on:keyup={(e) => handleKeyUp(e)}
                            on:keydown={(e) => {e.key === 'Tab' ? e.preventDefault() : null}}
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