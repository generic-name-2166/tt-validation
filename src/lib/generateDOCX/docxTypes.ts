import * as docx from "docx";

const STANDARD_SPACING: number = 180;

export interface MappedValue {
  before: TextValue;
  key: string;
  after: TextValue;
}

export function mapValue(key: MappedValue, dict: Map<string, string>): string {
  const value: string | undefined = dict.get(key.key);
  const before: string = isMapped(key.before)
    ? mapValue(key.before, dict)
    : key.before;
  const after: string = isMapped(key.after)
    ? mapValue(key.after, dict)
    : key.after;
  if (!value) {
    // Can define default value here
    return before + after;
  }
  return before + value + after;
}

export type TextValue = string | MappedValue;

export function isMapped(value: TextValue): value is MappedValue {
  return (value as MappedValue).key !== undefined;
}

export interface SerializedTitle {
  identifier: "title";
  inner: string;
}

export interface SerializedLabel {
  identifier: "label";
  inner: string;
}

export interface SerializedText {
  identifier: "text";
  inner: TextValue;
}

export interface SerializedDefinition {
  identifier: "definition";
  word: string;
  definition: string;
}

export interface SerializedCheckbox {
  identifier: "checkbox";
  checked: string[];
}

export interface SerializedTable {
  identifier: "table";
  inner: string[][];
}

export type SerializedElement =
  | SerializedTitle
  | SerializedLabel
  | SerializedText
  | SerializedDefinition
  | SerializedCheckbox
  | SerializedTable;

function getHeading(title: string): docx.Paragraph {
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

function getSubheading(label: string): docx.Paragraph {
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

function getParagraph(text: string): docx.Paragraph {
  return new docx.Paragraph({
    alignment: docx.AlignmentType.JUSTIFIED,
    indent: { left: "1.25mm" },
    spacing: { after: STANDARD_SPACING, before: STANDARD_SPACING },
    text: text,
  });
}

function getListPoint(point: string): docx.Paragraph {
  return new docx.Paragraph({
    // Every TextRun here needs to end with a dot
    children: [new docx.TextRun(point)],
    spacing: { after: 18, before: 18 },
    bullet: { level: 0 },
  });
}

function getTableCell(cell: string, width: number): docx.TableCell {
  return new docx.TableCell({
    children: [new docx.Paragraph(cell)],
    width: {
      size: width,
      type: docx.WidthType.AUTO,
    },
  });
}

function getTableRow(row: string[]): docx.TableRow {
  return new docx.TableRow({
    // Only supports 2 columns now
    children: [getTableCell(row[0], 2505), getTableCell(row[1], 6505)],
  });
}

function getTable(table: string[][]): docx.Table {
  return new docx.Table({
    columnWidths: [2505, 6505],
    rows: table.map(getTableRow),
  });
}

function docxElement(
  element: SerializedElement,
  dict: Map<string, string>,
): docx.ISectionOptions["children"][0] | docx.ISectionOptions["children"] {
  switch (element.identifier) {
    case "title":
      return getHeading(element.inner);
    case "label":
      return getSubheading(element.inner);
    case "text":
      const text: string = isMapped(element.inner)
        ? mapValue(element.inner, dict)
        : element.inner;
      return getParagraph(text);
    case "definition":
      // TODO maybe something more complex
      return getParagraph(`${element.word} - ${element.definition}`);
    case "checkbox":
      return element.checked.map(getListPoint);
    case "table":
      return getTable(element.inner);
  }
}

export function docxComponent(
  elements: SerializedElement[],
  dict: Map<string, string>,
): docx.ISectionOptions {
  const children = elements.flatMap((elem) => docxElement(elem, dict));
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
}
