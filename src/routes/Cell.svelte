<script lang="ts">
  import type { Component } from "./template.ts";
  import CellText from "./CellText.svelte";
  import Label from "$lib/CellComponents/Label.svelte";
  import Title from "$lib/CellComponents/Title.svelte";
  import CellCheckbox from "./CellCheckbox.svelte";
  import CellTable from "./CellTable.svelte";
  import CellSubsystems from "./CellSubsystems.svelte";
  import Implicit from "./CellImplicit.svelte";
  import Intro from "$lib/CellComponents/Intro.svelte";

  export let componentId: number;
  export let component: Component;
  export let hidden: boolean;
  let checked: boolean | undefined = component.implicit;
</script>

<!-- Using hidden rather than if for the side effects -->
<div {hidden}>
  {#each component.inner as element, elementId}
    {#if element.identifier === "title"}
      <Title
        inner={element.inner}
        {componentId}
        {elementId}
        hidden={element.hidden}
        notRender={element.notRender}
      />
    {:else if element.identifier === "label"}
      <Label
        inner={element.inner}
        {componentId}
        {elementId}
        notRender={element.notRender}
      />
    {:else if element.identifier === "text"}
      <CellText
        {componentId}
        {elementId}
        type={element.type}
        mappedTo={element.mappedTo}
        implicit={element.implicit}
        defined={null}
      />
    {:else if element.identifier === "definition"}
      <CellText
        {componentId}
        {elementId}
        type="definition"
        mappedTo={element.mappedTo}
        implicit={null}
        defined={element.word}
      />
    {:else if element.identifier === "checkbox"}
      <CellCheckbox labels={element.inner} {componentId} {elementId} />
    {:else if element.identifier === "table"}
      <CellTable {componentId} {elementId} />
    {:else if element.identifier === "subsystem"}
      <CellSubsystems {componentId} {elementId} template={element.inner} />
    {:else if element.identifier === "intro"}
      <Intro inner={element.inner} />
    {:else if checked}
      <!-- Leaving label rendered even if unchecked -->
      <Implicit {componentId} {elementId} inner={element.inner} />
    {/if}
    {#if elementId + 1 < component.inner.length && checked === undefined}
      <br />
    {/if}
  {/each}

  {#if checked !== undefined}
    <input id="{componentId}_implicit" type="checkbox" bind:checked />
    <label for="{componentId}_implicit">
      Подтвердить - раздел {componentId} будет включён в документ
    </label>
  {/if}
</div>

<style>
  div {
    margin: 1em;
  }
</style>
