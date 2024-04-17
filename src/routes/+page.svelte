<script>
  import Form from "./Form.svelte";
  import Header from "./Header.svelte";
</script>

<svelte:head>
  <title>Конструктор ТЗ</title>
</svelte:head>

<Header />
<h1>Конструктор ТЗ</h1>

<Form />

<style>
  :global(body) {
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    background-color: #eeeeee;
    overflow-y: scroll;
    color: #2e3033;
  }

  :global(button),
  :global(input) {
    font-family: inherit;
  }

  h1 {
    text-indent: 15%;
  }
</style>
