interface IInputLayout {
  type: "text" | "textarea" | "file" | "date";
}

export interface SubsystemsLayout {
  type: "subsystems";
  amount: [number, number];
}

export interface CheckboxLayout {
  type: "checkbox";
  amount: number;
  labels: string[];
}

export interface TableLayout {
  type: "table";
  amount: [number, number];
}

export type InputLayout =
  | CheckboxLayout
  | TableLayout
  | IInputLayout
  | SubsystemsLayout;

interface ICell {
  label: string;
  title?: string;
  layout: InputLayout;
}

export let cell_list: ICell[] = [
  {
    title: "Организационная структура выполнения работ",
    label: "Заказчик",
    layout: { type: "text" },
  },
  {
    label: "Функциональный заказчик",
    layout: { type: "text" },
  },
  {
    label: "Исполнитель",
    layout: { type: "text" },
  },
  {
    title: "Основание для проведения работ",
    label: "Концепция на разработку",
    layout: { type: "text" },
  },
  {
    title: "Цель выполнения работ",
    label: "Цель работы",
    layout: { type: "textarea" },
  },
  {
    label: "Обозначения и сокращения",
    layout: { type: "table", amount: [10, 2] },
  },
  {
    title: "Состояние вопроса",
    label: "Техническая документация",
    layout: { type: "textarea" },
  },
  {
    title: "Основные требования к работам",
    label: "В соответсвии со следующими документациями",
    layout: {
      type: "checkbox",
      amount: 9,
      labels: [
        'Порядок удалённого доступа разработчиков к автоматизированным информационно-телекоммуникационнымм системам ОАО "РЖД", утверждённый Распоряжением №2519/р от 16.11.2020',
      ],
    },
  },
  {
    title: "Назначение программы для ЭВМ",
    label: "Предназначение",
    layout: { type: "textarea" },
  },
  {
    title: "Сроки и этапы выполнения работ",
    label: "Количество этапов",
    layout: { type: "text" },
  },
  {
    label: "Начало выполнения работ",
    layout: { type: "date" },
  },
  {
    label: "Конец выполнения работ",
    layout: { type: "date" },
  },
  {
    title: "Содержание работ",
    label: "Работы по требованиям ТЗ выполняют",
    layout: { type: "checkbox", amount: 11, labels: ["", ""] },
  },
  {
    label: "Прогнозный срок полезного использования",
    layout: { type: "text" },
  },
  {
    title: "Разработка ЧТЗ и описания инормационной технологии",
    label: "ЧТЗ должно быть разработа в соответствии со следующими стандартами",
    layout: { type: "checkbox", amount: 1, labels: [""] },
  },
  {
    title: "Разработка программы для ЭВМ",
    label: "Должны быть разработаны следующие подсистемы",
    layout: { type: "subsystems", amount: [4, 1] },
  },
];
