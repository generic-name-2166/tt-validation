<script lang="ts">
  import type { InputLayout } from "./template.ts";
  import CellTable from "./CellTable.svelte";
  import CellSubsystems from "./CellSubsystems.svelte";
  import CellCheckbox from "./CellCheckbox.svelte";
  import { formData } from "$lib/formStorage.ts";

  export let layout: InputLayout;
  export let id: number;
  export let label: string;
  export let title: string | undefined;

  function saveChange(e: Event) : void {
    e.preventDefault();
    const target = e.currentTarget as HTMLInputElement;
    const value: string = target.value;
    formData.update((form_data) => {
      if (!(typeof form_data[id].data !== "string")) {
        form_data[id].dimensions = [1, 1];
      }
      
      form_data[id].data = value;
      return form_data;
    });
  }
</script>

<div>
  {#if title}
    <h2>{title}</h2>
  {/if}

  <label for={String(id)}>{label}</label>
  <br />

  {#if layout.type === "textarea"}
    <textarea id={String(id)} on:change={saveChange}></textarea>
  {:else if layout.type === "checkbox"}
    <CellCheckbox {layout} {id} />
  {:else if layout.type === "table"}
    <CellTable id={String(id)} dimensions={layout.amount} />
  {:else if layout.type === "subsystems"}
    <CellSubsystems id={String(id)} dimensions={layout.amount} />
  {:else}
    <input type={layout.type} id={String(id)} on:change={saveChange} />
  {/if}
</div>

<style>
  div {
    margin: 1em;
  }
</style>
