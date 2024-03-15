<script lang="ts">
  import { formData, saveAll, clearStorage } from "$lib/formStorage.ts";
</script>

<header>
  <button type="button" on:click={() => saveAll($formData)}>
    Сохранить все ячейки
  </button>

  <!-- <button type="button">
    Загрузить все ячейки
  </button> -->

  <button type="button" on:click={clearStorage}>
    Удалить сохранённые ячейки
  </button>

  <!-- <button type="button">
    Очистить все ячейки
  </button> -->
</header>

<br />

<style>
  header {
    padding: 1em;
    border: solid;
    border-color: rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) black rgba(0, 0, 0, 0);
  }
</style>
