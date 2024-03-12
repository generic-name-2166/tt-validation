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

  let dataURL: string = ""; // = "data:application/pdf;base64,";

  async function validate(): Promise<void> {
    dataURL = await generateDoc($formData, $valueMap);
  }

  /* {
    const form_data: FormData[] = cell_list.map((cell) => ({
      label: cell.label,
      title: cell.title,
      dimensions: [1, 1],
      data: null,
      extra: cell.extra,
    }));
    formData.set(form_data);

    const title_data: Map<string, string> = new Map();
    title_data.set("documentTitle", "N/A");
    title_data.set("managerName", "N/A");
    titleData.set(title_data);
  } */
  formData.set(
    new Array<Array<SavedElement>>(cell_list.length)
      .fill([])
      .map((_null, i) => new Array<SavedElement>(cell_list[i].inner.length)),
  );
  onMount(() => {
    initStorage($formData);
  });
</script>

<main>
  <div>
    <!-- <CellTitle /> -->
    {#each cell_list as cell, componentId}
      <Cell {componentId} component={cell} />
    {/each}
  </div>

  <button type="button" on:click|preventDefault={validate}> Submit </button>
  <br />
  <button type="button">
    <a href={dataURL} download="Заготовка_ТЗ.docx">Download docx file</a>
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
</style>
