<script lang='ts'>
  // To be bound to parent
  export let value: string;
</script>

<span
  contenteditable="true"
  bind:textContent={value}
  on:change
></span>

<style>
  span {
    block-size: 2em;
    inline-size: 50%; 
    margin: 0.5em;
    border-width: 0;
    box-shadow: 0 0 1em 0.5em rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 600px) {
    span {
      box-sizing: border-box;
      inline-size: calc(100% - 1em);
    }
  }
</style>