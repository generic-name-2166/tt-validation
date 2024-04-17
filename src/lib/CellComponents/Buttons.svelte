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
    background-color: rgba(158, 163, 171, 0.5);
    color: #2e3033;
    font-weight: bold;
  }
</style>
