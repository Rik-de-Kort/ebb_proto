<script lang="ts">
    import ValueB from './ValueB.svelte';
    let valueA = 'A';
</script>

<input type="text" bind:value={valueA} /> {valueA}
<hr>
<ValueB bind:valueB={valueA} />