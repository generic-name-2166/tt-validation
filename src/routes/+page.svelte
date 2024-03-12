<script>
  import Form from "./Form.svelte";
  import Footer from "./Footer.svelte";
  import Header from "./Header.svelte";
</script>

<svelte:head>
  <title>Конструктор ТЗ</title>
</svelte:head>

<Header />
<h1>Конструктор ТЗ</h1>

<Form />
<Footer />

<style>
  :global(body) {
    font-family: Helvetica, Arial, sans-serif;
    background-color: #eeeeee;
  }

  :global(button),
  :global(input) {
    font-family: inherit;
  }
</style>
