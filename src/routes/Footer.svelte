<script lang="ts">
  import { formData, saveAll, clearStorage } from "$lib/formStorage.ts";
  import { loadAll, clearAll } from "./Header.svelte";
</script>

<br />

<footer>
  <button type="button" on:click={() => saveAll($formData)}>
    Сохранить все ячейки
  </button>

  <button type="button" on:click={loadAll}> Загрузить все ячейки </button>

  <button type="button" on:click={clearStorage}>
    Удалить сохранённые ячейки
  </button>

  <button type="button" on:click={clearAll}> Очистить все ячейки </button>
</footer>

<style>
  footer {
    display: flex;
    flex-direction: row;
    padding: 1em;
    border: solid;
    border-color: black rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);
    overflow-y: scroll;
  }

  button {
    margin: 0.5em;
  }
</style>
