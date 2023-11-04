import { jsPDF } from "jspdf";
import type { FormData } from "../lib/formStorage.ts";
import "./TimesCyr-normal.js";
import "./TimesCyr-bold.js";
import "./TimesCyr-italic.js";
import "./TimesCyr-bolditalic.js";

function shiftCoordinates(doc: jsPDF, y: number): number {
  if (y >= 297) {
    y = 10;
    doc.addPage();
  } else {
    y += 10;
  }
  return y;
}

function writeData(
  doc: jsPDF,
  x: number,
  y: number,
  label: string,
  data: string | string[][],
): [number, number] {
  doc.text(label, x, y);
  y = shiftCoordinates(doc, y);

  if (!Array.isArray(data)) {
    doc.text(doc.splitTextToSize(data, 190), x, y);
    y = shiftCoordinates(doc, y);

    return [x, y];
  }

  const tableOffset: number = 210 / data.length;

  for (const row of data) {
    for (const cell of row) {
      if (cell === "") {
        continue;
      }

      doc.text(cell, x, y);

      if (x < 210) {
        x += tableOffset;
      } else {
        x = 10;
      }
    }

    y = shiftCoordinates(doc, y);
    x = 10;
  }

  return [x, y];
}

function addCell(
  doc: jsPDF,
  x: number,
  y: number,
  cellData: FormData,
): [number, number] {
  if (!cellData.data) {
    return [x, y];
  }
  if (cellData.title) {
    doc.setFont("TimesCyr", "bold");
    doc.text(cellData.title, x, y);
    y = shiftCoordinates(doc, y);
    doc.setFont("TimesCyr", "normal");
  }

  [x, y] = writeData(doc, x, y, cellData.label, cellData.data);

  return [x, y];
}

export function generate_pdf(formData: FormData[]): string {
  const doc = new jsPDF();
  doc.setFont("TimesCyr", "normal");
  let x: number = 10;
  let y: number = 10;

  for (const cellData of formData) {
    [x, y] = addCell(doc, x, y, cellData);
  }

  // doc.text("hello", x, y);
  return doc.output("datauristring");
}
