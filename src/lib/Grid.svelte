<script lang="ts">
    export let variables: string[] = ["first", "second", "third"];
    export let values: any[][] = [[0, 2, 4], [1, 3, 5]];
    $: [nRows, nCols] = [values.length, values[0].length];

    let [rowSelected, colSelected] = [0, 1];
    let valueSelected = values[rowSelected][colSelected];
    let editing = false;
    let editingInput;

    $: console.log({editing, rowSelected, colSelected, valueSelected, variables});

    function setSelection(i, j) {
        if (j >= nCols) {
            variables.push(...Array(j+1 - nCols).fill(''))
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
        valueSelected = values[rowSelected][colSelected];
    }

    function go(direction: "up" | "down" | "left" | "right") {
        console.log('going...', direction, rowSelected, colSelected);
        if (direction === "up") {
            setSelection(rowSelected > 0 ? rowSelected - 1 : 0, colSelected);
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
            editingInput.value = values[rowSelected][colSelected]; // reset value
            editing = false;
            editingInput.blur();
        } else if (event.key === 'Tab' && editing) {
            updateValues();
            event.shiftKey ? go('left') : go('right');
            event.preventDefault();
        } else if (event.key === 'Enter' && !editing) {
            editingInput.focus();
        } else if (event.key === 'Enter' && editing) {
            updateValues();
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
            console.log(event);
        }
    }

    function updateValues() {
        values[rowSelected][colSelected] = valueSelected;
        values = values;
    }
</script>

<svelte:window on:keyup={handleKeyInput}/>

<table>
    <thead>
    <tr>
        {#each variables as variable}
            <th>{variable}</th>
        {/each}
    </tr>
    </thead>
    <tbody>
    {#each values as row, i}
        <tr>
            {#each row as value, j}
                {#if rowSelected === i && colSelected === j}
                    <td class="selected">
                        <input
                                type="text"
                                on:keydown={(event) => {
                                    console.log('keyup input', event);
                                    if (["Escape", "Tab", "Enter"].includes(event.key)) event.preventDefault();
                                }}
                                bind:this={editingInput}
                                bind:value={valueSelected}
                                autofocus={editing}
                                on:focus={() => {editing = true;}}
                        >
                    </td>
                {:else}
                    <td on:click={(event) => {
                                    console.log('click', event)
                                    setSelection(i, j);
                                    editing = true;
                                }}
                    >
                        {value}
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

    td, th, td input {
        padding: 0.1rem 0.5rem;
        width: 5rem;
        border: 1px solid #ccc;
    }

    td {
        text-align: end;
    }

    td.selected {
        padding: 0;
        height: 2rem;
    }


    td input {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        margin: 0;
        border: 1px solid black;

        font: inherit;
        text-align: inherit;
    }
</style>