<script lang="ts">
  import Buttons from "$lib/CellComponents/Buttons.svelte";
  import {
    formData,
    saveElement,
    loadElement,
    type SavedElement,
    type SavedTable,
  } from "$lib/formStorage.ts";
  import { onMount } from "svelte";

  export let componentId: number;
  export let elementId: number;

  const id: string = `${componentId}_${elementId}`;

  /* // First number is row number, second is column number
  export let dimensions: [number, number] = [1, 1];
  export let id: number;
  let item: boolean = true;
  let dataTable: string[][] = new Array(dimensions[0])
    .fill(null)
    .map(() => new Array(dimensions[1]).fill(""));
  // An entire table of elements just to jump cells at Enter press
  let inputRefTable: HTMLInputElement[][] = new Array(dimensions[0])
    .fill(null)
    .map(() => new Array(dimensions[1]).fill(null));

  interface FormDataTable extends FormData {
    data: string[][];
  }

  function addField(form_data: FormData[]): FormData[] {
    form_data[id].dimensions[0] = dimensions[0];
    form_data[id].data = [
      ...(form_data[id] as FormDataTable).data,
      new Array(dimensions[1]).fill(""),
    ];
    return form_data;
  }

  function removeField(form_data: FormData[]): FormData[] {
    const new_data: FormData[] = form_data;
    new_data[id].dimensions[0] = dimensions[0];
    new_data[id].data = (form_data[id] as FormDataTable).data.slice(
      0,
      dimensions[0],
    );
    return new_data;
  }

  function saveChange(col_id: number, row_id: number): void {
    const value: string = dataTable[row_id][col_id];

    // console.log(value, row_id, col_id);
    // Table needs to be synced with reality here
    if (row_id + 2 === dimensions[0] && value.length === 0) {
      dimensions[0] -= 1;
      dataTable = dataTable.slice(0, dimensions[0]);
      inputRefTable = inputRefTable.slice(0, dimensions[0]);
      formData.update(removeField);
    } else if (row_id + 1 === dimensions[0] && value.length > 0) {
      dimensions[0] += 1;
      dataTable = [...dataTable, new Array(dimensions[1]).fill("")];
      inputRefTable = [...inputRefTable, new Array(dimensions[1]).fill(null)];
      formData.update(addField);
    }

    formData.update((form_data) => {
      (form_data[id] as FormDataTable).data[row_id][col_id] = value;
      return form_data;
    });
  }

  function loadTableFromLocalStorage(): void {
    const formDataFromStorage: FormData[] | null = readFromLocalStorage();
    if (
      !formDataFromStorage ||
      !formDataFromStorage[id]?.data ||
      !Array.isArray(formDataFromStorage[id].data) ||
      // formDataFromStorage[id].data!.length !== dimensions[0] ||
      formDataFromStorage[id].data![0].length !== dimensions[1]
    ) {
      console.error("Nothing to load from localStorage");
      return;
    }

    formData.update((form_data: FormData[]) => {
      form_data[id] = formDataFromStorage[id];
      return form_data;
    });
    dataTable = (formDataFromStorage[id] as FormDataTable).data;
  }

  function saveTableToLocalStorage(): void {
    // console.log($formData[id].data);
    saveCellToLocalStorage($formData[id], id);
  } */

  interface TableRow {
    word: string;
    wordElement?: HTMLInputElement;
    definition: string;
    defElement?: HTMLInputElement;
  }

  function serialize(table: TableRow[]): string[][] {
    return table.map((row: TableRow): string[] => {
      return [row.word, row.definition];
    });
  }

  function deserialize(table: string[][]): TableRow[] {
    return table.map((row: string[]) => {
      return {
        word: row[0],
        definition: row[1],
      } satisfies TableRow;
    });
  }

  let values: TableRow[] = new Array(2).fill(null).map(() => {
    return {
      word: "",
      definition: "",
    } satisfies TableRow;
  });

  // Set for performance and convenience for jumpCell func
  const focusKeys = new Set([
    "Enter",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
  ]);

  function changeFocus(
    event: KeyboardEvent,
    rowId: number,
    colId: number,
  ): void {
    const key: string = event.key;
    if (!focusKeys.has(key)) {
      return;
    }

    switch (key) {
      case "Enter":
        if (colId < 1) {
          values[rowId]?.defElement?.focus();
        } else {
          values[rowId + 1]?.wordElement?.focus();
        }
        return;
      case "ArrowUp":
        if (colId < 1) {
          values[rowId - 1]?.wordElement?.focus();
        } else {
          values[rowId - 1]?.defElement?.focus();
        }
        return;
      case "ArrowDown":
        if (colId < 1) {
          values[rowId + 1]?.wordElement?.focus();
        } else {
          values[rowId + 1]?.defElement?.focus();
        }
        return;
      case "ArrowRight":
        if (colId < 1) {
          values[rowId]?.defElement?.focus();
        }
        return;
      case "ArrowLeft":
        if (colId >= 1) {
          values[rowId]?.wordElement?.focus();
        }
        return;
    }
  }

  function load(): void {
    const savedValues: string[][] | null = loadElement<SavedTable>(
      componentId,
      elementId,
      "table",
    );
    if (!savedValues || savedValues[0].length !== 2) {
      // nothing saved or saved values are clearly different from shown
      // TODO better comparison
      return;
    }
    values = deserialize(savedValues);
  }

  function save(): void {
    saveElement($formData[componentId][elementId], componentId, elementId);
  }

  /* function jumpCell(
    event: KeyboardEvent,
    col_id: number,
    row_id: number,
  ): void {
    const key: string = event.key;
    if (!supportedKeys.has(key)) {
      return;
    }
    switch (key) {
      case "Enter":
        if (col_id + 1 < dimensions[1]) {
          inputRefTable[row_id][col_id + 1].focus();
        } else if (dataTable[row_id][col_id].length > 0) {
          // Can just be assumed that change is to be saved
          // I don't know if it runs a second time after this event but it should be fine
          saveChange(col_id, row_id);
          inputRefTable[row_id + 1][0].focus();
        }
        return;
      case "ArrowUp":
        if (row_id > 0) {
          inputRefTable[row_id - 1][col_id].focus();
        }
        return;
      case "ArrowDown":
        if (row_id + 1 < dimensions[0]) {
          inputRefTable[row_id + 1][col_id].focus();
        }
        return;
      case "ArrowLeft":
        if (col_id > 0) {
          inputRefTable[row_id][col_id - 1].focus();
        }
        return;
      case "ArrowRight":
        if (col_id + 1 < dimensions[1]) {
          inputRefTable[row_id][col_id + 1].focus();
        }
        return;
      default:
        throw new Error("What");
    }
  } */

  /* formData.update((form_data: FormData[]) => {
    form_data[id].dimensions = dimensions;
    form_data[id].data = new Array(dimensions[0])
      .fill(null)
      .map((_) => new Array(dimensions[1]).fill(""));
    return form_data;
  }); */

  function update(): void {
    const lastRowId: number = values.length - 1;
    if (
      lastRowId > 1 &&
      values[lastRowId - 1].word.length === 0 &&
      values[lastRowId].word.length === 0 &&
      values[lastRowId - 1].definition.length === 0 &&
      values[lastRowId].definition.length === 0
    ) {
      values = values.slice(0, lastRowId);
    } else if (
      values[lastRowId].word.length > 0 ||
      values[lastRowId].definition.length > 0
    ) {
      values = [...values, { word: "", definition: "" }];
    }

    formData.update((thisData: SavedElement[][]) => {
      const element: SavedElement = thisData[componentId][elementId];
      if (element.identifier !== "table") {
        // This should never be realistically reachable
        // because of onMount
        throw new TypeError("onMount failed to update model");
      }
      const table: SavedTable = {
        ...element,
        inner: serialize(values),
      };
      thisData[componentId][elementId] = table;
      return thisData;
    });
  }

  onMount(() => {
    const element: SavedElement | undefined = $formData[componentId][elementId];
    if (element?.identifier === "table") {
      // non-descructive if there's already something in the model
      if (!element.inner) {
        // nothing saved or saved values are clearly different from shown
        // TODO better comparison
        return;
      }
      values = deserialize(element.inner);
      return;
    }

    formData.update((thisData: SavedElement[][]) => {
      const element: SavedTable = {
        identifier: "table",
        inner: serialize(values),
      };
      thisData[componentId][elementId] = element;
      return thisData;
    });
  });
