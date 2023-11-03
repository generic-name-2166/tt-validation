<script lang="ts">
  import { subsystems_number } from "$lib/stores";

  export let dimensions: [number, number] = [1, 1];
  export let id: string;
</script>

<table {id}>
  <tbody>
    {#each [...Array(dimensions[0]).keys()] as col_id}
      <tr>
        {#each [...Array(dimensions[1]).keys()] as row_id}
          <td>
            <label for={`${col_id}_${row_id}`} hidden></label>
            <input type="text" />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<br />

{#each [...Array($subsystems_number).keys()] as s_id}
  <label for={String(s_id)} hidden
    >В подсистеме должны быть реализованы следующие функции</label
  >
  <br />

  <table id={String(s_id)}>
    <tbody>
      {#each [...Array(3).keys()] as col_id}
        <tr>
          {#each [...Array(1).keys()] as row_id}
            <td>
              <label for={`${col_id}_${row_id}_name`}>Название функции</label>
              <br />
              <input id={`${col_id}_${row_id}_name`} type="text" />

              <br />

              <label for={`${col_id}_${row_id}_desc`}>Описание функции</label>
              <input id={`${col_id}_${row_id}_desc`} type="textarea" />
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
{/each}
