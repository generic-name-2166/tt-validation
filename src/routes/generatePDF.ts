import { jsPDF } from "jspdf";
import type { FormData } from "../lib/formStorage.ts";
import './TimesCyr-normal.js';
import './TimesCyr-bold.js';
import './TimesCyr-italic.js';
import './TimesCyr-bolditalic.js';

function shiftCoordinates(doc: jsPDF, y: number) : number {
  if (y >= 297) {
    y = 10;
    doc.addPage();
  } else {
    y += 10;
  }
  return y;
}

function addCell(doc: jsPDF, x: number, y: number, cellData: FormData) : [number, number] {
  if (!cellData.data) {
    return [x, y];
  }
  console.log(cellData);
  if (cellData.title) {
    doc.text(cellData.title, x, y);
    y = shiftCoordinates(doc, y);
  }

  doc.text(cellData.label, x, y);

  return [x, y];
}

export function generate_pdf( formData: FormData[] ): string {
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
