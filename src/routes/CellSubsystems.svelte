<script lang="ts">
  import {
    formData,
    saveElement,
    type SavedElement,
    type SavedSubsystem,
    type SavedText,
    loadElement,
    type SavedComponent,
  } from "$lib/formStorage.ts";
  import { onMount } from "svelte";
  import type { Subsystems } from "./template.ts";
  import Buttons from "$lib/CellComponents/Buttons.svelte";
  import { eventBus, CellEvent } from "./Header.svelte";
  import Input from "$lib/CellComponents/Input.svelte";

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
    formData.update((thisData: SavedComponent[]) => {
      const element: SavedElement = thisData[componentId].inner[elementId];
      if (element.identifier !== "subsystem") {
        // This should never be realistically reachable
        // because of onMount
        throw new TypeError("onMount failed to update model");
      }
      const subsystems: SavedSubsystem = {
        ...element,
        inner: values,
      };
      thisData[componentId].inner[elementId] = subsystems;
      return thisData;
    });
  }

  function load(): void {
    const savedValues: SavedSubsystem["inner"] | null =
      loadElement<SavedSubsystem>(componentId, elementId, "subsystem");
    if (!savedValues) {
      // nothing saved or saved values are clearly different from shown
      // TODO better comparison
      return;
    }
    values = savedValues;
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
    values = [newSubsystem(), newSubsystem()];
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

  onMount(() => {
    const element: SavedElement | undefined =
      $formData[componentId].inner[elementId];
    if (element?.identifier === "subsystem") {
      // non-descructive if there's already something in the model
      if (element.inner) {
        // TODO better comparison
        values = element.inner;
      }
      return;
    }
    formData.update((thisData: SavedComponent[]) => {
      const element: SavedSubsystem = {
        identifier: "subsystem",
        inner: values,
      };
      thisData[componentId].inner[elementId] = element;
      return thisData;
    });
  });
</script>

{#each values as subsystem, rowId}
  <div>
    <label for={`${id}_${rowId}_name`}><span>{template.name.inner}</span></label
    >
    <br />
    <Input
      id={`${id}_${rowId}_name`}
      bind:value={subsystem.nameInput.inner}
      on:input={update}
    />
    <br />

    <label for={`${id}_${rowId}_desc`}>
      <span>{template.description.inner}</span>
    </label>
    <br />
    <Input
      id={`${id}_${rowId}_desc`}
      textarea={true}
      bind:value={subsystem.descInput.inner}
      on:input={update}
    />
    <br />
    <button type="button" on:click={() => deleteSubsystem(rowId)}>
      Удалить подсистему
    </button>
  </div>
{/each}
<br />
<button type="button" on:click={addSubsystem}>Добавить подсистему</button>

<Buttons {save} {load} />

<style>
  div {
    border: solid black;
    border-width: 0 0.2em 0 0.2em;
    box-sizing: border-box;
    margin: 0.5em;
    padding: 0.5em;
  }
</style>
