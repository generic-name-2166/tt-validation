export interface InputLayout {
  type: "text" | "textarea" | "file" | "checkbox" | "table" | "date" | "subsystems";
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
    title: "Организационная структура выполнения работ",
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
    layout: { type: "table", amount: [10, 2] }
  },
  {
    title: "Состояние вопроса",
    label: "Техническая документация",
    layout: { type: "textarea" }
  },
  {
    title: "Основные требования к работам",
    label: "В соответсвии со следующими документациями",
    layout: { type: "checkbox" }
  },
  {
    title: "Назначение программы для ЭВМ",
    label: "Предназначение",
    layout: { type: "textarea" }
  },
  {
    title: "Сроки и этапы выполнения работ",
    label: "Количество этапов",
    layout: { type: "text" }
  },
  {
    label: "Начало выполнения работ",
    layout: { type: "date" }
  },
  {
    label: "Конец выполнения работ",
    layout: { type: "date" }
  },
  {
    title: "Содержание работ",
    label: "Работы по требованиям ТЗ выполняют",
    layout: { type: "checkbox", amount: 11 }
  },
  {
    label: "Прогнозный срок полезного использования",
    layout: { type: "text" }
  },
  {
    title: "Разработка ЧТЗ и описания инормационной технологии",
    label: "ЧТЗ должно быть разработа в соответствии со следующими стандартами",
    layout: { type: "checkbox", amount: 1 }
  },
  {
    title: "Разработка программы для ЭВМ",
    label: "Должны быть разработаны следующие подсистемы",
    layout: { type: "subsystems", amount: [4, 1] }
  },
];
