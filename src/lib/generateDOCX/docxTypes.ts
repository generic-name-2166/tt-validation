import type { SavedElement, SavedSubsystem } from "$lib/formStorage";
import * as docx from "docx";

export const STANDARD_SPACING: number = 180;

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
  readonly identifier: "title";
  readonly inner: string;
}

export interface SerializedLabel {
  readonly identifier: "label";
  readonly inner: string;
}

export interface SerializedText {
  readonly identifier: "text";
  readonly inner: TextValue;
}

export interface SerializedDefinition {
  readonly identifier: "definition";
  readonly word: string;
  readonly definition: string;
}

export interface SerializedCheckbox {
  readonly identifier: "checkbox";
  readonly checked: string[];
}

export interface SerializedTable {
  readonly identifier: "table";
  readonly inner: string[][];
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
    text,
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
      // TODO transform the dates from YYYY-MM-DD to DD.MM.YYYY
      // here or in `serialize`
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
  } satisfies docx.ISectionOptions;
}

export function serialize(
  element: SavedElement,
): SerializedElement | SerializedElement[] {
  switch (element.identifier) {
    case "title":
      return element satisfies SerializedTitle;
    case "label":
      return element satisfies SerializedLabel;
    case "text":
      if (element.implicit === "mappedOnly") {
        return [];
      } // This means the elements is only for valueMap and shouldn't be rendered
      // TODO transform the dates from YYYY-MM-DD to DD.MM.YYYY
      // here or in `docxElement`
      return {
        identifier: element.identifier,
        inner: element.implicit ? element.implicit : element.inner,
      } satisfies SerializedText;
    case "implicitText":
      return {
        identifier: "text",
        inner: element.inner,
      } satisfies SerializedText;
    case "definition":
      return {
        identifier: element.identifier,
        word: element.word,
        definition: element.inner,
      } satisfies SerializedDefinition;
    case "checkbox":
      return {
        identifier: element.identifier,
        checked: element.inner
          .filter(([check, value]) => check && value.length > 0)
          .map(([_check, value]) => value),
      } satisfies SerializedCheckbox;
    case "table":
      return element satisfies SerializedTable;
    case "subsystem":
      const subsystems: (SerializedLabel | SerializedText)[] =
        element.inner.flatMap(
          (
            subsystem: SavedSubsystem["inner"][0],
          ):
            | [SerializedLabel, SerializedText, SerializedLabel, SerializedText]
            | [] => {
            const name = subsystem.name satisfies SerializedLabel;
            const nameInput = subsystem.nameInput satisfies SerializedText;
            if (nameInput.inner.length === 0) {
              return [];
            }
            const description = subsystem.description satisfies SerializedLabel;
            const descInput = subsystem.descInput satisfies SerializedText;
            return [name, nameInput, description, descInput];
          },
        );
      return subsystems;
  }
}
