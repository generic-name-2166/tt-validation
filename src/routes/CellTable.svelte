<script lang="ts">
  import {
    formData,
    saveCellToLocalStorage,
    readFromLocalStorage,
  } from "$lib/formStorage.ts";
  import type { FormData } from "$lib/formStorage.ts";

  // First number is row number, second is column number
  export let dimensions: [number, number] = [1, 1];
  export let id: number;
  let item: boolean = true;

  interface FormDataTable extends FormData {
    data: string[][];
  }

  function addField(form_data: FormDataTable[]): FormDataTable[] {
    form_data[id].dimensions[0] = dimensions[0];
    form_data[id].data = [
      ...form_data[id].data,
      new Array(dimensions[1]).fill(""),
    ];
    return form_data;
  }

  function removeField(form_data: FormDataTable[]): FormDataTable[] {
    form_data[id].dimensions[0] = dimensions[0];
    form_data[id].data = form_data[id].data!.slice(0, dimensions[0]);
    return form_data;
  }

  function saveChange(e: Event, row_id: number): void {
    e.preventDefault();
    // I have to get value from target rather than dataTable because
    // dataTable doesn't update before the event
    const target = e.currentTarget as HTMLInputElement;
    const value: string = target.value;

    if (row_id + 2 === dimensions[0] && value === "") {
      dimensions[0] -= 1;
      formData.update((form_data) => removeField(form_data as FormDataTable[]));
    } else if (row_id + 1 === dimensions[0] && value !== "") {
      dimensions[0] += 1;
      formData.update((form_data) => addField(form_data as FormDataTable[]));
    }
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
  }

  function saveTableToLocalStorage(): void {
    saveCellToLocalStorage($formData[id], id);
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
    {#each [...Array(dimensions[0]).keys()] as row_id}
      <tr>
        {#each [...Array(dimensions[1]).keys()] as col_id}
          <td>
            <label hidden for={`${col_id}_${row_id}`}></label>
            <input
              type="text"
              id={`${col_id}_${row_id}`}
              on:change={(e) => {
                saveChange(e, row_id);
              }}
              style="width: 100%"
              value={$formData[id].data[col_id][row_id]}
            />
            <!-- Object should never be null -->
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
