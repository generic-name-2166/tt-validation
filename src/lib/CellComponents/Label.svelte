<script lang="ts">
  import {
    formData,
    type SavedComponent,
    type SavedLabel,
  } from "$lib/formStorage";
  import { onMount } from "svelte";

  export let inner: string;
  export let componentId: number;
  export let elementId: number;
  export let notRender: boolean | undefined;

  const for_: string = `${componentId}_${elementId}`;

  function onRender(): void {
    if (notRender) {
      // Since you can't save or load titles and labels
      // Rather than filtering them when rendering
      // just don't save them to the model in the first place, what can go wrong
      return;
    }

    formData.update((thisData: SavedComponent[]) => {
      const element: SavedLabel = {
        identifier: "label",
        inner,
      };
      thisData[componentId].inner[elementId] = element;
      return thisData;
    });
  }
  onMount(onRender);
</script>

<label for={for_}>
  {inner}
</label>

<style>
  label {
    margin: 0.5em;
    padding: 0.5em;
  }
</style>
