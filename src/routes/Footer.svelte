<script lang="ts">
  function deleteLocalStorage(): void {
    localStorage.clear();
  }
</script>

<br />
<button type="button" on:click={deleteLocalStorage}>
  Delete localStorage
</button>
