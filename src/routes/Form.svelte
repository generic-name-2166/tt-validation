<script lang="ts">
  import {
    type SavedElement,
    formData,
    valueMap,
    initStorage,
  } from "$lib/formStorage.ts";
  import { generateDoc } from "$lib/generateDOCX/generateDocx.ts";
  import { onMount } from "svelte";
  import Cell from "./Cell.svelte";
  import { cell_list } from "./template.ts";
  import { display } from "./Header.svelte";

  let dataURL: string = ""; // = "data:application/pdf;base64,";
  let current: number = 0;

  async function validate(): Promise<void> {
    dataURL = await generateDoc($formData, $valueMap);
  }

  function setCurrent(id: number): void {
    current = id;
  }

  formData.set(
    new Array<Array<SavedElement>>(cell_list.length)
      .fill([])
      .map((_null, i) => new Array<SavedElement>(cell_list[i].inner.length)),
  );
  onMount(() => initStorage($formData));
</script>

<main>
  <div>
    {#if $display === "consequtive"}
      {#each cell_list as component, componentId}
        <Cell {componentId} {component} />
      {/each}
    {:else if $display === "pages"}
      <ul>
        {#each cell_list as _component, componentId}
          <li>
            <button
              class="navbar {componentId === current ? 'selected' : ''}"
              type="button"
              on:click={() => setCurrent(componentId)}>{componentId}</button
            >
          </li>
        {/each}
      </ul>

      <Cell componentId={current} component={cell_list[current]} />
    {/if}
  </div>

  <button type="button" on:click|preventDefault={validate}>
    Подтвердить
  </button>
  <br />
  <button type="button">
    <a href={dataURL} download="Заготовка_ТЗ.docx">Скачать docx файл</a>
  </button>
</main>

<style>
  main {
    border: solid;
    border-width: 0.5em;
    border-color: black rgba(0, 0, 0, 0) black rgba(0, 0, 0, 0);
  }

  div {
    display: flex;
    flex-direction: column;
  }

  button {
    margin: 2em 2em 1em 2em;
    block-size: 2em;
    inline-size: 20em;
    background-color: #ffffff;
  }

  br + button {
    margin: 0 2em 2em 2em;
  }

  ul {
    display: flex;
    list-style-type: none;
    margin: 1em 1em 0 1em;
    padding: 0;
  }

  li {
    margin: 0.2em;
  }

  button.navbar {
    block-size: 2em;
    inline-size: 2em;
    margin: 0;
    padding: 0;
  }

  .selected {
    background-color: lightgreen;
  }
</style>
