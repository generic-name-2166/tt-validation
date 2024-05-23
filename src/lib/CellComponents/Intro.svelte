<script lang="ts">
  export let inner: string;
</script>

<pre>{inner}</pre>

<style>
  pre {
    white-space: pre-line;
    text-wrap: wrap;
    font-family: inherit;
    line-height: 1.5em;
    text-align: center;
    font-size: 1.4em;
  }

  @media (max-width: 600px) {
    pre {
      font-size: 1.2em;
    }
  }
</style>
