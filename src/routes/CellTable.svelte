<script lang="ts">
  import { formData } from "$lib/formStorage.ts";
  import type { FormData } from "$lib/formStorage.ts";

  export let dimensions: [number, number] = [1, 1];
  export let id: number;
  let item: boolean = true;

  function addField(form_data: FormData[]): FormData[] {
    const new_array = new Array(dimensions[1]).fill("");
    // data is always type string[][] but TS doesn't know
    //@ts-expect-error
    form_data[id].data!.push(new_array);
    return form_data;
  }

  function removeField(form_data: FormData[]): FormData[] {
    form_data[id].data = form_data[id].data!.slice(0, dimensions[0]);
    return form_data;
  }

  function saveChange(e: Event, col_id: number, row_id: number): void {
    e.preventDefault();
    const target = e.currentTarget as HTMLInputElement;
    const value: string = target.value;

    if (row_id + 2 === dimensions[0] && value === "") {
      dimensions[0] -= 1;
      formData.update(removeField);
    } else if (row_id + 1 === dimensions[0] && value !== "") {
      dimensions[0] += 1;
      formData.update(addField);
    }

    formData.update((form_data) => {
      if (!Array.isArray(form_data[id].data)) {
        const [rows, columns] = dimensions;
        form_data[id].dimensions = dimensions;
        form_data[id].data = new Array(rows)
          .fill(null)
          .map(() => new Array(columns).fill(""));
      }

      console.log(form_data[id].data);
      //@ts-expect-error
      form_data[id].data[row_id][col_id] = value;
      return form_data;
    });
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
    {#each [...Array(dimensions[0]).keys()] as row_id}
      <tr>
        {#each [...Array(dimensions[1]).keys()] as col_id}
          <td>
            <label hidden for={`${col_id}_${row_id}`}></label>
            <input
              type="text"
              id={`${col_id}_${row_id}`}
              on:change={(e) => {
                saveChange(e, col_id, row_id);
              }}
              style="width: 100%"
            />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .item {
    width: 15%;
  }
</style>
