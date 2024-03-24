<script lang="ts">
  import {
    formData,
    type SavedCheckbox,
    type SavedComponent,
    type SavedText,
  } from "$lib/formStorage";
  import { onMount } from "svelte";

  export let inner: string | string[];
  export let componentId: number;
  export let elementId: number;

  onMount(() => {
    formData.update((thisData: SavedComponent[]) => {
      if (Array.isArray(inner)) {
        const element: SavedCheckbox = {
          identifier: "checkbox",
          inner: inner.map((value) => [true, value]),
        };
        thisData[componentId].inner[elementId] = element;
      } else {
        const element: SavedText = {
          identifier: "text",
          inner,
          implicit: null,
        };
        thisData[componentId].inner[elementId] = element;
      }
      return thisData;
    });
  });
</script>
