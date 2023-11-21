<script lang="ts">
  import type { FormData } from "$lib/formStorage.ts";
  import {
    formData,
    saveCellToLocalStorage,
    readFromLocalStorage,
  } from "$lib/formStorage.ts";

  // First number is row number, second is column number
  export let dimensions: [number, number] = [1, 1];
  export let id: number;
  let item: boolean = true;
  let dataTable: string[][] = new Array(dimensions[0])
    .fill(null)
    .map(() => new Array(dimensions[1]).fill(""));

  interface FormDataTable extends FormData {
    data: string[][];
  }

  function changeField(
    table_data: string[][],
    new_value: string,
    col_id: number,
    row_id: number,
  ): string[][] {
    const new_table: string[][] = table_data;
    new_table[row_id][col_id] = new_value;
    return new_table;
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

  function saveChange(e: Event, col_id: number, row_id: number): void {
    e.preventDefault();
    const value: string = dataTable[row_id][col_id];

    console.log(value, row_id, col_id);
    if (row_id + 2 === dimensions[0] && value.length === 0) {
      dimensions[0] -= 1;
      dataTable = dataTable.slice(0, dimensions[0]);
      formData.update(removeField);
    } else if (row_id + 1 === dimensions[0] && value.length > 0) {
      dimensions[0] += 1;
      dataTable = [...dataTable, new Array(dimensions[1]).fill("")];
      formData.update(addField);
    }

    formData.update((form_data) => {
      form_data[id].data = changeField(
        (form_data[id] as FormDataTable).data,
        value,
        col_id,
        row_id,
      );
      return form_data;
    });
  }

  function loadTableFromLocalStorage(): void {
    const formDataFromStorage: FormData[] | null = readFromLocalStorage();
    if (
      !formDataFromStorage ||
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
    console.log($formData[id].data);
    saveCellToLocalStorage($formData[id], id);
  }

  function jumpCell(event: KeyboardEvent, col_id: number, row_id: number): void {
    const key: string = event.key;
    if (key !== "Enter") {
      return;
    } else if (col_id + 1 < dimensions[1]) {
      // TODO
    }
  }

  // This ensures the object is not null in there
  formData.update((form_data: FormData[]) => {
    form_data[id].dimensions = dimensions;
    form_data[id].data = new Array(dimensions[0])
      .fill(null)
      .map((_) => new Array(dimensions[1]).fill(""));
    return form_data;
  });
</script>

<table id={String(id)}>
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
                saveChange(e, col_id, row_id);
              }}
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
</table>

<button type="button" on:click={saveTableToLocalStorage}>
  Сохранить ячейку
</button>
<button type="button" on:click={loadTableFromLocalStorage}>
  Загрузить ячейку
</button>

<style>
  .item {
    width: 15%;
  }
</style>
