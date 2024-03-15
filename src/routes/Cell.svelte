<script lang="ts">
  import type { Component } from "./template.ts";
  import CellText from "./CellText.svelte";
  import Label from "$lib/CellComponents/Label.svelte";
  import Title from "$lib/CellComponents/Title.svelte";
  import CellCheckbox from "./CellCheckbox.svelte";
  import CellTable from "./CellTable.svelte";
  import CellSubsystems from "./CellSubsystems.svelte";

  export let componentId: number;
  export let component: Component;

  /* // Can also be a date, a number or a file maybe even
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
  } */

  /* function typeAction(element: HTMLInputElement): void {
    // A crutch due to bind:value
    element.type = layout.type;
  } */
  // So the flow of data right now is like this
  // Template --(on load)--> Svelte component
  // Svelte component --(on change)--> formData store
  // formData store --(on change)--> localStorage
  // formData store --(on submit)--> docx

  // So do I again serialize from formData
  // or do it from the Svelte component
</script>

<!-- <div>
  {#if title}
    <h2>{title}</h2>
  {/if}

  <label for={String(id)}>
    <span>{label}</span>
  </label>
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
</div> -->
<div hidden={component.implicit}>
  <!-- Using hidden rather than if for the side effects -->
  {#each component.inner as element, elementId}
    {#if element.identifier === "title"}
      <Title
        inner={element.inner}
        {componentId}
        {elementId}
        notRender={element.notRender}
      />
    {:else if element.identifier === "label"}
      <Label
        inner={element.inner}
        {componentId}
        {elementId}
        notRender={element.notRender}
      />
    {:else if element.identifier === "text"}
      <CellText
        {componentId}
        {elementId}
        type={element.type}
        mappedTo={element.mappedTo}
        implicit={element.implicit}
        defined={null}
      />
    {:else if element.identifier === "definition"}
      <CellText
        {componentId}
        {elementId}
        type="definition"
        mappedTo={element.mappedTo}
        implicit={null}
        defined={element.word}
      />
    {:else if element.identifier === "checkbox"}
      <CellCheckbox labels={element.inner} {componentId} {elementId} />
    {:else if element.identifier === "table"}
      <CellTable {componentId} {elementId} />
    {:else if element.identifier === "subsystem"}
      <CellSubsystems {componentId} {elementId} template={element.inner} />
    {/if}
    {#if elementId + 1 < component.inner.length}
      <br />
    {/if}
  {/each}
</div>

<style>
  div {
    margin: 1em;
  }
</style>
