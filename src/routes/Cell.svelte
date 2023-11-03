<script lang="ts">
  import type { InputLayout } from "./template.ts";
  import CellTable from "./CellTable.svelte";
  import CellSubsystems from "./CellSubsystems.svelte";
  import CellCheckbox from "./CellCheckbox.svelte";

  export let layout: InputLayout;
  export let id: number;
  export let label: string;
  export let title: string | undefined;
</script>

<div>
  {#if title}
    <h2>{title}</h2>
  {/if}

  <label for={String(id)}>{label}</label>
  <br />

  {#if layout.type === "textarea"}
    <textarea id={String(id)}></textarea>
  {:else if layout.type === "checkbox"}
    <CellCheckbox {layout} {id} />
  {:else if layout.type === "table"}
    <CellTable id={String(id)} dimensions={layout.amount} />
  {:else if layout.type === "subsystems"}
    <CellSubsystems id={String(id)} dimensions={layout.amount} />
  {:else}
    <input type={layout.type} id={String(id)} />
  {/if}
</div>

<style>
  div {
    margin: 1em;
  }
</style>
