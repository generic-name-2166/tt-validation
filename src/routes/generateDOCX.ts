import * as docx from "docx";
import type { FormData } from "$lib/formStorage.ts";

interface ISectionPart {
  children: docx.Paragraph[];
  properties?: { type: docx.SectionType };
}

function generateTitle(): ISectionPart {
  return {
    children: [
      new docx.Paragraph({
        heading: docx.HeadingLevel.TITLE,
        alignment: docx.AlignmentType.CENTER,
        children: [
          new docx.TextRun({
            text: "ТЕХНИЧЕСКОЕ ЗАДАНИЕ",
            allCaps: true,
            bold: true,
            font: "Times",
          }),
        ],
      }),
    ],
  };
}

function filterNoData(cellData: FormData): boolean {
  return !!cellData.data;
}

function generateHeading(title: string): docx.Paragraph {
  return new docx.Paragraph({
    heading: docx.HeadingLevel.HEADING_1,
    alignment: docx.AlignmentType.CENTER,
    spacing: { before: 30, after: 18 },
    children: [
      new docx.TextRun({
        text: title,
        bold: true,
        size: "18pt",
        font: "Times",
      }),
    ],
  });
}

function generateSubheading(label: string): docx.Paragraph {
  return new docx.Paragraph({
    heading: docx.HeadingLevel.HEADING_2,
    alignment: docx.AlignmentType.CENTER,
    spacing: { before: 24, after: 18 },
    children: [
      new docx.TextRun({
        text: label,
        bold: true,
        size: "16pt",
        font: "Times",
      }),
    ],
  });
}

function getTableCell(cell: string): docx.TableCell {
  return new docx.TableCell({
    children: [new docx.Paragraph(cell)],
    width: {
      size: 2000,
      type: docx.WidthType.AUTO,
    },
  });
}

function getTableRow(row: string[]): docx.TableRow {
  return new docx.TableRow({
    children: row.map(getTableCell),
  });
}

function getGenericParagraph(text?: string | undefined): docx.Paragraph {
  return new docx.Paragraph({
    indent: { left: 720 },
    spacing: { after: 18, before: 18 },
    text: text,
  });
}

function getGenericParagraphChildren(
  children?: docx.TextRun[],
): docx.Paragraph {
  return new docx.Paragraph({
    indent: { left: 720 },
    spacing: { after: 18, before: 18 },
    children: children,
  });
}

function generateTable(
  table: string[][],
  label: string,
): [docx.Paragraph, docx.Table] {
  return [
    getGenericParagraph(label),
    new docx.Table({
      rows: table.map(getTableRow),
    }),
  ];
}

function getListPoint(point: string): docx.Paragraph {
  return new docx.Paragraph({
    children: [new docx.TextRun(point)],
    spacing: { after: 18, before: 18 },
    bullet: { level: 0 },
  });
}

function generateList(list: string[], label: string): docx.Paragraph[] {
  return [generateSubheading(label), ...list.map(getListPoint)];
}

function generateText(
  text: string,
  label: string,
  labelOnSameLine: boolean = true,
): docx.Paragraph[] {
  return labelOnSameLine
    ? [getGenericParagraph(`${label} - ${text}`)]
    : [generateSubheading(label), getGenericParagraph(text)];
}

function addSection(cellData: FormData): docx.ISectionOptions {
  const children = !Array.isArray(cellData.data)
    ? generateText(cellData.data!, cellData.label)
    : cellData.data.length === 1 || cellData.data[0].length === 1
      ? generateList(cellData.data.flat(2), cellData.label)
      : generateTable(cellData.data, cellData.label);

  if (cellData.title) {
    return {
      properties: { type: docx.SectionType.CONTINUOUS },
      children: [generateHeading(cellData.title), ...children],
    };
  }
  return {
    properties: { type: docx.SectionType.CONTINUOUS },
    children: children,
  };
}

export async function generateDOCX(formData: FormData[]): Promise<string> {
  const sections = [
    generateTitle(),
    ...formData.filter(filterNoData).map(addSection),
  ];

  // It's only readonly once passed to the document but TS doesn't know
  //@ts-expect-error
  sections[1]["properties"]!["type"] = docx.SectionType.NEXT_PAGE;

  const doc: docx.Document = new docx.Document({
    styles: {
      default: {
        document: {
          run: {
            size: "14pt",
            font: "Times",
          },
        },
      },
    },
    sections: sections,
  });

  let docBase64: string = await docx.Packer.toBase64String(doc);
  return (
    "data:/application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64," +
    docBase64
  );
}
