<script lang="ts">
  import {
    formData,
    type SavedComponent,
    type SavedTitle,
  } from "$lib/formStorage";
  import { onMount } from "svelte";

  export let inner: string;
  export let componentId: number;
  export let elementId: number;
  export let hidden: boolean | undefined;
  export let notRender: boolean | undefined;

  function onRender(): void {
    if (notRender) {
      // Since you can't save or load titles and labels
      // Rather than filtering them when rendering
      // just don't save them to the model in the first place, what can go wrong
      return;
    }

    formData.update((thisData: SavedComponent[]) => {
      const element: SavedTitle = {
        identifier: "title",
        inner,
      };
      thisData[componentId].inner[elementId] = element;
      return thisData;
    });
  }
  onMount(onRender);
</script>

<h2 {hidden}>{inner}</h2>
