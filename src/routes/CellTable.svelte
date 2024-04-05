<script lang="ts">
  import Buttons from "$lib/CellComponents/Buttons.svelte";
  import {
    formData,
    saveElement,
    loadElement,
    type SavedElement,
    type SavedTable,
    type SavedComponent,
  } from "$lib/formStorage.ts";
  import { onMount } from "svelte";
  import { eventBus, CellEvent } from "./Header.svelte";

  export let componentId: number;
  export let elementId: number;

  const id: string = `${componentId}_${elementId}`;

  interface TableRow {
    word: string;
    definition: string;
  }

  function serialize(table: TableRow[]): string[][] {
    return table.map((row: TableRow): string[] => {
      return [row.word, row.definition];
    });
  }

  function deserialize(table: string[][]): TableRow[] {
    return table.map((row: string[]) => {
      return {
        word: row[0],
        definition: row[1],
      } satisfies TableRow;
    });
  }

  let values: TableRow[] = new Array(2).fill(null).map(() => {
    return {
      word: "",
      definition: "",
    } satisfies TableRow;
  });

  function load(): void {
    const savedValues: string[][] | null = loadElement<SavedTable>(
      componentId,
      elementId,
      "table",
    );
    if (!savedValues || savedValues[0].length !== 2) {
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
      $formData[componentId].inner[elementId]!,
      componentId,
      elementId,
    );
  }

  function clear(): void {
    values = new Array(2).fill(null).map(() => {
      return {
        word: "",
        definition: "",
      } satisfies TableRow;
    });
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
      lastRowId > 1 &&
      values[lastRowId - 1].word.length === 0 &&
      values[lastRowId].word.length === 0 &&
      values[lastRowId - 1].definition.length === 0 &&
      values[lastRowId].definition.length === 0
    ) {
      values = values.slice(0, lastRowId);
    } else if (
      values[lastRowId].word.length > 0 ||
      values[lastRowId].definition.length > 0
    ) {
      values = [...values, { word: "", definition: "" }];
    }

    formData.update((thisData: SavedComponent[]) => {
      const element: SavedElement = thisData[componentId].inner[elementId]!;
      if (element.identifier !== "table") {
        // This should never be realistically reachable
        // because of onMount
        throw new TypeError("onMount failed to update model");
      }
      const table: SavedTable = {
        ...element,
        inner: serialize(values),
      };
      thisData[componentId].inner[elementId] = table;
      return thisData;
    });
  }

  onMount(() => {
    const element: SavedElement | undefined =
      $formData[componentId].inner[elementId];
    if (element?.identifier === "table") {
      // non-descructive if there's already something in the model
      if (!element.inner) {
        // nothing saved or saved values are clearly different from shown
        // TODO better comparison
        return;
      }
      values = deserialize(element.inner);
      return;
    }

    formData.update((thisData: SavedComponent[]) => {
      const element: SavedTable = {
        identifier: "table",
        inner: serialize(values),
      };
      thisData[componentId].inner[elementId] = element;
      return thisData;
    });
  });
</script>

<table {id}>
  <thead>
    <tr>
      <th class="word">Обозначение/Сокращение</th>
      <th class="definition">Расшифровка</th>
    </tr>
  </thead>
  <tbody>
    {#each values as row, rowId}
      <tr>
        <td class="word">
          <!-- TODO use custom Input -->
          <input
            type="text"
            id={`${id}_${rowId}_0`}
            bind:value={row.word}
            on:input={update}
          />
        </td>
        <td class="definition">
          <input
            type="text"
            id={`${id}_${rowId}_1`}
            bind:value={row.definition}
            on:input={update}
          />
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<Buttons {save} {load} />

<style>
  table {
    border-collapse: collapse;
    table-layout: fixed;
    inline-size: 100%;
    border: solid black;
    border-width: 0 0.2em 0 0.2em;
  }

  thead {
    text-align: left;
  }

  tbody tr:nth-child(odd) {
    background-color: #cccccc;
  }

  .word {
    padding: 0.5em;
    inline-size: 15%;
    /* TODO fix this for mobile */
  }

  .definition {
    padding: 0.5em;
  }

  .definition input {
    block-size: 3em;
  }

  input {
    inline-size: 100%;
    block-size: 2em;
    border-width: 0;
    box-sizing: border-box;
  }
</style>
