<script lang="ts">
	import { createEventDispatcher } from "svelte";
  import { mutateTextContent } from "./input.ts";
  // To be bound to parent
  export let id: string;
  export let value: string;
  export let textarea: boolean = false;
  export let prediction: string = "";

  const dispatch = createEventDispatcher();
  let self: HTMLSpanElement;

  function replaceSpaces(): void {
    const mutate: () => void = () => value = value.replaceAll("\u0020", "\u00A0");
    mutateTextContent(self, mutate, 0);
  }

  function forward(): void {
    if (value.length > 0 && self?.childNodes && value.includes("\u0020")) {
      replaceSpaces();
    }
    dispatch("input");
  }

  function autocomplete(event: KeyboardEvent): void {
    if (prediction.length === 0 || event.key !== "Tab") {
      return;
    }
    event.preventDefault();
    const mutate: () => void = () => value = value + prediction;
    mutateTextContent(self, mutate, prediction.length);
    forward();
  }
</script>

<p>
  <span
    {id}
    role="textbox"
    tabindex="0"
    class:textarea
    contenteditable="true"
    data-prediction={prediction}
    bind:this={self}
    on:keydown={autocomplete}
    bind:textContent={value}
    on:input={forward}
  ></span>
</p>

<style>
  p {
    box-sizing: border-box;
    display: inline-flex;
    margin: 0.5em;
    padding: 0.5em;
    block-size: min-content;
    inline-size: 50%;
    background-color: #ffffff;
    border-width: 0;
    box-shadow: 0 0 1em 0.5em rgba(0, 0, 0, 0.2);
    align-items: center;
  }

  .textarea {
    min-block-size: 4em;
  }

  span {
    box-sizing: border-box;
    outline-offset: 0.5em;
    inline-size: 100%;
  }

  @media (max-width: 600px) {
    p {
      inline-size: calc(100% - 1em);
    }
  }

  span::after {
    content: ""; /* fallback */
    /* var() doesn't work, using attr() as a crutch */
    content: attr(data-prediction);
    color: #999999;
  }
</style>
