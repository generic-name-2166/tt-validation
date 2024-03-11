import * as docx from "docx";
import type { SavedElement } from "$lib/formStorage.ts";
import {
  docxComponent,
  serialize,
  type SerializedElement,
  STANDARD_SPACING,
} from "./docxTypes";

/* function addSection(cellData: FormData): docx.ISectionOptions {
  const children = !Array.isArray(cellData.data)
    ? generateText(cellData.data!, cellData.label, cellData.extra)
    : cellData.data.length === 1 || cellData.data[0].length === 1
      ? generateList(cellData.data.flat(2), cellData.label, cellData.extra)
      : generateTable(cellData.data, cellData.label);

  if (cellData.title) {
    return {
      properties: { type: docx.SectionType.CONTINUOUS },
      children: [generateHeading(cellData.title), ...children],
    };
  }

  return {
    properties: {
      type: docx.SectionType.CONTINUOUS,
      page: {
        margin: { top: "25mm", left: "20mm", right: "10mm", bottom: "15mm" },
        pageNumbers: { start: 2 },
      },
    },
    children: children,
  };
  // I have no idea how am I supposed to do headers and page numbers at the top
} */

/* function filterNoData(cellData: FormData): boolean {
  return !!cellData.data;
} */

/* export async function generateDOCX(
  formData: FormData[],
  titleData: Map<string, string>,
): Promise<string> {
  const sections: docx.ISectionOptions[] = [
    // TODO this
    generateTitle(titleData),
    ...formData.filter(filterNoData).map(addSection),
    ...endingTemplate.map(addSection),
    templateTable(),
  ];

  // It becomes readonly once passed to the document but TS doesn't know
  //@ts-expect-error
  sections[1]["properties"]!["type"] = docx.SectionType.NEXT_PAGE;

  const doc: docx.Document = new docx.Document({
    styles: {
      default: {
        document: {
          run: {
            size: "14pt",
            font: "Times New Roman",
          },
        },
      },
    },
    sections: sections,
  });

  const docBase64: string = await docx.Packer.toBase64String(doc);
  return (
    "data:/application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64," +
    docBase64
  );
} */

function getRightAlignedParagraph(text: string): docx.Paragraph {
  return new docx.Paragraph({
    spacing: { after: STANDARD_SPACING, before: STANDARD_SPACING },
    alignment: docx.AlignmentType.RIGHT,
    children: [
      new docx.TextRun({
        text,
      }),
    ],
  });
}

function getTitlePage(valueMap: Map<string, string>): docx.ISectionOptions {
  const managerName: string | undefined = valueMap.get("managerName");
  const documentTitle: string | undefined = valueMap.get("documentTitle");
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
      new docx.Paragraph({
        spacing: { after: STANDARD_SPACING, before: STANDARD_SPACING },
        alignment: docx.AlignmentType.RIGHT,
        children: [
          new docx.TextRun({
            text: managerName,
          }),
        ],
      }),
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
            text: documentTitle,
            bold: true,
          }),
        ],
      }),
      new docx.Paragraph({
        children: [new docx.PageBreak()],
      }),
    ],
  };
}

export async function generateDoc(
  formData: SavedElement[][],
  valueMap: Map<string, string>,
): Promise<string> {
  // TODO
  const components: SerializedElement[][] = formData.map(
    (component: SavedElement[]): SerializedElement[] =>
      component.flatMap(serialize),
  );
  const title: docx.ISectionOptions = getTitlePage(valueMap);
  const sections: docx.ISectionOptions[] = [title].concat(
    components.map((elements) => docxComponent(elements, valueMap)),
  );

  const doc: docx.Document = new docx.Document({
    styles: {
      default: {
        document: {
          run: {
            size: "14pt",
            font: "Times New Roman",
          },
        },
      },
    },
    sections,
  });

  const docBase64: string = await docx.Packer.toBase64String(doc);
  return (
    "data:/application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64," +
    docBase64
  );
}
