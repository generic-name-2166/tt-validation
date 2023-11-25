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

  <button type="button">
    Load everything from localStorage (experimental)
  </button>
</header>

<br />
