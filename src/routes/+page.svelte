<script lang="ts">
    import AgGrid from "$lib/AgGrid.svelte";

    let data = [
        {a: 0, b: 1, c: 2},
        {a: 2, b: 3, c: 4},
    ];
    let columnDefs = [
        {headerName: "First", field: "a", sortable: true, editable: true},
        {headerName: "Second", field: "b", sortable: true, editable: true},
        {headerName: "Third", field: "c", sortable: true, editable: true},
    ];

    $: console.log(data);
</script>

<AgGrid bind:data={data} {columnDefs}/>
