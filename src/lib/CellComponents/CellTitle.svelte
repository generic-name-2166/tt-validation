<script lang="ts">
  import { titleData } from "$lib/formStorage";

  interface TitleItem {
    key: string;
    display: string;
    value: string;
  }

  let items: TitleItem[] = [
    { key: "documentTitle", display: "documentTitle", value: "" },
    { key: "managerPosition", display: "managerPosition", value: "" },
    { key: "managerName", display: "managerName", value: "" },
  ]

  function saveChange(key: string, value: string): void {
    titleData.update((title_data) => {
      title_data.set(key, value);
      return title_data;
    });
  }
</script>

<div>
  <h2>Титульный лист</h2>

  {#each items as item}
    <label for={item.key}>
      <span>{item.display}</span>
    </label>
    <br />
    <input
      id={item.key}
      type="text"
      bind:value={item.value}
      on:change={() => { saveChange(item.key, item.value); }}
    />
    <br />
  {/each}

  <br />

  <button type="button">
    Сохранить ячейку
  </button>
  <button type="button">
    Загрузить ячейку
  </button>
</div>

<style>
  div {
    margin: 1em;
    border: solid #888888;
    border-width: 0.5em;
    padding: 0.5em;
  }
  
  button {
    border-radius: 0;
    margin: 0.5em;
    background-color: #555555;
    color: #eeeeee;
  }
  
  input {
    block-size: 2em;
    inline-size: 50%;
    margin: 0.5em;
    border-width: 0;
    box-shadow:0 0 1em 0.5em rgba(0,0,0,0.2);
  }

  span {
    margin: 0.5em;
  }
</style>
