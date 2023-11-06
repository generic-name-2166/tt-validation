import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";
import type { autoTable } from "jspdf-autotable";
import type { FormData } from "../lib/formStorage.ts";
import "./TimesCyr-normal.js";
import "./TimesCyr-bold.js";
import "./TimesCyr-italic.js";
import "./TimesCyr-bolditalic.js";
applyPlugin(jsPDF);

interface jsPDFtable extends jsPDF {
  autoTable: autoTable;
}

function shiftCoordinates(doc: jsPDFtable, y: number): number {
  if (y >= 297) {
    y = 10;
    doc.addPage();
  } else {
    y += 10;
  }
  return y;
}

function transformData(data: string[][]): { [key: string]: string }[] {
  return data.map((row) => ({ abbr: row[0], mean: row[1] }));
}

function writeText(
  doc: jsPDFtable,
  x: number,
  y: number,
  text: string,
  label: string,
  labelOnSameLine: boolean = true,
): [number, number] {
  const splitText: string[] = labelOnSameLine
    ? doc
        .splitTextToSize(`    ${label}`, 190)
        .concat(doc.splitTextToSize(`    ${text}`, 190))
    : doc.splitTextToSize(`    ${label} - ${text}`, 190);
  for (const row of splitText) {
    doc.text(row, x, y);
    y = shiftCoordinates(doc, y);
  }

  return [x, y];
}

function writeList(
  doc: jsPDFtable,
  x: number,
  y: number,
  list: string[]
): [number, number] {
  for (const cell of list) {
    const new_cell = cell.trim();
    if (!new_cell || new_cell === "") {
      continue;
    }

    const splitText: string[] = doc.splitTextToSize(`- ${new_cell}`, 190);

    for (const row of splitText) {
      doc.text(row, x, y);
      y = shiftCoordinates(doc, y);
    }
  }

  return [x, y];
}

function writeTable(
  doc: jsPDFtable,
  x: number, 
  y: number,
  table: string[][]
): [number, number] {
  const head: { [key: string]: string }[] = [
    { abbr: "Обозначение", mean: "Расшифровка" },
  ];
  const styles = {
    abbr: { font: "TimesCyr", cellWidth: 25 },
    mean: { font: "TimesCyr" },
  };
  const new_data = transformData(table);

  doc.autoTable({
    startY: y,
    body: new_data,
    head: head,
    columnStyles: styles,
    headStyles: {
      font: "TimesCyr",
      fontStyle: "bold",
      fillColor: "#ffffff",
    },
  });
  //@ts-expect-error
  y = doc.lastAutoTable.finalY + 10;

  return [x, y];
}

function writeData(
  doc: jsPDFtable,
  x: number,
  y: number,
  label: string,
  data: string | string[][],
): [number, number] {
  if (!Array.isArray(data)) {
    return writeText(doc, x, y, data, label, true);
  }
  doc.text(label, x, y);
  y = shiftCoordinates(doc, y);

  if (data.length === 1 || data[0].length === 1) {
    return writeList(doc, x, y, data.flat(2));
  }

  return writeTable(doc, x, y, data);
}

function addCell(
  doc: jsPDFtable,
  x: number,
  y: number,
  cellData: FormData,
): [number, number] {
  if (!cellData.data) {
    return [x, y];
  } else if (cellData.title) {
    doc.setFont("TimesCyr", "bold");
    doc.text(cellData.title, x, y);
    y = shiftCoordinates(doc, y);
    doc.setFont("TimesCyr", "normal");
  }

  return writeData(doc, x, y, cellData.label, cellData.data);
}

export function generatePdf(formData: FormData[]): string {
  const doc = new jsPDF() as jsPDFtable;
  doc.setFont("TimesCyr", "normal");
  let x: number = 10;
  let y: number = 10;

  for (const cellData of formData) {
    [x, y] = addCell(doc, x, y, cellData);
  }

  return doc.output("datauristring");
}
