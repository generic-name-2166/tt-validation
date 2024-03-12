<!-- <script lang="ts">
  import {
    formData,
    saveElement,
    loadElement,
  } from "$lib/formStorage.ts";

  // First number is row number, second is column number
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
  }

  // Set for performance and convenience for jumpCell func
  const supportedKeys = new Set([
    "Enter",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
  ]);

  function jumpCell(
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
  }

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

  button {
    border-radius: 0;
    margin: 0.5em;
    background-color: #555555;
    color: #eeeeee;
  }
</style>
 -->
