<script context="module" lang="ts">
  import { writable } from "svelte/store";

  export enum DisplayType {
    Pages = "pages",
    Consequtive = "consequtive",
  }
  export const display = writable<DisplayType>(DisplayType.Pages);
</script>

<script lang="ts">
  import { formData, saveAll, clearStorage } from "$lib/formStorage.ts";

  let view: DisplayType;

  function changeView(): void {
    display.set(view);
  }
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

  <div>
    <label for="page_view">Вид ячеек</label>
    <select id="page_view" bind:value={view} on:change={changeView}>
      <option value={DisplayType.Pages}>Страницы</option>
      <option value={DisplayType.Consequtive}>Последовательно</option>
    </select>
  </div>
</header>

<br />

<style>
  header {
    display: flex;
    flex-direction: row;
    padding: 1em;
    border: solid;
    border-color: rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) black rgba(0, 0, 0, 0);
  }

  button,
  div {
    margin: 0.5em;
  }

  div {
    display: flex;
    flex-direction: column;
  }
</style>
