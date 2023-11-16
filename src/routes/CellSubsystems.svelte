<script lang="ts">
  export let amount: number = 1;
  export let id: string;
  let dataColumn: string[] = new Array(amount).fill("");

  function saveChange(e: Event, col_id: number): void {
    e.preventDefault();
    // I have to get value from target rather than dataColumn because
    // dataColumn doesn't update before the event
    const target = e.currentTarget as HTMLInputElement;
    const value: string = target.value;

    // This is the only place where dimensions has to be synced with dataColumn
    if (col_id + 2 === amount && value === "") {
      amount -= 1;
      dataColumn = dataColumn.slice(0, amount);
    } else if (col_id + 1 === amount && value !== "") {
      amount += 1;
      dataColumn = [...dataColumn, ""];
    }
  }
</script>

{#each dataColumn as dataCell, col_id}
  <input
    type="text"
    id={`${id}_${col_id}`}
    on:change={(e) => {
      saveChange(e, col_id);
    }}
    value={dataCell}
  />
  <br />
{/each}

<br />

{#each [...Array(amount).keys()] as s_id}
  <label for={String(s_id)} hidden>
    В подсистеме должны быть реализованы следующие функции
  </label>

  <br />
  <label for={`${s_id}_name`}>Название функции</label>
  <br />
  <input id={`${s_id}_name`} type="text" />
  <br />
  <label for={`${s_id}_desc`}>Описание функции</label>
  <br />
  <textarea id={`${s_id}_desc`}></textarea>
{/each}
