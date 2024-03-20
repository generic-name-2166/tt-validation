<script lang="ts">
  import Buttons from "$lib/CellComponents/Buttons.svelte";
  import {
    formData,
    saveElement,
    loadElement,
    type SavedElement,
    type SavedCheckbox,
  } from "$lib/formStorage.ts";
  import { onMount } from "svelte";

  export let labels: string[];
  export let componentId: number;
  export let elementId: number;

  const id: string = `${componentId}_${elementId}`;

  interface Row {
    checked: boolean;
    value: string;
    element?: HTMLInputElement;
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

  // Set for performance and convenience
  const focusKeys = new Set(["Enter", "ArrowUp", "ArrowDown"]);

  function changeFocus(event: KeyboardEvent, rowId: number): void {
    const key: string = event.key;
    if (!focusKeys.has(key)) {
      return;
    }

    switch (key) {
      case "Enter":
        values[rowId + 1]?.element?.focus();
        return;
      case "ArrowUp":
        values[rowId - 1]?.element?.focus();
        return;
      case "ArrowDown":
        values[rowId + 1]?.element?.focus();
        return;
    }
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
    saveElement($formData[componentId][elementId], componentId, elementId);
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

    formData.update((thisData: SavedElement[][]) => {
      const element: SavedElement = thisData[componentId][elementId];
      if (element.identifier !== "checkbox") {
        // This should never be realistically reachable
        // because of onMount
        throw new TypeError("onMount failed to update model");
      }
      const checkboxes: SavedCheckbox = {
        ...element,
        inner: serialize(values),
      };
      thisData[componentId][elementId] = checkboxes;
      return thisData;
    });
  }

  onMount(() => {
    const element: SavedElement | undefined = $formData[componentId][elementId];
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

    formData.update((thisData: SavedElement[][]) => {
      const element: SavedCheckbox = {
        identifier: "checkbox",
        inner: serialize(values),
      };
      thisData[componentId][elementId] = element;
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
      <input
        type="text"
        id={`${id}_${rowId}`}
        bind:this={row.element}
        on:keydown={(e) => changeFocus(e, rowId)}
        bind:value={row.value}
        on:input={update}
      />
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

  input[type="text"] {
    block-size: 2em;
    inline-size: 50%;
    margin: 0 0.5em 0 0.5em;
    border-width: 0;
    box-shadow: 0 0 1em 0.5em rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 600px) {
    input[type="text"] {
      box-sizing: border-box;
      inline-size: 100%;
      margin: 0;
    }
  }
</style>
