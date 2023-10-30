<script lang="ts">
  import { onMount } from "svelte";
  import Cell from "./Cell.svelte";
  import init from "../../form-validation/pkg/form_validation_bg.wasm?init";
  import { jsPDF } from "jspdf";
  import type { InputLayout } from "./template.ts";

  let addFunction: CallableFunction = (...args: any[]) => typeof args;

  function initialize() {
    init().then((instance) => {
      addFunction = instance.exports.add as CallableFunction;
      console.log(addFunction(2, 3));
    });
  }

  function generate_pdf(): string {
    const doc = new jsPDF();
    doc.text("hello", 10, 10);
    return doc.output("datauristring");
  }

  onMount(initialize);

  interface ICell {
    label: string;
    title?: string;
    layout: InputLayout;
  }

  let cell_list: ICell[] = [
    {
      title: "Test",
      label: "Enter title: ",
      layout: { type: "text" },
    },
    {
      label: "Enter technical task: ",
      layout: { type: "textarea" },
    },
    {
      label: "Upload a file: ",
      layout: { type: "file" },
    },
    {
      label: "Table",
      layout: { type: "table", amount: [3, 2] },
    },
    {
      label: "Checkbox",
      layout: { type: "checkbox", amount: 5 },
    },
  ];

  let dataURL: string = ""; // = "data:application/pdf;base64,";

  function validate(event: Event) {
    event.preventDefault();
    const a = generate_pdf();
    console.log(a);
    dataURL = a;
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

<p>{addFunction(3, 7)}</p>
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
