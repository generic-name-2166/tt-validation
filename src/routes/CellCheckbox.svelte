<script lang="ts">
  import Buttons from "$lib/CellComponents/Buttons.svelte";
  import {
    formData,
    saveElement,
    loadElement,
    type SavedElement,
    type SavedCheckbox,
    type SavedComponent,
  } from "$lib/formStorage.ts";
  import { onMount } from "svelte";
  import { CellEvent, eventBus } from "./Header.svelte";
  import Input from "$lib/CellComponents/Input.svelte";

  export let labels: string[];
  export let componentId: number;
  export let elementId: number;

  const id: string = `${componentId}_${elementId}`;

  interface Row {
    checked: boolean;
    value: string;
  }

  let values: Row[] = labels.map((label) => {
    return { checked: false, value: label };
  });
  //  .concat(new Array([true, ""]));
  // All my homies hate JavaScript
  values = [...values, { checked: true, value: "" }];

  function serialize(rows: Row[]): [boolean, string][] {
    return rows.map((row: Row) => [row.checked, row.value]);
  }

  function deserialize(rows: [boolean, string][]): Row[] {
    return rows.map((row: [boolean, string]) => {
      return { checked: row[0], value: row[1] };
    });
  }

  function load(): void {
    const savedValues: [boolean, string][] | null = loadElement<SavedCheckbox>(
      componentId,
      elementId,
      "checkbox",
    );
    if (
      !savedValues ||
      labels.length >= savedValues.length ||
      labels[0] !== savedValues[0][1]
    ) {
      // nothing saved or saved values are clearly different from shown
      // TODO better comparison
      return;
    }
    values = deserialize(savedValues);
  }

  function save(): void {
    if (!$formData[componentId].saved) {
      formData.update((thisData: SavedComponent[]) => {
        thisData[componentId].saved = true;
        return thisData;
      });
    }
    saveElement(
      $formData[componentId].inner[elementId],
      componentId,
      elementId,
    );
  }

  function clear(): void {
    values = [
      ...labels.map((label) => {
        return { checked: false, value: label };
      }),
      { checked: true, value: "" },
    ];
    update();
  }

  $: {
    switch ($eventBus.event) {
      case CellEvent.Load:
        load();
        break;
      case CellEvent.Clear:
        clear();
        break;
      case CellEvent.None:
        // Do nothing
        break;
    }
  }

  function update(): void {
    const lastRowId: number = values.length - 1;
    if (
      values[lastRowId - 1].value.length === 0 &&
      values[lastRowId].value.length === 0
    ) {
      values = values.slice(0, lastRowId);
    } else if (values[lastRowId].value.length > 0) {
      values = [...values, { checked: true, value: "" }];
    }

    formData.update((thisData: SavedComponent[]) => {
      const element: SavedElement = thisData[componentId].inner[elementId];
      if (element.identifier !== "checkbox") {
        // This should never be realistically reachable
        // because of onMount
        throw new TypeError("onMount failed to update model");
      }
      const checkboxes: SavedCheckbox = {
        ...element,
        inner: serialize(values),
      };
      thisData[componentId].inner[elementId] = checkboxes;
      return thisData;
    });
  }

  onMount(() => {
    const element: SavedElement | undefined =
      $formData[componentId].inner[elementId];
    if (element?.identifier === "checkbox") {
      // non-descructive if there's already something in the model
      if (
        !element.inner ||
        labels.length >= element.inner.length ||
        labels[0] !== element.inner[0][1]
      ) {
        // nothing saved or saved values are clearly different from shown
        // TODO better comparison
        return;
      }
      values = deserialize(element.inner);
      return;
    }

    formData.update((thisData: SavedComponent[]) => {
      const element: SavedCheckbox = {
        identifier: "checkbox",
        inner: serialize(values),
      };
      thisData[componentId].inner[elementId] = element;
      return thisData;
    });
  });
</script>

{#each values as row, rowId}
  <div>
    {#if rowId < labels.length}
      <input
        type="checkbox"
        id={`${id}_${rowId}`}
        bind:checked={row.checked}
        on:change={update}
      />
      <label for={`${id}_${rowId}`}>
        <span>{row.value}</span>
      </label>
    {:else}
      <input type="checkbox" checked={true} disabled />
      <Input id={`${id}_${rowId}`} bind:value={row.value} on:input={update} />
    {/if}
  </div>
{/each}

<Buttons {save} {load} />

<style>
  div {
    margin: 0.5em;
    box-sizing: border-box;
  }

  div:has(input[type="text"]) {
    display: flex;
  }
</style>
