<script lang="ts">
  import {
    formData,
    loadElement,
    valueMap,
    saveElement,
    type SavedElement,
    type SavedText,
    type SavedDefinition,
    type SavedComponent,
  } from "$lib/formStorage.ts";
  import type { MappedValue } from "$lib/generateDOCX/docxTypes.ts";
  import { onMount } from "svelte";
  import Label from "$lib/CellComponents/Label.svelte";
  import Buttons from "$lib/CellComponents/Buttons.svelte";
  import { eventBus, CellEvent } from "./Header.svelte";
  import Input from "$lib/CellComponents/Input.svelte";
  import { predict } from "$lib/predict.ts";

  export let componentId: number;
  export let elementId: number;
  export let type: "text" | "textarea" | "number" | "date" | "definition";
  export let mappedTo: string | null;
  export let implicit: MappedValue | "mappedOnly" | null;
  export let defined: string | null;
  // ids should never mutate
  // but they do because svelte instead of destroying elements
  // and mounting them again, simply mutates props
  const id: string = `${componentId}_${elementId}`;

  let value: string = "";
  let num: number = 0;
  let predictionPool: string[] = [""];
  let prediction: string = "";

  function load(): string | null {
    const savedValue: string | null = loadElement<SavedText | SavedDefinition>(
      componentId,
      elementId,
      type === "definition" ? "definition" : "text",
    );
    if (!savedValue) {
      return null;
    }
    return savedValue;
  }

  function loadText(): void {
    const data: string | null = load();
    if (!data) {
      console.error("Nothing to load");
      return;
    }
    value = data;
  }

  function loadNumber(): void {
    const data: string | null = load();
    if (!data) {
      return;
    }
    num = parseInt(data);
  }

  function save(): void {
    if (!$formData[componentId].saved) {
      formData.update((thisData: SavedComponent[]) => {
        thisData[componentId].saved = true;
        return thisData;
      });
    }
    saveElement(
      // onMount should take care that this isn't undefined
      $formData[componentId].inner[elementId]!,
      componentId,
      elementId,
    );
  }

  function clear(): void {
    value = "";
    num = 0;
    update(value);
  }

  $: {
    switch ($eventBus.event) {
      case CellEvent.Load:
        if (type === "number") {
          loadNumber();
        } else {
          loadText();
        }
        break;
      case CellEvent.Clear:
        clear();
        break;
      case CellEvent.None:
        // Do nothing
        break;
    }
  }

  function update(data: string): void {
    if (mappedTo) {
      const key: string = mappedTo;
      valueMap.update((map: Map<string, string>) => {
        map.set(key, data);
        return map;
      });
    }
    formData.update((thisData: SavedComponent[]) => {
      const element: SavedElement = thisData[componentId].inner[elementId]!;
      if (
        element.identifier !== "text" &&
        element.identifier !== "definition"
      ) {
        // This should never be realistically reachable
        // because of onMount
        throw new TypeError("onMount failed to update model");
      }
      const text: SavedText | SavedDefinition = {
        ...element,
        inner: data,
      };
      thisData[componentId].inner[elementId] = text;
      return thisData;
    });
  }

  function updateText(): void {
    const result: string | string[] = predict(value, predictionPool);
    if (Array.isArray(result)) {
      prediction = result[0];
      predictionPool = result;
    } else {
      prediction = result;
    }
    update(value);
  }

  function updateNumber(): void {
    const data: string = num.toString();
    update(data);
  }

  onMount(() => {
    const element: SavedElement | undefined =
      $formData[componentId].inner[elementId];
    if (
      element?.identifier === "definition" ||
      element?.identifier === "text"
    ) {
      // non-descructive if there's already something in the model
      if (type === "number") {
        try {
          num = parseInt(element.inner);
        } catch {
          // Saved element doesn't match the shown element
          return;
        }
      } else {
        value = element.inner;
      }
      return;
    }

    formData.update((thisData: SavedComponent[]) => {
      const text: SavedText | SavedDefinition = defined
        ? {
            identifier: "definition",
            inner: value,
            word: defined,
          }
        : {
            identifier: "text",
            inner: value,
            implicit,
          };
      thisData[componentId].inner[elementId] = text;
      return thisData;
    });
  });
  // Would put a onDestroy here as well,
  // but perhaps it'd be better to simply truncate it entirely when components are to be destroyed
</script>

{#if type === "text"}
  <Input {id} bind:value {prediction} on:input={updateText} />
  <br />
  <Buttons {save} load={loadText} />
{:else if type === "textarea"}
  <Input {id} bind:value {prediction} on:input={updateText} textarea={true} />
  <br />
  <Buttons {save} load={loadText} />
{:else if type === "number"}
  <input type="number" min="0" {id} bind:value={num} on:change={updateNumber} />
  <br />
  <Buttons {save} load={loadNumber} />
{:else if type === "date"}
  <!-- TODO style date input -->
  <input type="date" id={String(id)} bind:value on:change={updateText} />
  <br />
  <Buttons {save} load={loadText} />
{:else if type === "definition"}
  <Label
    inner={defined ? defined : "this should never occur"}
    {componentId}
    {elementId}
    notRender={true}
  />
  <br />
  <Input {id} bind:value {prediction} on:change={updateText} />
  <br />
  <Buttons {save} load={loadText} />
{/if}

<style>
  /* TODO match this input style with the custom element */
  input {
    block-size: 2em;
    inline-size: 50%;
    margin: 0.5em;
    border-width: 0;
    box-shadow: 0 0 1em 0.5em rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 600px) {
    input {
      box-sizing: border-box;
      inline-size: calc(100% - 1em);
    }
  }
</style>
