import * as docx from "docx";
import { getGenericParagraph, filterParagraphs } from "./docxTemplate";

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
    children: [getTableCell(row[0], 2505), getTableCell(row[1], 6505)],
    // row.map(getTableCell),
  });
}

export function generateTable(
  table: string[][],
  label: string,
): [docx.Paragraph, docx.Table] {
  // Filter takes care of the error
  //@ts-expect-error
  return [
    getGenericParagraph(label),
    new docx.Table({
      columnWidths: [2505, 6505],
      rows: table.map(getTableRow),
    }),
  ].filter(filterParagraphs);
}

function getTemplateTable(): docx.Table {
  return new docx.Table({
    columnWidths: [4505, 4505],
    rows: [
      new docx.TableRow({
        children: [
          new docx.TableCell({
            children: [
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: "От Заказчика",
                    bold: true,
                  }),
                ],
              }),
            ],
            width: {
              size: 4505,
              type: docx.WidthType.AUTO,
            },
          }),
          new docx.TableCell({
            children: [
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: "От Исполнителя",
                    bold: true,
                  }),
                ],
              }),
            ],
            width: {
              size: 4505,
              type: docx.WidthType.AUTO,
            },
          }),
        ],
      }),
      new docx.TableRow({
        children: [
          getTableCell("________________________", 4505),
          getTableCell("________________________", 4505),
        ],
      }),
      new docx.TableRow({
        children: [
          getTableCell("______________________ / ФИО /", 4505),
          getTableCell("___________________ / ФИО /", 4505),
        ],
      }),
    ],
  });
}

export function templateTable(): docx.ISectionOptions {
  return {
    children: [getTemplateTable()]
  }
}
