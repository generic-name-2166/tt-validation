<script lang="ts">
  export let toTheLeft: boolean;
  export let disabled: boolean;
</script>

<button {disabled} class="navigation {toTheLeft ? 'left' : 'right'}" on:click>
  <svg
    height="50px"
    width="50px"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
  >
    <polygon points={toTheLeft ? "50 0, 50 50, 0 25" : "0 0, 50 25, 0 50"} />
  </svg>
</button>

<style>
  button {
    background-color: transparent;
    border: transparent;
    inline-size: 100%;
    block-size: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .left {
    border-radius: 4em 0 0 4em;
  }

  .right {
    border-radius: 0 4em 4em 0;
  }

  button:hover {
    background-color: rgba(46, 48, 51, 0.2);
  }

  button:disabled:hover {
    background-color: transparent;
  }

  polygon {
    fill: rgba(213, 38, 39, 0.5);
  }

  button:hover polygon {
    fill: rgba(213, 38, 39, 1);
  }

  button:disabled polygon {
    fill: rgba(213, 38, 39, 0.2);
  }
</style>
