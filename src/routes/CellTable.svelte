<script lang="ts">
  import Buttons from "$lib/CellComponents/Buttons.svelte";
  import {
    formData,
    saveElement,
    loadElement,
    type SavedElement,
    type SavedTable,
  } from "$lib/formStorage.ts";
  import { onMount } from "svelte";

  export let componentId: number;
  export let elementId: number;

  const id: string = `${componentId}_${elementId}`;

  interface TableRow {
    word: string;
    wordElement?: HTMLInputElement;
    definition: string;
    defElement?: HTMLInputElement;
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

  // Set for performance and convenience for jumpCell func
  const focusKeys = new Set([
    "Enter",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
  ]);

  function changeFocus(
    event: KeyboardEvent,
    rowId: number,
    colId: number,
  ): void {
    const key: string = event.key;
    if (!focusKeys.has(key)) {
      return;
    }

    switch (key) {
      case "Enter":
        if (colId < 1) {
          values[rowId]?.defElement?.focus();
        } else {
          values[rowId + 1]?.wordElement?.focus();
        }
        return;
      case "ArrowUp":
        if (colId < 1) {
          values[rowId - 1]?.wordElement?.focus();
        } else {
          values[rowId - 1]?.defElement?.focus();
        }
        return;
      case "ArrowDown":
        if (colId < 1) {
          values[rowId + 1]?.wordElement?.focus();
        } else {
          values[rowId + 1]?.defElement?.focus();
        }
        return;
      case "ArrowRight":
        if (colId < 1) {
          values[rowId]?.defElement?.focus();
        }
        return;
      case "ArrowLeft":
        if (colId >= 1) {
          values[rowId]?.wordElement?.focus();
        }
        return;
    }
  }

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
    saveElement($formData[componentId][elementId], componentId, elementId);
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

    formData.update((thisData: SavedElement[][]) => {
      const element: SavedElement = thisData[componentId][elementId];
      if (element.identifier !== "table") {
        // This should never be realistically reachable
        // because of onMount
        throw new TypeError("onMount failed to update model");
      }
      const table: SavedTable = {
        ...element,
        inner: serialize(values),
      };
      thisData[componentId][elementId] = table;
      return thisData;
    });
  }

  onMount(() => {
    const element: SavedElement | undefined = $formData[componentId][elementId];
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

    formData.update((thisData: SavedElement[][]) => {
      const element: SavedTable = {
        identifier: "table",
        inner: serialize(values),
      };
      thisData[componentId][elementId] = element;
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
          <input
            type="text"
            id={`${id}_${rowId}_0`}
            bind:this={row.wordElement}
            on:keydown={(e) => changeFocus(e, rowId, 0)}
            bind:value={row.word}
            on:input={update}
          />
        </td>
        <td class="definition">
          <input
            type="text"
            id={`${id}_${rowId}_1`}
            bind:this={row.defElement}
            on:keydown={(e) => changeFocus(e, rowId, 1)}
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
    inline-size: min(15%, 15ch);
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
