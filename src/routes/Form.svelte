<script lang="ts">
  // import { onMount } from "svelte";
  // import init from "../../form-validation/pkg/form_validation_bg.wasm?init";
  import { generate_pdf } from "./generatePDF.ts";
  import Cell from "./Cell.svelte";
  import { cell_list } from "./template.ts";
  import { formData } from "$lib/formStorage.ts";
  import type { FormData } from "$lib/formStorage.ts";

  /*
  let addFunction: CallableFunction = (...args: any[]) => typeof args;
  function initialize() {
    init().then((instance) => {
      addFunction = instance.exports.add as CallableFunction;
      console.log(addFunction(2, 3));
    });
  }
  */

  // onMount(initialize);

  let dataURL: string = ""; // = "data:application/pdf;base64,";

  function validate(event: Event) {
    event.preventDefault();
    dataURL = generate_pdf(structuredClone($formData));
  }

  {
    const form_data: FormData[] = cell_list.map((cell) => ({
      label: cell.label,
      title: cell.title,
      dimensions: [1, 1],
      data: null,
    }));
    formData.set(form_data);
  }
</script>

<main>
  <div>
    {#each cell_list as cell, id}
      <Cell {id} label={cell.label} layout={cell.layout} title={cell.title} />
    {/each}
  </div>

  <button type="button" on:click={validate}> Submit </button>
</main>

<!-- <p>{addFunction(3, 7)}</p> -->
<button type="button">
  <a href={dataURL} download="tt.pdf">Download pdf file</a>
</button>

<style>
  div {
    display: flex;
    flex-direction: column;
  }

  button {
    margin: 2em 0 2em 0;
  }
</style>
