<script lang="ts">
  import type { FormData } from "$lib/formStorage";
  import {
    saveCellToLocalStorage,
    readFromLocalStorage,
  } from "$lib/formStorage";
  import { formData } from "$lib/formStorage";

  export let id: number;
  let date: string;

  function formatDate(dateObject: Date): string {
    // Returns date in format DD.MM.YYYY
    const day: string = `${dateObject.getDay()}`.padStart(2, "0");
    const month: string = `${dateObject.getMonth()}`.padStart(2, "0");
    return `${day}.${month}.${dateObject.getFullYear()}`;
  }

  function formatDateValue(dateObject: Date): string {
    // Returns date in format YYYY-MM-DD
    const day: string = `${dateObject.getDay()}`.padStart(2, "0");
    const month: string = `${dateObject.getMonth()}`.padStart(2, "0");
    return `${dateObject.getFullYear()}-${month}-${day}`;
  }

  function saveChange(): void {
    const formattedDate: string = formatDate(new Date(date));

    formData.update((form_data) => {
      form_data[id].data = formattedDate;
      return form_data;
    });
  }

  function saveDateToLocalStorage(): void {
    saveCellToLocalStorage($formData[id], id);
  }

  function loadDateFromLocalStorage(): void {
    const formDataFromStorage: FormData[] | null = readFromLocalStorage();
    if (
      !formDataFromStorage ||
      !formDataFromStorage[id]?.data ||
      Array.isArray(formDataFromStorage[id].data)
    ) {
      console.error("Nothing to load from localStorage");
      return;
    }

    const dateOption: Date = new Date(formDataFromStorage[id].data as string);
    if (dateOption.toString() === "Invalid date") {
      console.error("Nothing to load from localStorage");
      return;
    }

    const formattedDate: string = formatDateValue(dateOption);
    date = formattedDate;
    formData.update((form_data) => {
      form_data[id].data = formattedDate;
      return form_data;
    });
  }
</script>

<input id={String(id)} type="date" bind:value={date} on:change={saveChange} />

<br />

<button type="button" on:click={saveDateToLocalStorage}>
  Сохранить ячейку
</button>
<button type="button" on:click={loadDateFromLocalStorage}>
  Загрузить ячейку
</button>
