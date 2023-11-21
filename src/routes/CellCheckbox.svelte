<script lang="ts">
  import type { CheckboxLayout } from "./template.ts";
  import { formData } from "$lib/formStorage.ts";

  export let layout: CheckboxLayout;
  export let id: number;
  let additional: number = 1;

  function saveChange(e: Event, n_id: number): void {
    e.preventDefault();
    const target = e.currentTarget as HTMLInputElement;
    const checked: boolean = target.checked;
    const value: string = layout.labels[n_id];

    formData.update((form_data) => {
      if (!Array.isArray(form_data[id].data)) {
        form_data[id].dimensions = [layout.amount, 1];
        form_data[id].data = new Array(layout.amount)
          .fill(null)
          .map(() => new Array(1).fill(""));
      }

      //@ts-expect-error
      form_data[id].data[n_id][0] = checked ? value : "";
      return form_data;
    });
  }
</script>

{#each [...Array(layout.amount).keys()] as n_id}
  <input
    type={layout.type}
    id={`${id}_${n_id}`}
    on:change={(e) => {
      saveChange(e, n_id);
    }}
  />
  <label for={`${id}_${n_id}`}>{layout.labels[n_id]}</label>
  {#if layout.amount - n_id !== 1}
    <br />
  {/if}
{/each}

{#each [...Array(additional).keys()] as m_id}
  <input type="text" id={`${id}_${layout.amount + m_id}`} />
{/each}
