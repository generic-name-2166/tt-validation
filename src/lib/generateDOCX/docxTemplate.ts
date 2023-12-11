import * as docx from "docx";
import type { FormData } from "$lib/formStorage.ts";

const STANDARD_SPACING: number = 180;

export function filterParagraphs(
  paragraph: docx.Paragraph | docx.Table | null | undefined,
): boolean {
  return !!paragraph;
}

export function generateHeading(title: string): docx.Paragraph {
  return new docx.Paragraph({
    heading: docx.HeadingLevel.HEADING_1,
    alignment: docx.AlignmentType.CENTER,
    spacing: { before: 300, after: STANDARD_SPACING },
    children: [
      new docx.TextRun({
        text: title,
        bold: true,
        size: "18pt",
        font: "Times New Roman",
        color: "000000",
      }),
    ],
  });
}

export function generateSubheading(label: string): docx.Paragraph | null {
  if (label.length === 0) {
    return null;
  }
  return new docx.Paragraph({
    heading: docx.HeadingLevel.HEADING_2,
    spacing: { before: 240, after: STANDARD_SPACING },
    indent: { left: "1.25mm" },
    children: [
      new docx.TextRun({
        text: label,
        bold: true,
        size: "16pt",
        font: "Times New Roman",
        color: "000000",
      }),
    ],
  });
}

export function getGenericParagraph(
  text?: string | undefined,
): docx.Paragraph | null {
  if (!text || text.length === 0) {
    return null;
  }
  return new docx.Paragraph({
    alignment: docx.AlignmentType.JUSTIFIED,
    indent: { left: "1.25mm" },
    spacing: { after: STANDARD_SPACING, before: STANDARD_SPACING },
    text: text,
  });
}

export function getGenericParagraphs(text: string): docx.Paragraph[] {
  // Filter takes care of the error
  //@ts-expect-error
  return text.split("\n").map(getGenericParagraph).filter(filterParagraphs);
}

function getRightAlignedParagraph(text: string): docx.Paragraph {
  return new docx.Paragraph({
    spacing: { after: STANDARD_SPACING, before: STANDARD_SPACING },
    alignment: docx.AlignmentType.RIGHT,
    children: [
      new docx.TextRun({
        text: text,
      }),
    ],
  });
}

export function generateTitle(
  titleData: Map<string, string>,
): docx.ISectionOptions {
  return {
    children: [
      getRightAlignedParagraph("Приложение № 1"),
      getRightAlignedParagraph("к Договору № _______________"),
      getRightAlignedParagraph("от __.__.202_"),
      new docx.Paragraph({
        alignment: docx.AlignmentType.RIGHT,
        spacing: { after: STANDARD_SPACING, before: 500 },
        children: [
          new docx.TextRun({
            text: "УТВЕРЖДАЮ",
            allCaps: true,
          }),
        ],
      }),
      // TODO handle missing values
      getRightAlignedParagraph(titleData.get("managerName")!),
      new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        spacing: { after: 300, before: 2000 },
        children: [
          new docx.TextRun({
            text: "ТЕХНИЧЕСКОЕ ЗАДАНИЕ",
            allCaps: true,
            bold: true,
            font: "Times New Roman",
            color: "000000",
          }),
        ],
      }),
      new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        spacing: { after: STANDARD_SPACING, before: STANDARD_SPACING },
        children: [
          new docx.TextRun({
            text: "на выполнение работ по теме:",
            bold: true,
          }),
        ],
      }),
      new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        spacing: { after: STANDARD_SPACING, before: STANDARD_SPACING },
        children: [
          new docx.TextRun({
            text: `"${titleData.get("documentTitle")!}"`,
            bold: true,
          }),
        ],
      }),
    ],
  };
}

