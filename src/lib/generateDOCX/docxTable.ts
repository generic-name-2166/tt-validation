import * as docx from "docx";
import { getGenericParagraph } from "./docxTemplate";

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

export function generateTable(
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
