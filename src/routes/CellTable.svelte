<script lang="ts">
  export let dimensions: [number, number] = [1, 1];
  export let id: string;
</script>

<table {id}>
  <tbody>
    {#each [...Array(dimensions[0]).keys()] as col_id}
      <tr>
        {#each [...Array(dimensions[1]).keys()] as row_id}
          <td>
            <label hidden for={`${col_id}_${row_id}`}></label>
            <input type="text" id={`${col_id}_${row_id}`} />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
