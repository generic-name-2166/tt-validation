<script lang="ts">
  import {
    formData,
    type SavedCheckbox,
    type SavedComponent,
    type SavedElement,
    type SavedText,
  } from "$lib/formStorage";
  import { onDestroy, onMount } from "svelte";

  export let inner: string | string[];
  export let componentId: number;
  export let elementId: number;

  onMount((): void => {
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

  onDestroy((): void => {
    formData.update((thisData: SavedComponent[]) => {
      thisData[componentId].inner[elementId] = undefined;
      return thisData;
    });
  });
</script>
