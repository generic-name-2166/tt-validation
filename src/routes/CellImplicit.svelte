<script lang="ts">
  import {
    formData,
    type SavedCheckbox,
    type SavedElement,
    type SavedText,
  } from "$lib/formStorage";
  import { onMount } from "svelte";

  export let inner: string | string[];
  export let componentId: number;
  export let elementId: number;

  onMount(() => {
    formData.update((thisData: SavedElement[][]) => {
      if (Array.isArray(inner)) {
        const element: SavedCheckbox = {
          identifier: "checkbox",
          inner: inner.map((value) => [true, value]),
        };
        thisData[componentId][elementId] = element;
      } else {
        const element: SavedText = {
          identifier: "text",
          inner,
          implicit: null,
        };
        thisData[componentId][elementId] = element;
      }
      return thisData;
    });
  });
</script>
