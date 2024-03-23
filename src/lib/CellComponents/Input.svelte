<script lang="ts">
  // To be bound to parent
  export let id: string;
  export let value: string;
  export let textarea: boolean = false;
  export let prediction: string = "";
</script>

<p>
  <span
    {id}
    role="textbox"
    tabindex="0"
    class:textarea
    contenteditable="true"
    data-prediction={prediction}
    bind:textContent={value}
    on:input
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
    overflow-x: hidden;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ | Nonstandard */
  }

  span::-webkit-scrollbar {
    width: 0; /* WebKit */
    height: 0; /* This is for the overflow scrollbar */
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
