<script lang='ts'>
  export let dimensions: [number, number] = [1, 1];
  export let id: string;
</script>

<table {id}>
  <tbody>
    {#each [...Array(dimensions[0]).keys()] as col_id}
      <tr> 
        {#each [...Array(dimensions[1]).keys()] as row_id}
          <td>
            <input type="text" />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>