</script>

<!-- <table id={String(id)}>
  <tbody>
    {#if dimensions[1] === 2}
      <tr>
        <th class:item>Обозначение/Сокращение</th>
        <th>Расшифровка</th>
      </tr>
    {/if}
    {#each dataTable as dataRow, row_id}
      <tr>
        {#each dataRow as dataCell, col_id}
          <td>
            <label hidden for={`${col_id}_${row_id}`}></label>
            <input
              type="text"
              id={`${col_id}_${row_id}`}
              bind:value={dataCell}
              on:change={(e) => {
                saveChange(col_id, row_id);
              }}
              bind:this={inputRefTable[row_id][col_id]}
              on:keydown={(e) => {
                jumpCell(e, col_id, row_id);
              }}
              style="width: 100%"
            />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table> -->

<table {id}>
  <thead>
    <tr>
      <th class="word">Обозначение/Сокращение</th>
      <th class="definition">Расшифровка</th>
    </tr>
  </thead>
  <tbody>
    {#each values as row, rowId}
      <tr>
        <td class="word">
          <input
            type="text"
            id={`${id}_${rowId}_0`}
            bind:this={row.wordElement}
            on:keydown={(e) => changeFocus(e, rowId, 0)}
            bind:value={row.word}
            on:input={update}
          />
        </td>
        <td class="definition">
          <input
            type="text"
            id={`${id}_${rowId}_1`}
            bind:this={row.defElement}
            on:keydown={(e) => changeFocus(e, rowId, 1)}
            bind:value={row.definition}
            on:input={update}
          />
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<!-- <button type="button" on:click={saveTableToLocalStorage}>
  Сохранить ячейку
</button>
<button type="button" on:click={loadTableFromLocalStorage}>
  Загрузить ячейку
</button> -->
<Buttons {save} {load} />

<style>
  table {
    border-collapse: collapse;
    table-layout: fixed;
    inline-size: 100%;
    border: solid black;
    border-width: 0 0.2em 0 0.2em;
  }

  thead {
    text-align: left;
  }

  tbody tr:nth-child(odd) {
    background-color: #cccccc;
  }

  .word {
    padding: 0.5em;
    inline-size: 15%;
  }

  .definition {
    padding: 0.5em;
  }

  .definition input {
    block-size: 3em;
  }

  input {
    inline-size: 100%;
    block-size: 2em;
    border-width: 0;
    box-sizing: border-box;
  }
</style>
