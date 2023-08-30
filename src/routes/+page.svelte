<script lang="ts">
    import {onMount} from "svelte";
    import {loadPyodide} from "pyodide";
    import AgGrid from "$lib/AgGrid.svelte";
    import CodeMirror from "svelte-codemirror-editor";

    let data = [
        {a: 0, b: 1, c: 2},
        {a: 2, b: 3, c: 4},
    ];
    let columnDefs = [
        {headerName: "First", field: "a", sortable: true, editable: true},
        {headerName: "Second", field: "b", sortable: true, editable: true},
        {headerName: "Third", field: "c", sortable: true, editable: true},
    ];

    let pyodide;
    onMount(async () => {
        pyodide = await loadPyodide({indexURL: "/pyodide-data"});
        console.log('pyodide loaded!')
    })

    $: console.log(data);

    let value = "hello, world\na\na\na\na\na\na\na\na\na\na\na\na\na\na";
</script>

<div id="container">
    <div id="grid">
        <AgGrid bind:data={data} {columnDefs}/>
    </div>
    <div id="editor">
        <CodeMirror bind:value/>
    </div>
</div>

<style>
    #container {
        margin-left: auto;
        margin-right: auto;
        display: flex;
        flex-direction: row;
        border: 1px solid black;
        width: 70%;
    }

    #editor{
        display: block;
        flex-grow: 1;
        width: 500px;
        border: 1px solid black;
    }
</style>