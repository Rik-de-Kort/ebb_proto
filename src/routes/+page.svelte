<script lang="ts">
    import {onMount} from "svelte";
    import {loadPyodide} from "pyodide";
    import type {PyodideInterface} from "pyodide";

    import Grid from "$lib/Grid.svelte";
    import CodeMirror from "svelte-codemirror-editor";
    import {python} from "@codemirror/lang-python";

    function asCode(variables: string[], values: any[][], codes: Map<number, string>): string {
        let result = [];
        for (const [i, variable] of variables.entries()) {
            if (!variable) continue;
            if (codes.has(i)) {
                result.push(`${variable} = ${codes.get(i)}`);
            } else {
                result.push(`${variable} = ${values[0][i] !== '' ? variable : 'None'}`);
            }
        }
        return result.join('\n');
    }

    let variables: string[] = ["first", "second", "third", "fourth"];
    let values: any[][] = [[0, 2, 4, 2], [1, 3, 5, 4]];
    let codes: Map<number, string> = new Map([[3, "first + second"]]);

    let code: string;
    $: {
        code = asCode(variables, values, codes);
        evalCode();
    }

    function evalCode() {
        if (!pyodide) return;
        for (const [i, row] of values.entries()) {
            // Set variables to this row's state
            for (const [j, value] of row.entries()) {
                if (!codes.has(j)) {
                    pyodide.globals.set(variables[j], value);
                }
            }
            // Run code
            pyodide.runPython(code);

            // Pick out result
            for (const [j, variable] of variables.entries()) {
                values[i][j] = pyodide.globals.get(variable);
            }
        }
        values = values;
    }


    let pyodide: PyodideInterface;
    onMount(async () => {
        pyodide = await loadPyodide({indexURL: "/pyodide-data"});
        console.log('pyodide loaded!')
    })

    let counter = 0;
    $: {
        console.log(counter);
        counter = counter + 1;
        console.log({variables, values, codes});
    }

    function codeChange() {
        console.log('code changed!', {code});
        const newLine = code.split('\n')[3].split(' = ')[1];
        console.log({code, newLine})
        codes.set(3, newLine);
        evalCode();
    }
</script>

<div id="container">
    <div id="grid">
        <Grid bind:variables bind:values bind:codes/>
    </div>
    <div id="editor">
        <CodeMirror bind:value={code} on:change={codeChange} lang={python()}/>
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