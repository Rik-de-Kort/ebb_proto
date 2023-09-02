<script lang="ts">
    import CellInput from "$lib/CellInput.svelte";

    export let variables: string[] = ["first", "second", "third", "fourth"];
    export let values: any[][] = [[0, 2, 4, 2], [1, 3, 5, 4]];
    export let codes: Map<number, string> = new Map([[3, "first + second"]]);
    $: [nRows, nCols] = [values.length, values[0].length];

    let [rowSelected, colSelected] = [0, 1];
    let valueSelected = values[rowSelected][colSelected];
    let editing = false;
    let editingInput;

    $: console.log({editing, rowSelected, colSelected, valueSelected, variables, codes});

    function setSelection(i, j) {
        if (j >= nCols) {
            variables.push(...Array(j + 1 - nCols).fill(''))
            variables = variables;

            for (const [i, _] of values.entries()) {
                values[i].push(...Array(j + 1 - nCols).fill(''));
            }
            values = values;
        }
        if (i >= nRows) {
            values.push(...Array(i + 1 - nRows).fill(Array(nCols).fill('')));
            values = values;
        }

        rowSelected = i;
        colSelected = j;
        if (rowSelected === -1) {
            valueSelected = variables[j];
        } else if (codes.has(colSelected)) {
            valueSelected = codes.get(colSelected);
        } else {
            valueSelected = values[rowSelected][colSelected];
        }
    }

    function go(direction: "up" | "down" | "left" | "right") {
        if (direction === "up") {
            setSelection(rowSelected > -1 ? rowSelected - 1 : -1, colSelected);
        } else if (direction === "down") {
            setSelection(rowSelected + 1, colSelected);
        } else if (direction === 'left') {
            setSelection(rowSelected, colSelected > 0 ? colSelected - 1 : 0);
        } else if (direction === 'right') {
            setSelection(rowSelected, colSelected + 1);
        }
    }


    function handleKeyInput(event: KeyboardEvent) {
        console.log(event);
        if (event.target === editingInput && !['Escape', 'Tab', 'Enter'].includes(event.key)) return;

        if (event.key === 'Escape' && editing) {
            resetData();
            editing = false;
            editingInput.blur();
        } else if (event.key === 'Tab' && editing) {
            updateData();
            event.shiftKey ? go('left') : go('right');
            event.preventDefault();
        } else if (event.key === 'Enter' && !editing) {
            editingInput.focus();
        } else if (event.key === 'Enter' && editing) {
            updateData();
            event.shiftKey ? go('up') : go('down');
        } else if (event.key === 'ArrowUp') {
            go('up');
        } else if (event.key === 'ArrowDown') {
            go('down');
        } else if (event.key === 'ArrowRight') {
            go('right');
        } else if (event.key === 'ArrowLeft') {
            go('left');
        } else {
            console.log('not handling')
        }
    }

    function updateData() {
        if (rowSelected === -1) {
            variables[colSelected] = valueSelected;
            variables = variables;
        }
        else if (codes.has(colSelected)) {
            codes.set(colSelected, valueSelected);
            codes =codes;
        } else {
            values[rowSelected][colSelected] = valueSelected;
            values = values;
        }
    }

    function resetData() {
        if (rowSelected >= 0) {
            valueSelected = values[rowSelected][colSelected];
        } else {
            valueSelected = variables[colSelected];
        }
    }
</script>

<svelte:window on:keyup={handleKeyInput}/>

<table>
    <thead>
    <tr>
        {#each variables as variable, j}
            {#if rowSelected === -1 && colSelected === j}
                <th class="selected">
                    <CellInput bind:valueSelected={valueSelected}
                               bind:editing={editing}
                               bind:htmlElement={editingInput}/>
                </th>
            {:else}
                <th on:click={() => { setSelection(-1, j); editing = true; }}>{variable}</th>
            {/if}
        {/each}
    </tr>
    </thead>
    <tbody>
    {#each values as row, i}
        <tr>
            {#each row as value, j}
                {#if rowSelected === i && colSelected === j}
                    <td class="selected">  <!-- todo: handle blur properly -->
                        <CellInput bind:valueSelected={valueSelected}
                                   bind:editing={editing}
                                   bind:htmlElement={editingInput}/>
                    </td>
                {:else}
                    <td on:click={() => { setSelection(i, j); editing = true; }}>{value}</td>
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
        padding: 0.1rem 0.5rem;
        width: 5rem;
        border: 1px solid #ccc;
    }

    td {
        text-align: end;
    }

    td.selected, th.selected {
        padding: 0;
        height: 2rem;
    }
</style>