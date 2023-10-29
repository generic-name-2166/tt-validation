<script lang="ts">
  import type { InputLayout } from "./template.ts";
  import TableCell from "./TableCell.svelte";

  export let layout: InputLayout;
  export let id: number;
  export let label: string;
  export let amount: number | [number, number] = 1;
  export let title: string | undefined;
</script>

<div>
  {#if title}
    <h2>{title}</h2>
  {/if}

  <label for={String(id)}>{label}</label>

  {#if layout.type === "textarea"}
    <textarea id={String(id)}> somehting </textarea>
  {:else if layout.type === "checkbox" && typeof amount === 'number' && amount > 0}
    {#each [...Array(amount).keys()] as n_id}
      <label hidden for={`${id}_${n_id}`}></label>
      <input type={layout.type} id={`${id}_${n_id}`} />
    {/each}
  {:else if layout.type === "table" && Array.isArray(layout.amount)}
    <TableCell id={String(id)} dimensions={layout.amount} />
  {:else}
    <input type={layout.type} id={String(id)} />
  {/if}
</div>

<style>
  div {
    margin: 1em;
  }
</style>
