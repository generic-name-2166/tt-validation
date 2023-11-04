<script lang="ts">
  import { formData } from "$lib/formStorage.ts";

  export let dimensions: [number, number] = [1, 1];
  export let id: number;

  function saveChange(e: Event, col_id: number, row_id: number): void {
    e.preventDefault();
    const target = e.currentTarget as HTMLInputElement;
    const value: string = target.value;
    formData.update((form_data) => {
      if (!Array.isArray(form_data[id].data)) {
        const [rows, columns] = dimensions;
        form_data[id].dimensions = dimensions;
        form_data[id].data = new Array(rows)
          .fill(null)
          .map(() => new Array(columns).fill(""));
      }

      //@ts-expect-error
      form_data[id].data[col_id][row_id] = value;
      return form_data;
    });
  }
</script>

<table id={String(id)}>
  <tbody>
    {#each [...Array(dimensions[0]).keys()] as col_id}
      <tr>
        {#each [...Array(dimensions[1]).keys()] as row_id}
          <td>
            <label hidden for={`${col_id}_${row_id}`}></label>
            <input
              type="text"
              id={`${col_id}_${row_id}`}
              on:change={(e) => {
                saveChange(e, col_id, row_id);
              }}
            />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
