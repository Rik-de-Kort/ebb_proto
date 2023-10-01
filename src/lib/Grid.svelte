<script lang="ts">
    import CellInput from "$lib/CellInput.svelte";

    export let variables: string[] = ["first", "second", "third", "fourth"];
    export let values: any[][] = [[0, 2, 4, 2], [1, 3, 5, 4]];
    export let codes: Map<number, string> = new Map([[3, "first + second"]]);
    // Need some way to block to keypresses from getting interpreted if the focus is elsewhere
    $: [nRows, nCols] = [values.length, values[0].length];

    let [rowSelected, colSelected] = [0, 1];
    let valueSelected = values[rowSelected][colSelected];
    let editing = false;
    let editingInput: HTMLInputElement;

    $: console.log({editing, rowSelected, colSelected, valueSelected, variables, codes});

    function maybeNumber(value: string): string | number {
        if (!isNaN(Number(value)) && !isNaN(parseFloat(value))) {
            return parseFloat(value)
        } else {
            return value;
        }
    }

    function storeSelected() {
        if (rowSelected === -1) {  // Editing header
            variables[colSelected] = valueSelected;
            variables = variables;
        } else if (/^=.*/.exec(valueSelected)) {  // Has to be a formula
            codes.set(colSelected, valueSelected.slice(1).trim());
            codes = codes;
        } else if (codes.has(colSelected)) {  // Have a value, but used to be code
            codes.delete(colSelected);
            codes = codes;
            for (const [i, _] of values.entries()) { // Overwrite everything
                values[i][colSelected] = maybeNumber(valueSelected);
            }
            values = values;
        } else {  // Just updating a value...
            values[rowSelected][colSelected] = maybeNumber(valueSelected);
            values = values;
        }
    }

    function loadSelected() {
        if (rowSelected === -1) {
            valueSelected = variables[colSelected];
        } else if (codes.has(colSelected)) {
            valueSelected = '= ' + codes.get(colSelected);
        } else {
            valueSelected = values[rowSelected][colSelected];
        }
    }

    function goTo(i, j) {
        // Expand grid if needed.
        if (j >= nCols) {
            // How many cols to add: we want to be able to *index* on j,
            // which is the j+1'th column.
            variables.push(...Array(j + 1 - nCols).fill(''))
            variables = variables;

            for (const [i, _] of values.entries()) {
                values[i].push(...Array(j + 1 - nCols).fill(''));
            }
            values = values;
        }
        if (i >= nRows) {
            values.push(...Array(i + 1 - nRows).fill(Array(nCols >= j ? nCols : j).fill('')));
            values = values;
        }

        rowSelected = i;
        colSelected = j;
        loadSelected();
    }

    function step(direction: "up" | "down" | "left" | "right") {
        // Move the selection one step in the indicated direction
        if (direction === "up") {
            goTo(rowSelected > -1 ? rowSelected - 1 : -1, colSelected);
        } else if (direction === "down") {
            goTo(rowSelected + 1, colSelected);
        } else if (direction === 'left') {
            goTo(rowSelected, colSelected > 0 ? colSelected - 1 : 0);
        } else if (direction === 'right') {
            goTo(rowSelected, colSelected + 1);
        }
    }


    function handleKeyInput(event: KeyboardEvent) {
        if (event.target === editingInput && !['Escape', 'Tab', 'Enter'].includes(event.key)) return;

        if (event.key === 'Escape' && editing) {
            loadSelected();
            editing = false;
            editingInput.blur();
        } else if (event.key === 'Tab' && editing) {
            storeSelected();
            event.shiftKey ? step('left') : step('right');
            event.preventDefault();
        } else if (event.key === 'Enter' && !editing) {
            editingInput.focus();
        } else if (event.key === 'Enter' && editing) {
            storeSelected();
            event.shiftKey ? step('up') : step('down');
        } else if (event.key === 'ArrowUp') {
            step('up');
        } else if (event.key === 'ArrowDown') {
            step('down');
        } else if (event.key === 'ArrowRight') {
            step('right');
        } else if (event.key === 'ArrowLeft') {
            step('left');
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
                <th on:click={() => { goTo(-1, j); editing = true; }}>{variable}</th>
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
                    <td on:click={() => { goTo(i, j); editing = true; }}>{value}</td>
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