<script lang="ts">
  import type { InputLayout } from "./template.ts";
  import CellTable from "./CellTable.svelte";
  import CellSubsystems from "./CellSubsystems.svelte";

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
  {:else if layout.type === "checkbox" && typeof layout.amount === "number" && layout.amount > 0}
    {#each [...Array(layout.amount).keys()] as n_id}
      <label hidden for={`${id}_${n_id}`}></label>
      <input type={layout.type} id={`${id}_${n_id}`} />
    {/each}
  {:else if layout.type === "table" && Array.isArray(layout.amount)}
    <CellTable id={String(id)} dimensions={layout.amount} />
  {:else if layout.type === "subsystems" && Array.isArray(layout.amount)}
    <CellSubsystems id={String(id)} dimensions={layout.amount}/>
  {:else}
    <input type={layout.type} id={String(id)} />
  {/if}
</div>

<style>
  div {
    margin: 1em;
  }
</style>
