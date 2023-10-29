export interface InputLayout {
  type: 'text' | 'textarea' | 'file' | 'checkbox' | 'table';
  amount?: number | [number, number];
}

export let cell_list = [
  {
    label: "Title",
    type: "text",
  },
  {
    label: "",
  },
];
