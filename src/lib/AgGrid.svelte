<!--Sourced from https://github.com/Budibase/svelte-ag-grid/-->
<!--MIT License-->

<!--Copyright (c) 2021 Budibase-->

<!--Permission is hereby granted, free of charge, to any person obtaining a copy-->
<!--of this software and associated documentation files (the "Software"), to deal-->
<!--in the Software without restriction, including without limitation the rights-->
<!--to use, copy, modify, merge, publish, distribute, sublicense, and/or sell-->
<!--copies of the Software, and to permit persons to whom the Software is-->
<!--furnished to do so, subject to the following conditions:-->

<!--The above copyright notice and this permission notice shall be included in all-->
<!--copies or substantial portions of the Software.-->

<!--THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR-->
<!--IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,-->
<!--FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE-->
<!--AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER-->
<!--LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,-->
<!--OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE-->
<!--SOFTWARE.-->
<script>
    import {createEventDispatcher, onDestroy, onMount} from "svelte";
    import {Grid} from "ag-grid-enterprise";
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-balham.css";

    const dispatch = createEventDispatcher();

    export let columnDefs;
    export let data;
    export let options = {
        defaultColDef: {
            flex: 1,
            // minWidth: 150,
            filter: true,
        },
        suppressFieldDotNotation: true,
        rowSelection: "multiple",
        domLayout: "autoHeight",
    };
    export let loading = false;

    let ref;
    let grid;
    let api;

    const onSelectionChanged = () => {
        const selectedRows = api.getSelectedRows();
        dispatch("select", selectedRows);
    };

    const onCellValueChanged = (e) => {
        data[e.rowIndex] = e.data;
        dispatch("update", {row: e.rowIndex, data: e.data});
    };

    const onGridReady = () => {
        api = grid.gridOptions.api;
        if (loading) api.showLoadingOverlay();
    };

    const updateData = (data) => {
        if (grid && api) {
            api.setRowData(data);
            api.setColumnDefs(columnDefs);
        }
    };

    onMount(() => {
        grid = new Grid(ref, {
            ...options,
            columnDefs,
            rowData: data,
            onGridReady,
            onCellValueChanged,
            onSelectionChanged,
        });
    });

    onDestroy(() => {
        if (grid) {
            grid.destroy();
        }
    });

    $: updateData(data);
</script>

<div id="container">
    <div bind:this={ref} class="ag-theme-balham"/>
</div>

<style>
    #container {
        width: 500px;
    }

    /*.ag-theme-balham {*/
    /*    --ag-grid-size: 3px;*/
    /*    --ag-row-height: 20px;*/
    /*}*/
</style>
