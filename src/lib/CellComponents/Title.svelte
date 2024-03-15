<script lang="ts">
  import { onMount } from "svelte";
  import {
    formData,
    type SavedElement,
    type SavedTitle,
  } from "$lib/formStorage";

  export let inner: string;
  export let componentId: number;
  export let elementId: number;
  export let hidden: boolean | undefined;
  export let notRender: boolean | undefined;

  onMount(() => {
    if (notRender) {
      // Since you can't save or load titles and labels
      // Rather than filtering them when rendering
      // just don't save them to the model in the first place, what can go wrong
      return;
    }

    formData.update((thisData: SavedElement[][]) => {
      const element: SavedTitle = {
        identifier: "title",
        inner,
      };
      thisData[componentId][elementId] = element;
      return thisData;
    });
  });
</script>

<h2 {hidden}>{inner}</h2>
