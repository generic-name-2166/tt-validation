<script lang="ts">
  export let toTheLeft: boolean;
  export let disabled: boolean;
</script>

<button {disabled} class="navigation" on:click>
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

  button:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }

  button:disabled:hover {
    background-color: transparent;
  }

  polygon {
    fill: rgba(0, 0, 0, 0.2);
  }

  button:hover polygon {
    fill: #eeeeee;
  }

  button:disabled polygon {
    fill: rgba(0, 0, 0, 0.05);
  }
</style>
