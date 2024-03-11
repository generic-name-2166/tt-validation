<script lang="ts">
  import { formData, saveAll } from "$lib/formStorage";
</script>

<header>
  <button
    type="button"
    on:click={(e) => {
      saveAll($formData);
    }}
  >
    Save everything to localStorage
  </button>

  <!-- <button type="button">
    Load everything from localStorage (experimental)
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
