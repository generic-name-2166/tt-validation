<script lang="ts">
  import {
    formData,
    type SavedElement,
    type SavedSubsystem,
    type SavedText,
  } from "$lib/formStorage.ts";
  import { onMount } from "svelte";
  import type { Subsystems } from "./template.ts";

  export let componentId: number;
  export let elementId: number;
  export let template: Subsystems["inner"];

  const id: string = `${componentId}_${elementId}`;
  let values: SavedSubsystem["inner"] = [newSubsystem(), newSubsystem()];

  function newSubsystem(): SavedSubsystem["inner"][0] {
    return {
      name: template.name,
      nameInput: {
        identifier: "text",
        inner: "",
        implicit: null,
      } satisfies SavedText,
      description: template.description,
      descInput: {
        identifier: "text",
        inner: "",
        implicit: null,
      } satisfies SavedText,
    } satisfies SavedSubsystem["inner"][0];
  }

  function addSubsystem(): void {
    values = [...values, newSubsystem()];
    update();
  }

  function deleteSubsystem(rowId: number): void {
    values = values
      .slice(0, rowId)
      .concat(values.slice(rowId + 1, values.length));
    update();
  }

  function update(): void {
    formData.update((thisData: SavedElement[][]) => {
      const element: SavedElement = thisData[componentId][elementId];
      if (element.identifier !== "subsystem") {
        // This should never be realistically reachable
        // because of onMount
        throw new TypeError("onMount failed to update model");
      }
      const subsystems: SavedSubsystem = {
        ...element,
        inner: values,
      };
      thisData[componentId][elementId] = subsystems;
      return thisData;
    });
  }

  function save(): void {
    // TODO
  }

  function load(): void {
    // TODO
  }

  onMount(() => {
    const element: SavedElement | undefined = $formData[componentId][elementId];
    if (element?.identifier === "subsystem") {
      // non-descructive if there's already something in the model
      if (element.inner) {
        // TODO better comparison
        values = element.inner;
      }
      return;
    }
    formData.update((thisData: SavedElement[][]) => {
      const element: SavedSubsystem = {
        identifier: "subsystem",
        inner: values,
      };
      thisData[componentId][elementId] = element;
      return thisData;
    });
  });
</script>

{#each values as subsystem, rowId}
  <div>
    <label for={`${id}_${rowId}_name`}><span>{template.name.inner}</span></label
    >
    <br />
    <input
      type="text"
      id={`${id}_${rowId}_name`}
      bind:value={subsystem.nameInput.inner}
      on:input={update}
    />
    <br />

    <label for={`${id}_${rowId}_desc`}
      ><span>{template.description.inner}</span></label
    >
    <br />
    <textarea
      id={`${id}_${rowId}_desc`}
      contenteditable="true"
      bind:value={subsystem.descInput.inner}
      on:input={update}
    ></textarea>
    <br />
    <button type="button" on:click={() => deleteSubsystem(rowId)}
      >Delete subsystem</button
    >
  </div>
{/each}
<br />
<button type="button" on:click={addSubsystem}>Add subsystem</button>

<!-- <br />

{#each [...Array(amount).keys()] as s_id}
  <label for={String(s_id)} hidden>
    В подсистеме должны быть реализованы следующие функции
  </label>

  <br />
  <label for={`${s_id}_name`}>Название функции</label>
  <br />
  <input id={`${s_id}_name`} type="text" />
  <br />
  <label for={`${s_id}_desc`}>Описание функции</label>
  <br />
  <textarea id={`${s_id}_desc`}></textarea>
{/each} -->

<style>
  div {
    border: solid black;
    border-width: 0 0.2em 0 0.2em;
    box-sizing: border-box;
    margin: 0.5em;
    padding: 0.5em;
  }

  input {
    block-size: 2em;
    inline-size: 50%;
    margin: 0.5em;
    border-width: 0;
    box-shadow: 0 0 1em 0.5em rgba(0, 0, 0, 0.2);
  }

  textarea {
    block-size: 5em;
    inline-size: 50%;
    margin: 0.5em;
    border-width: 0;
    box-shadow: 0 0 1em 0.5em rgba(0, 0, 0, 0.2);
  }
</style>
