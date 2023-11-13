<script lang="ts">
  import type { InputLayout } from "./template.ts";
  import type { FormData } from "$lib/formStorage.ts";
  import CellTable from "./CellTable.svelte";
  import CellSubsystems from "./CellSubsystems.svelte";
  import CellCheckbox from "./CellCheckbox.svelte";
  import {
    formData,
    saveCellToLocalStorage,
    readFromLocalStorage,
  } from "$lib/formStorage.ts";

  export let layout: InputLayout;
  export let id: number;
  export let label: string;
  export let title: string | undefined;

  let textElement: HTMLTextAreaElement;
  let inputElement: HTMLInputElement;

  function saveChange(e: Event): void {
    e.preventDefault();
    const target = e.currentTarget as HTMLInputElement;
    const value: string = target.value;

    formData.update((form_data) => {
      if (typeof form_data[id].data !== "string") {
        form_data[id].dimensions = [1, 1];
      }

      form_data[id].data = value;
      return form_data;
    });
  }

  function saveChangeTextarea(e: Event): void {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const value: string = target.textContent!;

    formData.update((form_data) => {
      if (typeof form_data[id].data !== "string") {
        form_data[id].dimensions = [1, 1];
      }

      form_data[id].data = value;
      return form_data;
    });
  }

  function setValue(value: string): void {
    if (inputElement) {
      inputElement.value = value;
      return;
    } else if (textElement) {
      textElement.textContent = value;
    }
  }

  function saveTextToLocalStorage(): void {
    saveCellToLocalStorage($formData[id], id);
  }

  function loadTextFromLocalStorage(): void {
    const formDataFromStorage: FormData[] | null = readFromLocalStorage();
    if (!formDataFromStorage || Array.isArray(formDataFromStorage[id].data)) {
      console.error("Nothing to load from localStorage");
      return;
    }

    formData.update((form_data: FormData[]) => {
      form_data[id] = formDataFromStorage[id];
      return form_data;
    });

    setValue(formDataFromStorage[id].data as string);
  }
</script>

<div>
  {#if title}
    <h2>{title}</h2>
  {/if}

  <label for={String(id)}>{label}</label>
  <br />

  {#if layout.type === "textarea"}
    <textarea id={String(id)} on:change={saveChangeTextarea} bind:this={textElement}></textarea>
    <br />
    <button type="button" on:click={saveTextToLocalStorage}>
      Save to localStorage
    </button>
    <button type="button" on:click={loadTextFromLocalStorage}>
      Load from localStorage
    </button>
  {:else if layout.type === "checkbox"}
    <CellCheckbox {layout} {id} />
  {:else if layout.type === "table"}
    <CellTable {id} dimensions={layout.amount} />
  {:else if layout.type === "subsystems"}
    <CellSubsystems id={String(id)} dimensions={layout.amount} />
  {:else}
    <input type={layout.type} id={String(id)} on:change={saveChange} bind:this={inputElement} />
    <br />
    <button type="button" on:click={saveTextToLocalStorage}>
      Save to localStorage
    </button>
    <button type="button" on:click={loadTextFromLocalStorage}>
      Load from localStorage
    </button>
  {/if}
</div>

<style>
  div {
    margin: 1em;
    border: solid #888888;
    border-width: 0.5em;
    padding: 0.5em;
  }
</style>
