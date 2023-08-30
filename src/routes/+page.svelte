<script lang="ts">
    import {onMount} from "svelte";
    import {loadPyodide} from "pyodide";
    import AgGrid from "$lib/AgGrid.svelte";
    import CodeMirror from "svelte-codemirror-editor";
    import {python} from "@codemirror/lang-python";

    function asData(variables: string[], values: any[][]) {
        let result = [];
        for (const [i, variable] of variables.entries()) {
            for (const [j, value] of values[i].entries()) {
                if (result.length > j) {
                    result[j][variable] = value;
                } else {
                    result.push({[variable]: value})
                }
            }
        }
        return result;
    }

    function asVarsAndVals(data: Record<string, any>[]): [string[], any[][]] {
        if (data.length === 0) return [[], []]
        let [first, ...rest] = data

        const variables = [...Object.keys(first)];
        let values = [...Object.values(first).map((v) => [v])];
        for (const record of rest) {
            for (const [i, variable] of variables.entries()) {
                values[i].push(record[variable]);
            }
        }
        return [variables, values];
    }

    function asCode(variables: string[], values: any[][]): string {
        let result = [];
        for (const [i, variable] of variables.entries()) {
            result.push(`${variable} = ${values[i][0]}`)
        }
        return result.join('\n');
    }


    let data = [
        {first: 0, second: 1, third: 2},
        {first: 2, second: 3, third: 4},
    ];

    $: [variables, values] = asVarsAndVals(data);
    $: columnDefs = [...variables.map((name) => ({headerName: name, field: name, sortable: true, editable: true}))];
    $: code = asCode(variables, values);

    let pyodide;
    onMount(async () => {
        pyodide = await loadPyodide({indexURL: "/pyodide-data"});
        console.log('pyodide loaded!')
    })

    let counter  = 0;
    $: {
        console.log(counter);
        counter = counter + 1;
        console.log(variables, values);
        if (pyodide) {
            pyodide.runPython(code);
        }
        console.log(data);
    }
</script>

<div id="container">
    <div id="grid">
        <AgGrid bind:data={data} {columnDefs}/>
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

    #editor{
        display: block;
        flex-grow: 1;
        width: 500px;
        border: 1px solid black;
    }
</style>