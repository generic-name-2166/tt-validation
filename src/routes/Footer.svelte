<script lang="ts">
  function deleteLocalStorage(): void {
    localStorage.clear();
  }
</script>

<br />

<footer>
  <button type="button" on:click={deleteLocalStorage}>
    Delete localStorage
  </button>
</footer>

<style>
  footer {
    padding: 1em;
    border: solid;
    border-color: black rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);
  }
</style>
