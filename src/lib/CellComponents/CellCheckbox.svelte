<script lang="ts">
  import type { FormData } from "$lib/formStorage.ts";
  import {
    formData,
    saveCellToLocalStorage,
    readFromLocalStorage,
  } from "$lib/formStorage.ts";

  export let amount: number;
  export let labels: string[];
  export let id: number;
  let additional: number = 1;
  let checkedList: boolean[] = new Array(amount!).fill(false);
  let dataList: string[] = [""];

  interface FormDataList extends FormData {
    data: [string][];
  }

  function addField(form_data: FormData[]): FormData[] {
    form_data[id].dimensions[0] = amount + additional;
    form_data[id].data = [...(form_data[id] as FormDataList).data, [""]];
    return form_data;
  }

  function removeField(form_data: FormData[]): FormData[] {
    const new_data: FormData[] = form_data;
    new_data[id].dimensions[0] = amount + additional;
    new_data[id].data = (form_data[id] as FormDataList).data.slice(
      0,
      amount + additional,
    );
    return new_data;
  }

  function saveChange(n_id: number): void {
    const checked: boolean = checkedList[n_id];
    const value: string = labels[n_id];

    formData.update((form_data) => {
      (form_data[id] as FormDataList).data[n_id][0] = checked ? value : "";
      return form_data;
    });
  }

  function saveChangeExtra(m_id: number): void {
    const value: string = dataList[m_id];

    // Length check instead of string comparison because of some weird <empty string> value it can have
    if (m_id + 2 === additional && value.length === 0) {
      additional -= 1;
      dataList = dataList.slice(0, additional);
      formData.update(removeField);
    } else if (m_id + 1 === additional && value.length > 0) {
      additional += 1;
      dataList = [...dataList, ""];
      formData.update(addField);
    }

    formData.update((form_data) => {
      (form_data[id] as FormDataList).data![amount + m_id][0] = value;
      return form_data;
    });
  }

  function isChecked([row_data]: [string]): boolean {
    return row_data.length > 0;
  }

  function loadListFromLocalStorage(): void {
    const formDataFromStorage: FormData[] | null = readFromLocalStorage();
    if (
      !formDataFromStorage ||
      !formDataFromStorage[id]?.data ||
      !Array.isArray(formDataFromStorage[id].data) ||
      formDataFromStorage[id].data![0].length !== 1
    ) {
      console.error("Nothing to load from localStorage");
      return;
    }

    formData.update((form_data: FormData[]) => {
      form_data[id] = formDataFromStorage[id];
      return form_data;
    });

    const allData: [string][] = (formDataFromStorage[id] as FormDataList).data;
    // BUG: This amount is technically a bug
    // because checked list can be different length
    checkedList = allData.slice(0, amount).map(isChecked);
    additional = formDataFromStorage[id].dimensions[0] - checkedList.length;
    dataList = allData.slice(amount).map(([row_data]: [string]) => row_data);
  }

  function saveListToLocalStorage(): void {
    console.log($formData[id]);
    saveCellToLocalStorage($formData[id], id);
  }

  formData.update((form_data: FormData[]) => {
    form_data[id].dimensions = [amount, 1];
    form_data[id].data = new Array(amount + additional)
      .fill(null)
      .map(() => new Array(1).fill(""));
    return form_data;
  });
</script>

<!-- id for accessibility question mark -->
<input id={String(id)} type="hidden" />

{#each checkedList as checkedCell, n_id}
  <div>
    <input
      type="checkbox"
      id={`${id}_${n_id}`}
      bind:checked={checkedCell}
      on:change={(e) => {
        saveChange(n_id);
      }}
    />
    <label for={`${id}_${n_id}`}>
      <span>{labels[n_id]}</span>
    </label>
  </div>
{/each}

<ul>
  {#each dataList as dataCell, m_id}
    <li>
      <input
        type="text"
        id={`${id}_${amount + m_id}`}
        bind:value={dataCell}
        on:change={(e) => {
          saveChangeExtra(m_id);
        }}
      />
    </li>
  {/each}
</ul>

<button type="button" on:click={saveListToLocalStorage}>
  Сохранить ячейку
</button>
<button type="button" on:click={loadListFromLocalStorage}>
  Загрузить ячейку
</button>

<style>
  ul {
    margin: 0.5em;
    padding: 0 0.5em 0 0.5em;
  }

  li {
    margin: 0.5em;
  }

  button {
    border-radius: 0;
    margin: 0.5em;
    background-color: #555555;
    color: #eeeeee;
  }

  div {
    margin: 0.5em;
  }

  input[type="text"] {
    block-size: 2em;
    inline-size: 50%;
    margin: 0.5em;
    border-width: 0;
    box-shadow: 0 0 1em 0.5em rgba(0, 0, 0, 0.2);
  }
</style>
