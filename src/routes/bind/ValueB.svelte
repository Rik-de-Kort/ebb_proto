<script lang="ts">
    export let valueB;
    let inputElement;
    let inputValue;
    let isSyncing = true;

    function updateInputValue(value) {
        console.log('updating')
        if (isSyncing) {
            inputValue = value + ' SUFFER';
        }
    }

    $: updateInputValue(valueB);

    function updateValueB(event) {
        console.log('change', / SUFFER$/.exec(event))
        if (!/ SUFFER$/.exec(inputElement.value)) {
            isSyncing = false;
            return;
        }
        isSyncing = true;
        console.log('replacing')
        valueB = inputElement.value.replace(' SUFFER', '');
    }
</script>

<input type="text" bind:this={inputElement} bind:value={inputValue} on:input={updateValueB}/> {valueB}
