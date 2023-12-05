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
    <label for={item.key}>{item.display}</label>
    <br />
    <input
      id={item.key}
      type="text"
      bind:value={item.value}
      on:change={() => { saveChange(item.key, item.value); }}
    />
    <br />
  {/each}
</div>

<style>
  div {
    margin: 1em;
    border: solid #888888;
    border-width: 0.5em;
    padding: 0.5em;
  }
</style>