export const endingTemplate: FormData[] = [
  {
    title: "9.3. Разработка рабочей документации",
    dimensions: [9, 1],
    label:
      "В рамках данного раздела, в соответствии с требованиями комплекса стандартов СТО РЖД «Автоматизированные системы и программные средства ОАО «РЖД», должна быть разработана, согласована и утверждена следующая рабочая документация:",
    data: [
      [
        "описание информационной технологии;",
        "руководство пользователя;",
        "руководство по организации сопровождения;",
        "описание комплекса программ;",
        "программа и методика испытаний;",
        "руководство по инсталляции;",
        "руководство администратора системы;",
        "руководство администратора баз данных;",
        "проект технических решений подключения (при необходимости).",
      ],
    ],
    extra: [
      "",
      "Порядок согласования и утверждения должен соответствовать СТО 04.001.4-2021.",
    ],
  },
  {
    title:
      "9.4. Проведение испытаний, ввод Программы для ЭВМ в опытную и постоянную эксплуатацию",
    dimensions: [3, 1],
    label:
      "Полигоном внедрения Программы для ЭВМ в рамках настоящего технического задания является ГВЦ (приемка в ГВЦ при участии ФЗ).",
    data: [
      [
        "организована сдача Программы для ЭВМ комиссии ГВЦ при участии ФЗ в опытную эксплуатацию, проведены испытания в соответствии с Программой и методикой испытаний, по результатам проведения испытаний оформлен Протокол испытаний; осуществлён ввод Программы для ЭВМ в опытную эксплуатацию на полигоне внедрения, оформлен акт приемки в опытную эксплуатацию;",
        "проведена опытная эксплуатация Программы для ЭВМ, скорректированы Программа для ЭВМ и комплект документации по результатам опытной эксплуатации (при необходимости), оформлен Отчет о проведении опытной эксплуатации;",
        "организована сдача Программы для ЭВМ комиссии ГВЦ при участии ФЗ в постоянную эксплуатацию, проведены испытания в соответствии с Программой и методикой испытаний, по результатам проведения испытаний оформлен Протокол испытаний; осуществлён ввод Программы для ЭВМ в постоянную эксплуатацию на полигоне внедрения, оформлен акт приемки в постоянную эксплуатацию.",
      ],
    ],
    extra: [
      "В рамках данного раздела должны быть выполнены следующие работы:",
      "",
    ],
  },
  {
    title: "Передача отчётных материалов в ОФАП.",
    label: "",
    dimensions: [14, 1],
    data: [
      [
        "ТЗ/ЧТЗ;",
        "описание информационной технологии;",
        "руководство пользователя;",
        "руководство по организации сопровождения;",
        "описание комплекса программ;",
        "программа и методика испытаний;",
        "руководство по инсталляции;",
        "руководство администратора системы;",
        "руководство администратора баз данных;",
        "проект технических решений подключения (при необходимости);",
        "акт приемки в опытную эксплуатацию с приложением Протокола испытаний;",
        "акт приемки в постоянную эксплуатацию с приложением Протокола испытаний и Отчета о проведении опытной эксплуатации;",
        "настоящее техническое задание;",
        "исходный текст (код) Программы для ЭВМ на электронном носителе (CD-диск и/или DVD-диск и/или FLASH-носитель).",
      ],
    ],
    extra: [
      "После подписания акта приемки Программы для ЭВМ в постоянную эксплуатацию Исполнитель должен передать на хранение в ОФАП следующие отчётные материалы1:",
      "ОФАП является представителем Функционального заказчика с полномочиями приёмки электронных копий отчетных документов и материалов. ",
    ],
  },
  {
    label: "",
    dimensions: [1, 1],
    data: "При сдаче отчётных документов и ПО с исходным текстом (кодом) Программы для ЭВМ на электронном носителе (CD-диск и/или DVD-диск и/или FLASH-носитель) оформляется «Акт сдачи приемки электронных копий отчетных документов» (п. 3.2 Договора) по форме, приведенной в Приложении № __ к Договору. \nПри отсутствии у Исполнителя учетной записи в Системе электронного документооборота ОАО «РЖД» ему необходимо предоставить в ОФАП документы, указанные в настоящем разделе, в электронном виде каждый в двух экземплярах: один экземпляр в формате doc/docx, второй экземпляр в формате pdf, представляющий собой электронную копию полностью отсканированного документа, подписанного уполномоченными представителями Исполнителя. \nСотрудник ОФАП в течение 3 рабочих дней с момента получения документов проверяет полноту комплекта предоставленной документации в электронном виде, при отсутствии замечаний подписывает «Акт сдачи-приемки электронных копий отчетных документов» и передает его Исполнителю.",
  },
  {
    label: "",
    dimensions: [2, 1],
    data: [
      [
        "по электронной почте: ofk@pktbcdt.ru;",
        "по телефону: 8-499-260-88-43.",
      ],
    ],
    extra: [
      "Получить консультацию и задать вопросы, связанные с передачей материалов в ОФАП, можно следующим образом:",
      "",
    ],
  },
  {
    title: "10. Форма представления результатов",
    label: "",
    dimensions: [1, 1],
    data: "Результатом работ является разработанная и введенная в постоянную эксплуатацию Программа для ЭВМ. \nЗаказчику передаются документы, подтверждающие предоставление в ЦИР надлежащим образом оформленных материалов заявки с Уведомлениями для подачи Программы для ЭВМ на государственную регистрацию с отметкой ЦИР о получении. ",
  },
  {
    label: "",
    dimensions: [3, 1],
    data: [
      [
        "акт сдачи-приемки электронных копий отчётных документов;",
        "акт приемки в опытную эксплуатацию с приложениями",
        "акт приемки в постоянную эксплуатацию с приложениями. ",
      ],
    ],
    extra: [
      "По окончании выполнения работ Заказчику должны быть переданы следующие документы:",
      "",
    ],
  },
];
