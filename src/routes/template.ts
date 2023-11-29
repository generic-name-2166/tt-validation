interface IInputLayout {
  type: "text" | "textarea" | "number";
}
// Having extra: ["label", "text"] is going to indicate labelOnSameLine

interface SubsystemsLayout {
  type: "subsystems";
  amount: number;
}

interface CheckboxLayout {
  type: "checkbox";
  amount: number;
  labels: string[];
}

interface TableLayout {
  type: "table";
  amount: [number, number];
}

interface DateLayout {
  type: "date";
}

export type InputLayout =
  | CheckboxLayout
  | TableLayout
  | IInputLayout
  | SubsystemsLayout
  | DateLayout;

interface ICell {
  label: string;
  title?: string;
  layout: InputLayout;
  extra?: [string, string];
}

export let cell_list: ICell[] = [
  {
    title: "Организационная структура выполнения работ",
    label: "Заказчик",
    layout: { type: "text" },
    extra: ["label", "text"],
  },
  {
    label: "Функциональный заказчик",
    layout: { type: "text" },
    extra: ["label", "text"],
  },
  {
    label: "Исполнитель",
    layout: { type: "text" },
    extra: ["label", "text"],
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
    layout: { type: "table", amount: [3, 2] },
  },
  {
    title: "Состояние вопроса",
    label: "Техническая документация",
    layout: { type: "textarea" },
  },
  {
    title: "Основные требования к работам",
    label:
      "Работы в рамках данного задания должны выполняться в соответствии со следующими руководящими, нормативными и методическими документами",
    layout: {
      type: "checkbox",
      amount: 8,
      labels: [
        "Порядок удаленного доступа разработчиков к автоматизированным информационно-телекоммуникационным системам ОАО «РЖД», утвержденный Распоряжением №2519/р от 16.11.2020; ",
        "Распоряжение от 26.01.2023 г. N 152/р об утверждении порядка представления доступа к информационным системам ОАО «РЖД»;",
        "Комплекс стандартов СТО РЖД «Автоматизированные системы и программные средства ОАО «РЖД», утверждённый распоряжением №951р от 29.04.2021",
        "СТО РЖД 04.001.0 Автоматизированные системы и программные средства. Общие положения. ",
        "СТО РЖД 04.001.1 Автоматизированные системы и программные средства. Требования к составу, содержанию и оформлению документов при создании автоматизированных систем и программных средств. ",
        "СТО РЖД 04.001.2 Автоматизированные системы и программные средства. Порядок ввода автоматизированных систем и программных средств в действие. ",
        "СТО РЖД 04.001.3 Автоматизированные системы и программные средства. Порядок внесения изменений в автоматизированные системы и программные средства. ",
        "СТО РЖД 04.001.4 Автоматизированные системы и программные средства. Порядок согласования и утверждения документов, разрабатываемых при создании и модификации автоматизированных систем и программных средств.",
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
    layout: { type: "number" },
    extra: ["Работы по настоящему ТЗ выполняются в ", " этап(а/ов)"],
  },
  {
    label: "Начало выполнения работ",
    layout: { type: "date" },
    extra: ["label", "text"],
  },
  {
    label: "Конец выполнения работ",
    layout: { type: "date" },
    extra: ["label", "text"],
  },
  {
    title: "Содержание работ",
    label: "В рамках данного Технического задания выполняются следующие Работы",
    layout: {
      type: "checkbox",
      amount: 4,
      labels: [
        "Работы, выполняемые по требованиям настоящего ТЗ, не относятся к НИОКР, не приводят к созданию новой продукции и технологий (как способов объединения физических, химических, технологических и других процессов с трудовыми процессами в целостную систему, производящую новую продукцию – товары, работы, услуги) или к усовершенствованию производимой продукции и технологий. ",
        "Разработку конструкции инженерного объекта или технической системы. ",
        "Разработку новых технологий (как способов объединения физических, химических, технологических и других процессов с трудовыми процессами в целостную систему, производящую новую продукцию – товары, работы, услуги).",
        "Создание опытных (не имеющих сертификата соответствия) образцов машин, оборудования, материалов, обладающих характерными для нововведений принципиальными особенностями и не предназначенных для реализации третьим лицам, их испытания в течение времени, необходимого для получения данных, накопления опыта и отражения их в технической документации. ",
      ],
    },
  },
  {
    label: "Прогнозный срок полезного использования (в месяцах)",
    layout: {
      type: "number",
    },
    extra: [
      "Срок полезного использования Программы для ЭВМ, разрабатываемой в рамках данного технического задания, определяется комиссией при приемке в постоянную эксплуатацию. Прогнозный срок полезного использования составляет не менее ",
      " месяцев",
    ],
  },
  {
    title: "Разработка ЧТЗ и описания инормационной технологии",
    label: "ЧТЗ должно быть разработа в соответствии со следующими стандартами",
    layout: { type: "checkbox", amount: 1, labels: [""] },
  },
  {
    title: "Разработка программы для ЭВМ",
    label: "Должны быть разработаны следующие подсистемы",
    layout: { type: "subsystems", amount: 2 },
  },
];
