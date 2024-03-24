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
    new Array<Array<SavedElement>>(cell_list.length)
      .fill([])
      .map((_null, i) => new Array<SavedElement>(cell_list[i].inner.length)),
  );
  onMount(() => initStorage($formData));
</script>

{#if $display === DisplayType.Pages}
  <navbar>
    <ul>
      {#each cell_list.keys() as componentId}
        <li>
          <button
            class="navbar"
            class:selected={componentId === current}
            type="button"
            on:click={() => setCurrent(componentId)}>{componentId}</button
          >
        </li>
      {/each}
    </ul>
  </navbar>
{/if}

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
          hidden={$display === DisplayType.Pages && componentId !== current}
          {componentId}
          {component}
        />
      {/each}
    </div>

    <button class="docx" type="button" on:click|preventDefault={validate}>
      Подтвердить
    </button>
    <br />
    <button class="docx" type="button">
      <a href={dataURL} download="Заготовка_ТЗ.docx">Скачать docx файл</a>
    </button>
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

<style>
  .body {
    display: flex;
    flex-direction: row;
    border: solid;
    border-width: 0.5em;
    border-color: black rgba(0, 0, 0, 0) black rgba(0, 0, 0, 0);
  }

  .body > div {
    flex: 0.5 0 10%;
  }

  main {
    flex: 4 0 80%;
  }

  .cells {
    display: flex;
    flex-direction: column;
  }

  .docx {
    margin: 2em 2em 1em 2em;
    block-size: 2em;
    inline-size: 20em;
    background-color: #ffffff;
  }

  br + .docx {
    margin: 0 2em 2em 2em;
  }

  ul {
    background-color: #222222;
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

  button.navbar {
    block-size: 100%;
    inline-size: 100%;
    border: transparent;
    background-color: transparent;
    color: #eeeeee;
    margin: 0;
    padding: 0;
  }

  button.navbar:hover {
    background-color: rgba(100, 100, 100, 0.2);
  }

  .navbar.selected {
    background-color: rgba(255, 255, 0, 0.8);
    color: black;
  }

  .navbar.selected:hover {
    background-color: yellow;
  }

  @media (max-width: 600px) {
    button {
      box-sizing: border-box;
      inline-size: calc(100% - 4em);
    }

    .body > div {
      display: none;
    }
  }
</style>
