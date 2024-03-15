<script lang="ts">
  import { onMount } from "svelte";
  import {
    formData,
    type SavedElement,
    type SavedLabel,
  } from "$lib/formStorage";

  export let inner: string;
  export let componentId: number;
  export let elementId: number;
  export let hidden: boolean | undefined;
  export let notRender: boolean | undefined;

  const for_: string = `${componentId}_${elementId}`;

  onMount(() => {
    if (notRender) {
      // Since you can't save or load titles and labels
      // Rather than filtering them when rendering
      // just don't save them to the model in the first place, what can go wrong
      return;
    }

    formData.update((thisData: SavedElement[][]) => {
      const element: SavedLabel = {
        identifier: "label",
        inner,
      };
      thisData[componentId][elementId] = element;
      return thisData;
    });
  });
</script>

<label for={for_} {hidden}>
  <span>{inner}</span>
</label>

<style>
  span {
    margin: 0.5em;
  }
</style>
