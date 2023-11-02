export interface InputLayout {
  type: "text" | "textarea" | "file" | "checkbox" | "table";
  amount?: number | [number, number];
}

interface ICell {
  label: string;
  title?: string;
  layout: InputLayout;
}

export let cell_list: ICell[] = [
  {
    label: "Заказчик",
    layout: { type: "text" },
    title: "Организационная структура выполнения Работ",
  },
  {
    label: "Функциональный заказчик",
    layout: { type: "text" },
  },
  {
    label: "Isp",
    layout: { type: "text" },
  },
  {
    title: "Osnov",
    label: "Conception for development",
    layout: { type: "text" },
  },
  {
    title: "Point",
    label: "Point",
    layout: { type: "textarea" },
  },
  {
    title: "Test",
    label: "Enter title: ",
    layout: { type: "text" },
  },
  {
    label: "Enter technical task: ",
    layout: { type: "textarea" },
  },
  {
    label: "Upload a file: ",
    layout: { type: "file" },
  },
  {
    label: "Table",
    layout: { type: "table", amount: [3, 2] },
  },
  {
    label: "Checkbox",
    layout: { type: "checkbox", amount: 5 },
  },
];
