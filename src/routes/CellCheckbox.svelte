<script lang="ts">
  import Buttons from "$lib/CellComponents/Buttons.svelte";
  import {
    formData,
    saveElement,
    loadElement,
    type SavedElement,
    type SavedCheckbox,
  } from "$lib/formStorage.ts";
  import { onMount } from "svelte";

  export let labels: string[];
  export let componentId: number;
  export let elementId: number;

  /* const amount: number = labels.length;
  // amount never mutates
  const checkedList: boolean[] = new Array(amount!).fill(false);
  let dataList: string[] = [""];
  let additional: number = 1; */

  interface Row {
    checked: boolean;
    value: string;
    element?: HTMLInputElement;
  }

  let values: Row[] = labels.map((label) => {
    return { checked: false, value: label };
  });
  //  .concat(new Array([true, ""]));
  // All my homies hate JavaScript
  values = [...values, { checked: true, value: "" }];
  // If localStorage has less than labels.length then do nothing
  // If localStorage has more than labels.length then change only the ones <= labels.length
  // inputRefs for calling .focus() on elements

  /* interface FormDataList extends FormData {
    data: [string][];
  } */

  /* function addField(form_data: FormData[]): FormData[] {
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
  } */

  /* function saveChange(n_id: number): void {
    const checked: boolean = checkedList[n_id];
    const value: string = labels[n_id];

    formData.update((form_data) => {
      (form_data[id] as FormDataList).data[n_id][0] = checked ? value : "";
      return form_data;
    });
  } */

  /* function saveChangeExtra(m_id: number): void {
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
  } */

  /* function isChecked([row_data]: [string]): boolean {
    return row_data.length > 0;
  } */

  /* function loadListFromLocalStorage(): void {
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
  } */

  /* function saveListToLocalStorage(): void {
    console.log($formData[id]);
    saveCellToLocalStorage($formData[id], id);
  } */

  /* formData.update((form_data: FormData[]) => {
    form_data[id].dimensions = [amount, 1];
    form_data[id].data = new Array(amount + additional)
      .fill(null)
      .map(() => new Array(1).fill(""));
    return form_data;
  }); */

  function serialize(rows: Row[]): [boolean, string][] {
    return rows.map((row: Row) => [row.checked, row.value]);
  }

  function deserialize(rows: [boolean, string][]): Row[] {
    return rows.map((row: [boolean, string]) => {
      return { checked: row[0], value: row[1] };
    });
  }

  // Set for performance and convenience
  const focusKeys = new Set(["Enter", "ArrowUp", "ArrowDown"]);

  function changeFocus(event: KeyboardEvent, rowId: number): void {
    const key: string = event.key;
    if (!focusKeys.has(key)) {
      return;
    }

    switch (key) {
      case "Enter":
        values[rowId + 1]?.element?.focus();
        return;
      case "ArrowUp":
        values[rowId - 1]?.element?.focus();
        return;
      case "ArrowDown":
        values[rowId + 1]?.element?.focus();
        return;
    }
  }

  function load(): void {
    const savedValues: [boolean, string][] | null = loadElement<SavedCheckbox>(
      componentId,
      elementId,
      "checkbox",
    );
    if (!savedValues || labels.length >= savedValues.length) {
      // nothing saved or saved values are clearly different from shown
      // TODO better comparison
      return;
    }
    values = deserialize(savedValues);
  }

  function save(): void {
    saveElement($formData[componentId][elementId], componentId, elementId);
  }

  function update(): void {
    const lastRowId: number = values.length - 1;
    if (
      values[lastRowId - 1].value.length === 0 &&
      values[lastRowId].value.length === 0
    ) {
      values = values.slice(0, lastRowId);
    } else if (values[lastRowId].value.length > 0) {
      values = [...values, { checked: true, value: "" }];
    }

    formData.update((thisData: SavedElement[][]) => {
      const element: SavedElement = thisData[componentId][elementId];
      if (element.identifier !== "checkbox") {
        // This should never be realistically reachable
        // because of onMount
        throw new TypeError("onMount failed to update model");
      }
      const checkboxes: SavedCheckbox = {
        ...element,
        inner: serialize(values),
      };
      thisData[componentId][elementId] = checkboxes;
      return thisData;
    });
  }

  onMount(() => {
    const element: SavedElement | undefined = $formData[componentId][elementId];
    if (element?.identifier === "checkbox") {
      // non-descructive if there's already something in the model
      if (!element.inner || labels.length >= element.inner.length) {
        // nothing saved or saved values are clearly different from shown
        // TODO better comparison
        return;
      }
      values = deserialize(element.inner);
      return;
    }

    formData.update((thisData: SavedElement[][]) => {
      const element: SavedCheckbox = {
        identifier: "checkbox",
        inner: serialize(values),
      };
      thisData[componentId][elementId] = element;
      return thisData;
    });
  });
</script>

<!-- {#each checkedList as checkedCell, n_id}
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
</button> -->

{#each values as row, rowId}
  <div>
    {#if rowId < labels.length}
      <input
        type="checkbox"
        id={`${componentId}_${elementId}_${rowId}`}
        bind:checked={row.checked}
        on:change={update}
      />
      <label for={`${componentId}_${elementId}_${rowId}`}>
        <span>{row.value}</span>
      </label>
    {:else}
      <input
        type="text"
        id={`${componentId}_${elementId}_${rowId}`}
        bind:this={row.element}
        on:keydown={(e) => changeFocus(e, rowId)}
        bind:value={row.value}
        on:input={update}
      />
    {/if}
  </div>
{/each}

<Buttons {save} {load} />

<style>
  /* ul {
    margin: 0.5em;
    padding: 0 0.5em 0 0.5em;
  }

  li {
    margin: 0.5em;
  } */

  /* button {
    border-radius: 0;
    margin: 0.5em;
    background-color: #555555;
    color: #eeeeee;
  } */

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