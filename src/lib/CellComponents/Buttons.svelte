<script lang="ts">
  export let save: () => void;
  export let load: () => void;
</script>

<button type="button" on:click={save}> Сохранить ячейку </button>
<button type="button" on:click={load}> Загрузить ячейку </button>

<style>
  button {
    inline-size: 20ch;
    border-radius: 0;
    margin: 0.5em;
    background-color: #555555;
    color: #eeeeee;
  }
</style>
