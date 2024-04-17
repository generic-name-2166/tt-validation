<script lang="ts">
  import {
    type SavedElement,
    formData,
    valueMap,
    initStorage,
    type SavedComponent,
  } from "$lib/formStorage.ts";
  import { generateDoc } from "$lib/generateDOCX/generateDocx.ts";
  import { onMount } from "svelte";
  import Cell from "./Cell.svelte";
  import { cell_list } from "./template.ts";
  import { DisplayType, display } from "./Header.svelte";
  import NavButton from "$lib/CellComponents/NavButton.svelte";

  let dataURL: string = ""; // = "data:application/pdf;base64,";
  let current: number = 0;

  async function validate(): Promise<void> {
    dataURL = await generateDoc($formData, $valueMap);
  }

  function setCurrent(id: number): void {
    current = id;
  }

  function moveRight(): void {
    if (current + 1 < cell_list.length) {
      current = current + 1;
    }
  }

  function moveLeft(): void {
    if (current > 0) {
      current = current - 1;
    }
  }

  formData.set(
    new Array(cell_list.length).fill(null).map((_null, i) => {
      return {
        inner: new Array<SavedElement>(cell_list[i].inner.length),
        saved: false,
      } satisfies SavedComponent;
    }),
  );
  onMount(() => initStorage($formData));
</script>

<div class="body">
  <div>
    {#if $display === DisplayType.Pages}
      <NavButton
        toTheLeft={true}
        disabled={current === 0}
        on:click={moveLeft}
      />
    {/if}
  </div>

  <main>
    <div class="cells">
      {#each cell_list as component, componentId}
        <Cell
          {componentId}
          {component}
          hidden={$display === DisplayType.Pages && componentId !== current}
        />
      {/each}
    </div>

    <div class="docx">
      <button type="button" on:click|preventDefault={validate}>
        Подтвердить
      </button>
      <br />
      <button type="button">
        <a href={dataURL} download="Заготовка_ТЗ.docx">Скачать docx файл</a>
      </button>
    </div>
  </main>

  <div>
    {#if $display === DisplayType.Pages}
      <NavButton
        toTheLeft={false}
        disabled={current === cell_list.length - 1}
        on:click={moveRight}
      />
    {/if}
  </div>
</div>

{#if $display === DisplayType.Pages}
  <navbar>
    <ul>
      {#each cell_list.keys() as componentId}
        <li>
          <button
            class="navbar"
            class:selected={componentId === current}
            class:saved={$formData[componentId].saved}
            type="button"
            on:click={() => setCurrent(componentId)}>{componentId}</button
          >
        </li>
      {/each}
    </ul>
  </navbar>
{/if}

<style>
  .body {
    display: grid;
    grid-template-columns: 10% 1fr 10%;
    border: solid;
    border-width: 0.5em;
    border-color: #2e3033 rgba(0, 0, 0, 0) #2e3033 rgba(0, 0, 0, 0);
    min-block-size: calc(100vh - 236.875px);
    box-sizing: border-box;
  }

  main {
    box-sizing: border-box;
    min-inline-size: min-content;
  }

  .cells {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
  }

  .docx {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    justify-content: start;
    padding: 1em;
  }

  .docx button {
    block-size: 2em;
    inline-size: 20em;
    background-color: rgba(158, 163, 171, 0.5);
  }

  ul {
    background-color: #2e3033;
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  li {
    flex: 1 1 0;
    block-size: 2em;
    background-color: transparent;
    border-bottom: 0 transparent;
    border-top: 0 transparent;
    border-left: 1px solid #aaaaaa;
    border-right: 1px solid #aaaaaa;
  }

  .navbar {
    block-size: 100%;
    inline-size: 100%;
    border: transparent;
    background-color: transparent;
    color: #eeeeee;
    font-weight: bold;
    margin: 0;
    padding: 0;
  }

  .navbar:hover {
    background-color: rgba(46, 48, 51, 0.8);
  }

  .navbar.saved {
    background-color: rgba(128, 0, 128, 0.8);
  }

  .navbar.selected {
    background-color: rgb(213, 38, 39, 0.8);
  }

  .navbar.saved:hover {
    background-color: purple;
  }

  .navbar.selected:hover {
    background-color: #d52627;
  }

  @media (max-width: 600px) {
    button {
      box-sizing: border-box;
      /* inline-size: calc(100% - 4em); */
    }

    .body > div {
      display: none;
    }

    .body {
      grid-template-columns: 1fr;
    }
  }
</style>
