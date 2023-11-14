<script lang="ts">
  import {
    formData,
    saveCellToLocalStorage,
    readFromLocalStorage,
  } from "$lib/formStorage.ts";
  import type { FormData } from "$lib/formStorage.ts";

  interface FormDataTable extends FormData {
    data: string[][];
  }

  // First number is row number, second is column number
  export let dimensions: [number, number] = [1, 1];
  export let id: number;
  let item: boolean = true;
  let dataTable: string[][] = new Array(dimensions[0])
    .fill(null)
    .map((_) => new Array(dimensions[1]).fill(""));

  function addField(form_data: FormData[]): FormData[] {
    // data is always type string[][] but TS doesn't know
    form_data[id].data = [
      //@ts-expect-error
      ...form_data[id].data,
      new Array(dimensions[1]).fill(""),
    ];
    return form_data;
  }

  function removeField(form_data: FormData[]): FormData[] {
    form_data[id].data = form_data[id].data!.slice(0, dimensions[0]);
    return form_data;
  }

  function saveChange(e: Event, col_id: number, row_id: number): void {
    e.preventDefault();
    // I have to get value from target rather than dataTable because 
    // dataTable doesn't update before the event
    const target = e.currentTarget as HTMLInputElement;
    const value: string = target.value;
    
    // This is the only place where dimensions has to be synced with dataTable
    if (row_id + 2 === dimensions[0] && value === "") {
      dimensions[0] -= 1;
      dataTable = dataTable.slice(0, dimensions[0]);
      formData.update(removeField);
    } else if (row_id + 1 === dimensions[0] && value !== "") {
      dimensions[0] += 1;
      dataTable = [...dataTable, new Array(dimensions[1]).fill("")];
      formData.update(addField);
    }

    formData.update((form_data: FormData[]) => {
      if (!Array.isArray(form_data[id].data)) {
        form_data[id].dimensions = dimensions;
        form_data[id].data = new Array(dimensions[0])
          .fill(null)
          .map((_) => new Array(dimensions[1]).fill(""));
      }

      const new_form_data = form_data as FormDataTable[];

      new_form_data[id].data[row_id][col_id] = value;
      return new_form_data;
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

    dataTable = formDataFromStorage[id].data as string[][];
  }

  function saveTableToLocalStorage(): void {
    saveCellToLocalStorage($formData[id], id);
  }
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
              on:change={(e) => {
                saveChange(e, col_id, row_id);
              }}
              style="width: 100%"
              value={dataCell}
            />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<button type="button" on:click={loadTableFromLocalStorage}>
  Load from localStorage
</button>
<button type="button" on:click={saveTableToLocalStorage}>
  Save to localStorage
</button>

<style>
  .item {
    width: 15%;
  }
</style>
