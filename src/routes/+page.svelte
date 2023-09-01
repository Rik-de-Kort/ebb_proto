<script lang="ts">
    import {onMount} from "svelte";
    import {loadPyodide} from "pyodide";

    import Grid from "$lib/Grid.svelte";
    import CodeMirror from "svelte-codemirror-editor";
    import {python} from "@codemirror/lang-python";

    function asCode(variables: string[], values: any[][]): string {
        let result = [];
        for (const [i, variable] of variables.entries()) {
            if (variable) {
                result.push(`${variable} = ${values[0][i] !== '' ? values[0][i] : 'None'}`);
            }
        }
        return result.join('\n');
    }


    let variables = ['first', 'second', 'third'];
    let values = [[0, 2, 4], [1, 3, 5]];

    $: code = asCode(variables, values);

    let pyodide;
    onMount(async () => {
        pyodide = await loadPyodide({indexURL: "/pyodide-data"});
        console.log('pyodide loaded!')
    })

    let counter = 0;
    $: {
        console.log(counter);
        counter = counter + 1;
        console.log(variables, values);
        if (pyodide) {
            pyodide.runPython(code);
        }
    }
</script>

<div id="container">
    <div id="grid">
        <Grid bind:variables bind:values/>
    </div>
    <div id="editor">
        <CodeMirror bind:value={code} lang={python()}/>
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

    #editor {
        display: block;
        flex-grow: 1;
        width: 500px;
        border: 1px solid black;
    }
</style>