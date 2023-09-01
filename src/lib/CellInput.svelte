<script lang="ts">
    export let valueSelected: string;
    export let editing: boolean;
    export let htmlElement: HTMLElement;

    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();
</script>


<input
        type="text"
        on:keydown={(event) => {
            if (["Escape", "Tab", "Enter"].includes(event.key)) event.preventDefault();
            dispatch('keydown', event);
        }}
        bind:this={htmlElement}
        bind:value={valueSelected}
        autofocus={editing}
        on:focus={() => {editing = true;}}
>

<style>
    input {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        margin: 0;
        border: 1px solid black;

        font: inherit;
        text-align: inherit;

        padding: 0.1rem 0.5rem;
    }
</style>
