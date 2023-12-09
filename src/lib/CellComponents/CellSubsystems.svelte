<script lang="ts">
  export let amount: number = 1;
  export let id: string;
  let dataColumn: string[] = new Array(amount).fill("");

  function saveChange(e: Event, col_id: number): void {
    e.preventDefault();
    const value: string = dataColumn[col_id];

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
    bind:value={dataCell}
    on:change={(e) => {
      saveChange(e, col_id);
    }}
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

<br />

<button type="button"> Сохранить ячейку </button>
<button type="button"> Загрузить ячейку </button>

<style>
  button {
    border-radius: 0;
    margin: 0.5em;
    background-color: #555555;
    color: #eeeeee;
  }

  input {
    block-size: 2em;
    inline-size: 50%;
    margin: 0.5em;
    border-width: 0;
    box-shadow: 0 0 1em 0.5em rgba(0, 0, 0, 0.2);
  }

  textarea {
    block-size: 5em;
    inline-size: 50%;
    margin: 0.5em;
    border-width: 0;
    box-shadow: 0 0 1em 0.5em rgba(0, 0, 0, 0.2);
  }
</style>
