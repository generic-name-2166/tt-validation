<script lang="ts">
  import type { FormData } from "$lib/formStorage.ts";
  import { formData, titleData } from "$lib/formStorage.ts";
  import { generateDOCX } from "$lib/generateDOCX/generateDocx.ts";
  import Cell from "./Cell.svelte";
  import CellTitle from "$lib/CellComponents/CellTitle.svelte";
  import { cell_list } from "./template.ts";

  let dataURL: string = ""; // = "data:application/pdf;base64,";

  // The value is ignored so no Promise<void>
  //@ts-expect-error
  async function validate(event: Event): void {
    event.preventDefault();
    dataURL = await generateDOCX($formData, $titleData);
  }

  {
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
  }
</script>

<main>
  <div>
    <CellTitle />

    {#each cell_list as cell, id}
      <Cell {id} label={cell.label} layout={cell.layout} title={cell.title} />
    {/each}
  </div>

  <button type="button" on:click={validate}> Submit </button>
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
