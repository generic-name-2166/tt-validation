<script lang="ts">
  import {
    formData,
    type SavedElement,
    type SavedLabel,
  } from "$lib/formStorage";
  import { afterUpdate } from "svelte";

  export let inner: string;
  export let componentId: number;
  export let elementId: number;
  export let hidden: boolean | undefined;
  export let notRender: boolean | undefined;

  $: for_ = `${componentId}_${elementId}`;

  function onRender(): void {
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
  }

  afterUpdate(onRender);
</script>

<label for={for_} {hidden}>
  <span>{inner}</span>
</label>

<style>
  span {
    margin: 0.5em;
    padding: 0.5em; 
  }
</style>
