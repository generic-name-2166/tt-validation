import * as docx from "docx";
import { getGenericParagraph } from "./docxTemplate";

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
  return [
    getGenericParagraph(label),
    new docx.Table({
      columnWidths: [2505, 6505],
      rows: table.map(getTableRow),
    }),
  ];
}
