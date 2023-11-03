<script lang="ts">
  import type { CheckboxLayout } from "./template.ts";
  import { formData } from "$lib/formStorage.ts";

  export let layout: CheckboxLayout;
  export let id: number;
</script>

{#each [...Array(layout.amount).keys()] as n_id}
  <input type={layout.type} id={`${id}_${n_id}`} />
  <label for={`${id}_${n_id}`}>{layout.labels[n_id]}</label>
  {#if layout.amount - n_id !== 1}
    <br />
  {/if}
{/each}
