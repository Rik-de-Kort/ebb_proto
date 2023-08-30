<script lang="ts">
    export let variables: string[] = ["first", "second", "third"];
    export let values: any[][] = [[0, 2, 4], [1, 3, 5]];

    let [rowSelected, colSelected] = [0, 1];
    let valueSelected = values[rowSelected][colSelected];
    let editing = false;
    let editingInput;

    $: console.log({editing, rowSelected, colSelected, valueSelected});

    function go(direction: "up" | "down" | "left" | "right") {
        console.log('going...', direction, rowSelected, colSelected);
        if (direction === "up") {
            rowSelected = rowSelected >= 0 ? rowSelected - 1 : -1;
        } else if (direction === "down") {
            rowSelected = rowSelected + 1;
        } else if (direction === 'left') {
            colSelected = colSelected >= 0 ? colSelected - 1 : -1;
        } else if (direction === 'right') {
            rowSelected = rowSelected + 1;
        }
        valueSelected = (rowSelected >= 0 && colSelected >= 0) ? values[rowSelected][colSelected] : undefined;
    }


    function handleKeyInput(event: KeyboardEvent) {
        console.log(event);
        if (event.target === editingInput && !['Escape', 'Tab'].includes(event.key)) return;

        if (event.key === 'Escape' && editing) {
            stopEditing();
        } else if (event.key === 'Tab') {
            if (editing) stopEditing();
            colSelected = event.shiftKey ? go('left') : go('right');
            event.preventDefault();
        } else if (event.key === 'Enter' && !editing) {
            editingInput.focus();
        } else if (event.key === 'Enter' && editing) {
            stopEditing();
            rowSelected = event.shiftKey ? go('up') : go('down');
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

    function stopEditing() {
        values[rowSelected][colSelected] = valueSelected;
        values = values;
        editing = false;
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
                    <td style:padding="0">
                        <input
                                type="text"
                                on:keydown={(event) => {
                                    console.log('keyup input', event);
                                    if (["Escape", "Tab"].includes(event.key)) event.preventDefault();
                                }}
                                bind:this={editingInput}
                                bind:value={valueSelected}
                                on:focus={() => {editing = true;}}
                                on:blur={stopEditing}
                        >
                    </td>
                {:else}
                    <td>
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

    td, th {
        padding: 0.1rem 0.5rem;
        min-width: 5rem;
        height: 2rem;
        border: 1px solid #ccc;
    }

    td {
        text-align: end;
    }

    td input {
        height: inherit;
        text-align: inherit;
    }
</style>