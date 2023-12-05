<script lang="ts">
  import type { InputLayout } from "./template.ts";
  import type { FormData } from "$lib/formStorage.ts";
  import CellTable from "$lib/CellComponents/CellTable.svelte";
  import CellSubsystems from "$lib/CellComponents/CellSubsystems.svelte";
  import CellCheckbox from "$lib/CellComponents/CellCheckbox.svelte";
  import CellDate from "$lib/CellComponents/CellDate.svelte";
  import {
    formData,
    saveCellToLocalStorage,
    readFromLocalStorage,
  } from "$lib/formStorage.ts";

  export let layout: InputLayout;
  export let id: number;
  export let label: string;
  export let title: string | undefined;

  // Can also be a date, a number or a file maybe even
  let inputValue: string;

  function saveChange(e: Event): void {
    const value: string = inputValue;

    formData.update((form_data) => {
      if (typeof form_data[id].data !== "string") {
        form_data[id].dimensions = [1, 1];
      }

      form_data[id].data = value;
      return form_data;
    });
  }

  function saveChangeTextarea(e: Event): void {
    const value: string = inputValue;

    formData.update((form_data) => {
      if (typeof form_data[id].data !== "string") {
        form_data[id].dimensions = [1, 1];
      }

      form_data[id].data = value;
      return form_data;
    });
  }

  function saveTextToLocalStorage(): void {
    saveCellToLocalStorage($formData[id], id);
  }

  function loadTextFromLocalStorage(): void {
    const formDataFromStorage: FormData[] | null = readFromLocalStorage();
    if (
      !formDataFromStorage ||
      !formDataFromStorage[id]?.data ||
      Array.isArray(formDataFromStorage[id].data)
    ) {
      console.error("Nothing to load from localStorage");
      return;
    }

    formData.update((form_data: FormData[]) => {
      form_data[id] = formDataFromStorage[id];
      return form_data;
    });

    inputValue = formDataFromStorage[id].data as string;
  }

  function typeAction(element: HTMLInputElement): void {
    // A crutch due to bind:value
    element.type = layout.type;
  }
</script>

<div>
  {#if title}
    <h2>{title}</h2>
  {/if}

  <label for={String(id)}>{label}</label>
  <br />

  {#if layout.type === "textarea"}
    <textarea
      id={String(id)}
      bind:textContent={inputValue}
      on:change={saveChangeTextarea}
      contenteditable="true"
    ></textarea>
    <br />
    <button type="button" on:click={saveTextToLocalStorage}>
      Сохранить ячейку
    </button>
    <button type="button" on:click={loadTextFromLocalStorage}>
      Загрузить ячейку
    </button>
  {:else if layout.type === "checkbox"}
    <CellCheckbox amount={layout.amount} labels={layout.labels} {id} />
  {:else if layout.type === "table"}
    <CellTable {id} dimensions={layout.amount} />
  {:else if layout.type === "subsystems"}
    <CellSubsystems id={String(id)} amount={layout.amount} />
  {:else if layout.type === "date"}
    <CellDate {id} />
  {:else}
    <input
      use:typeAction
      id={String(id)}
      bind:value={inputValue}
      on:change={saveChange}
    />
    <br />
    <button type="button" on:click={saveTextToLocalStorage}>
      Сохранить ячейку
    </button>
    <button type="button" on:click={loadTextFromLocalStorage}>
      Загрузить ячейку
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
.cell {
  width: 100px;
  height: 100px;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  text-align: center;
  line-height: 100px;
  font-size: 16px;
  color: #333;
  transition: background-color 0.3s ease;
}

.cell:hover {
  background-color: #e0e0e0;
}
