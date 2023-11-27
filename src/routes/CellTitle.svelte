<script lang="ts">
  import { titleData } from "$lib/formStorage";

  let documentTitle: string;
  let manager: string;

  function saveChangeTitle(): void {
    titleData.update((title_data) => ({
      ...title_data,
      documentTitle: documentTitle,
    }));
  }

  function saveChangeManager(): void {
    titleData.update((title_data) => ({ ...title_data, manager: manager }));
  }
</script>

<div>
  <label for="documentTitle"> Document title </label>
  <input
    id="documentTitle"
    type="text"
    bind:value={documentTitle}
    on:change={saveChangeTitle}
  />

  <br />

  <label for="manager"> Manager in charge </label>
  <input
    id="manager"
    type="text"
    bind:value={manager}
    on:change={saveChangeManager}
  />
</div>

<style>
  div {
    margin: 1em;
    border: solid #888888;
    border-width: 0.5em;
    padding: 0.5em;
  }
</style>
